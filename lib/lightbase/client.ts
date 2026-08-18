// Lightbase universal HTTP client.
// Bismillah Ar-Rahman Ar-Raheem.

/**
 * `LightbaseClient` is a thin fetch-only wrapper around the Lightbase REST
 * API documented in the "Lightbase db" reference. It is environment-driven:
 * the singleton `lightbaseClient` is `null` when `LIGHTBASE_API_KEY` is
 * empty, so callers can branch cleanly between Lightbase (production) and
 * the in-memory fallback (local dev).
 *
 * Every authenticated request carries:
 *   - `apikey: <LIGHTBASE_API_KEY>` header
 *   - `x-lightbase-project: <LIGHTBASE_PROJECT>` header
 *
 * Errors are typed so callers can branch on 401/403/404/409 etc.
 */

export type LightbaseFieldType =
  | "string"
  | "text"
  | "number"
  | "integer"
  | "boolean"
  | "date"
  | "datetime"
  | "json"
  | "array"
  | "uuid"
  | "url"
  | "email"
  | "phone"
  | "ip"
  | "color"
  | "decimal"
  | "currency"
  | "duration"
  | "point"
  | "polygon"
  | "binary"
  | "vector"
  | "reference"

export interface LightbaseFieldDefinition {
  name: string
  type: LightbaseFieldType
  required?: boolean
  unique?: boolean
  indexed?: boolean
  default?: unknown
  maxLength?: number
  minimum?: number
  maximum?: number
  enum?: (string | number)[]
  precision?: number
  currency?: string
  dimensions?: number
  refCollection?: string
  cascade?: boolean
  maxBytes?: number
  searchable?: boolean
  defaultRegion?: string
  description?: string
  of?: LightbaseFieldType
}

export interface LightbaseIndexDefinition {
  name: string
  fields: string[]
  unique?: boolean
}

export interface LightbaseCollectionDefinition {
  name: string
  fields: LightbaseFieldDefinition[]
  indexes?: LightbaseIndexDefinition[]
}

export interface LightbaseCollectionMetadata {
  name: string
  fields?: LightbaseFieldDefinition[]
  indexes?: LightbaseIndexDefinition[]
  schema?: {
    revision?: number
    [k: string]: unknown
  }
  [k: string]: unknown
}

export interface LightbaseQueryFilter {
  field?: string
  op?: string
  value?: unknown
  and?: LightbaseQueryFilter[]
  or?: LightbaseQueryFilter[]
}

export interface LightbaseQueryOptions {
  filter?: LightbaseQueryFilter
  sort?: string
  limit?: number
  cursor?: { limit: number; offset: number }
  after?: string
  count?: boolean
  select?: string
}

export interface LightbaseQueryResponse<T> {
  data: T[]
  nextCursor?: { limit: number; offset: number } | null
  total?: number
  hasMore?: boolean
  count?: number
}

export interface LightbaseUpsertResponse<T> {
  document: T
  created: boolean
}

export interface LightbaseBulkInsert {
  collection: string
  document: Record<string, unknown>
}

export interface LightbaseBulkResponse {
  inserted: number
  updated: number
  deleted: number
  errors: unknown[]
}

export interface LightbaseSeedResponse {
  inserted: number
  skipped: number
  errors: unknown[]
}

// ---------------------------------------------------------------------------
// Typed errors
// ---------------------------------------------------------------------------

export type LightbaseErrorCode =
  | "validation.failed"
  | "auth.invalid_credentials"
  | "authz.forbidden"
  | "not_found"
  | "storage.conflict"
  | "quota.exceeded"
  | "rate_limit.exceeded"
  | "internal.error"
  | "network_error"
  | "unknown"

export class LightbaseError extends Error {
  readonly status: number
  readonly code: LightbaseErrorCode
  readonly domain?: string
  readonly correlationId?: string
  readonly details?: unknown
  readonly method?: string
  readonly path?: string

  constructor(params: {
    message: string
    status: number
    code: LightbaseErrorCode
    domain?: string
    correlationId?: string
    details?: unknown
    method?: string
    path?: string
  }) {
    super(params.message)
    this.name = "LightbaseError"
    this.status = params.status
    this.code = params.code
    this.domain = params.domain
    this.correlationId = params.correlationId
    this.details = params.details
    this.method = params.method
    this.path = params.path
  }

  static fromStatus(status: number, payload: any): LightbaseError {
    const err = payload?.error ?? payload ?? {}
    const code: LightbaseErrorCode = (() => {
      const raw = String(err.code ?? "").toLowerCase()
      if (raw.includes("auth.invalid") || status === 401)
        return "auth.invalid_credentials"
      if (raw.includes("forbidden") || status === 403) return "authz.forbidden"
      if (raw.includes("not_found") || status === 404) return "not_found"
      if (raw.includes("conflict") || status === 409) return "storage.conflict"
      if (raw.includes("quota") || status === 429 && raw.includes("quota"))
        return "quota.exceeded"
      if (status === 429) return "rate_limit.exceeded"
      if (raw.includes("validation")) return "validation.failed"
      if (status >= 500) return "internal.error"
      return "unknown"
    })()
    return new LightbaseError({
      message: String(err.message ?? `Lightbase error ${status}`),
      status,
      code,
      domain: err.domain,
      correlationId: payload?.correlationId,
      details: err.details,
      method: err.method,
      path: err.path,
    })
  }
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export interface LightbaseClientConfig {
  baseUrl: string
  apiKey: string
  project: string
  tenant?: string
}

export class LightbaseClient {
  readonly baseUrl: string
  readonly apiKey: string
  readonly project: string
  readonly tenant: string

  constructor(config: LightbaseClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "")
    this.apiKey = config.apiKey
    this.project = config.project
    this.tenant = config.tenant ?? "default"
  }

  // -----------------------------------------------------------------------
  // Low-level fetch
  // -----------------------------------------------------------------------

  private async request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const url = path.startsWith("http")
      ? path
      : `${this.baseUrl}${path}`

    const headers: Record<string, string> = {
      "x-lightbase-project": this.project,
      apikey: this.apiKey,
      ...(init.headers as Record<string, string> | undefined),
    }

    if (init.body !== undefined && init.body !== null) {
      headers["Content-Type"] = headers["Content-Type"] ?? "application/json"
    }

    let res: Response
    try {
      res = await fetch(url, { ...init, headers })
    } catch (err) {
      throw new LightbaseError({
        message: `Network error contacting Lightbase: ${
          err instanceof Error ? err.message : String(err)
        }`,
        status: 0,
        code: "network_error",
      })
    }

    const text = await res.text()
    let payload: unknown = undefined
    if (text) {
      try {
        payload = JSON.parse(text)
      } catch {
        payload = text
      }
    }

    if (!res.ok) {
      throw LightbaseError.fromStatus(res.status, payload)
    }

    return (payload ?? ({} as T)) as T
  }

  // -----------------------------------------------------------------------
  // Health
  // -----------------------------------------------------------------------

  async health(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`)
      if (!res.ok) return false
      const data: any = await res.json().catch(() => ({}))
      return data?.status === "ok"
    } catch {
      return false
    }
  }

  // -----------------------------------------------------------------------
  // Collections
  // -----------------------------------------------------------------------

  async listCollections(): Promise<LightbaseCollectionMetadata[]> {
    const data = await this.request<LightbaseCollectionMetadata[] | {
      collections?: LightbaseCollectionMetadata[]
    }>(
      `/api/v1/projects/${encodeURIComponent(this.project)}/collections`,
      { method: "GET" },
    )
    if (Array.isArray(data)) return data
    return data.collections ?? []
  }

  async getCollection(
    name: string,
  ): Promise<LightbaseCollectionMetadata> {
    return this.request<LightbaseCollectionMetadata>(
      `/api/v1/projects/${encodeURIComponent(this.project)}/collections/${encodeURIComponent(name)}`,
      { method: "GET" },
    )
  }

  async createCollection(def: LightbaseCollectionDefinition): Promise<LightbaseCollectionMetadata> {
    return this.request<LightbaseCollectionMetadata>(
      `/api/v1/projects/${encodeURIComponent(this.project)}/collections`,
      {
        method: "POST",
        body: JSON.stringify(def),
      },
    )
  }

  async deleteCollection(name: string): Promise<void> {
    await this.request<void>(
      `/api/v1/projects/${encodeURIComponent(this.project)}/collections/${encodeURIComponent(name)}`,
      { method: "DELETE" },
    )
  }

  // -----------------------------------------------------------------------
  // Documents
  // -----------------------------------------------------------------------

  async insert<T = Record<string, unknown>>(
    collection: string,
    doc: Record<string, unknown>,
  ): Promise<T> {
    const res = await this.request<{ document: T }>(
      `/api/v1/projects/${encodeURIComponent(this.project)}/collections/${encodeURIComponent(collection)}`,
      {
        method: "POST",
        body: JSON.stringify(doc),
      },
    )
    return res.document
  }

  async bulkInsert<T = Record<string, unknown>>(
    collection: string,
    docs: Record<string, unknown>[],
  ): Promise<{ inserted: number; skipped: number; errors: unknown[] }> {
    const res = await this.request<LightbaseSeedResponse>(
      `/api/v1/projects/${encodeURIComponent(this.project)}/seed`,
      {
        method: "POST",
        body: JSON.stringify({ collection, documents: docs, dedupOn: [] }),
      },
    )
    return {
      inserted: res.inserted ?? docs.length,
      skipped: res.skipped ?? 0,
      errors: res.errors ?? [],
    }
  }

  async getOne<T = Record<string, unknown>>(
    collection: string,
    id: string,
  ): Promise<T | null> {
    try {
      const res = await this.request<{ document: T } | T>(
        `/api/v1/projects/${encodeURIComponent(this.project)}/collections/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`,
        { method: "GET" },
      )
      if (res && typeof res === "object" && "document" in res) {
        return (res as { document: T }).document
      }
      return res as T
    } catch (err) {
      if (err instanceof LightbaseError && err.code === "not_found") {
        return null
      }
      throw err
    }
  }

  async update<T = Record<string, unknown>>(
    collection: string,
    id: string,
    patch: Record<string, unknown>,
  ): Promise<T> {
    const res = await this.request<{ document: T }>(
      `/api/v1/projects/${encodeURIComponent(this.project)}/collections/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(patch),
      },
    )
    return res.document
  }

  async delete(collection: string, id: string): Promise<boolean> {
    try {
      await this.request<void>(
        `/api/v1/projects/${encodeURIComponent(this.project)}/collections/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`,
        { method: "DELETE" },
      )
      return true
    } catch (err) {
      if (err instanceof LightbaseError && err.code === "not_found") {
        return false
      }
      throw err
    }
  }

  async query<T = Record<string, unknown>>(
    collection: string,
    options: LightbaseQueryOptions = {},
  ): Promise<LightbaseQueryResponse<T>> {
    const params = new URLSearchParams()
    if (options.filter) {
      params.set("filter", JSON.stringify(options.filter))
    }
    if (options.sort) params.set("sort", options.sort)
    if (options.limit !== undefined) {
      params.set("limit", String(options.limit))
    }
    if (options.cursor) {
      params.set("cursor", JSON.stringify(options.cursor))
    }
    if (options.after) params.set("after", options.after)
    if (options.count) params.set("count", "true")
    if (options.select) params.set("select", options.select)

    const qs = params.toString() ? `?${params.toString()}` : ""
    const data = await this.request<LightbaseQueryResponse<T> | T[]>(
      `/api/v1/projects/${encodeURIComponent(this.project)}/collections/${encodeURIComponent(collection)}/docs${qs}`,
      { method: "GET" },
    )
    if (Array.isArray(data)) {
      return {
        data,
        nextCursor: null,
        total: data.length,
        hasMore: false,
      }
    }
    const obj = data as LightbaseQueryResponse<T>
    return {
      data: obj.data ?? [],
      nextCursor: obj.nextCursor ?? null,
      total: obj.total,
      hasMore: obj.hasMore,
      count: obj.count,
    }
  }

  async search<T = Record<string, unknown>>(
    collection: string,
    query: string,
    limit = 25,
  ): Promise<T[]> {
    const res = await this.request<{ data?: T[]; results?: T[]; total?: number }>(
      `/api/v1/projects/${encodeURIComponent(this.project)}/collections/${encodeURIComponent(collection)}/search`,
      {
        method: "POST",
        body: JSON.stringify({ query, limit }),
      },
    )
    return res.data ?? res.results ?? []
  }

  async upsert<T = Record<string, unknown>>(
    collection: string,
    filter: LightbaseQueryFilter,
    document: Record<string, unknown>,
  ): Promise<LightbaseUpsertResponse<T>> {
    const res = await this.request<LightbaseUpsertResponse<T>>(
      `/api/v1/projects/${encodeURIComponent(this.project)}/collections/${encodeURIComponent(collection)}/upsert`,
      {
        method: "PUT",
        body: JSON.stringify({ filter, document }),
      },
    )
    return res
  }

  async count(
    collection: string,
    filter?: LightbaseQueryFilter,
  ): Promise<number> {
    const data = await this.query(collection, {
      filter,
      limit: 1,
      count: true,
    })
    if (data.count !== undefined) return data.count
    if (data.total !== undefined) return data.total
    return data.data.length
  }
}

// ---------------------------------------------------------------------------
// Singleton (env-driven)
// ---------------------------------------------------------------------------

function buildClientFromEnv(): LightbaseClient | null {
  const apiKey = process.env.LIGHTBASE_API_KEY?.trim()
  const baseUrl = process.env.LIGHTBASE_BASE_URL?.trim()
  const project = process.env.LIGHTBASE_PROJECT?.trim() || "deenqa"
  const tenant = process.env.LIGHTBASE_TENANT?.trim() || "default"

  if (!apiKey || !baseUrl) {
    return null
  }
  return new LightbaseClient({ baseUrl, apiKey, project, tenant })
}

export const lightbaseClient: LightbaseClient | null = buildClientFromEnv()

export function isLightbaseEnabled(): boolean {
  return lightbaseClient !== null
}

export default lightbaseClient
