// DeenQA database layer.
// Bismillah Ar-Rahman Ar-Raheem.
//
// The `InMemoryDatabase` class is the single entry point for all data
// operations in DeenQA. It is environment-driven:
//   - When `process.env.LIGHTBASE_API_KEY` is set, every method delegates
//     to the Lightbase HTTP client (lib/lightbase/client.ts).
//   - When the key is empty, every method falls back to the in-memory
//     maps (local dev only — never used in production).
//
// The class retains the original method names and shapes so that
// callers (lib/sdk.ts, the API routes, the React hooks) are unaffected
// by the migration. All methods are async.

import {
  Question,
  QuestionCreate,
  QuestionUpdate,
  QuestionSchema,
  QuestionCreateSchema,
  QuestionUpdateSchema,
  Topic,
  TopicCreate,
  TopicUpdate,
  TopicSchema,
  TopicCreateSchema,
  TopicUpdateSchema,
  User,
  UserCreate,
  UserUpdate,
  UserSchema,
  UserCreateSchema,
  UserUpdateSchema,
  AuditLog,
  Analytics,
  GlossaryTerm,
} from "@/lib/types"

import {
  lightbaseClient,
  LightbaseClient,
  LightbaseCollectionDefinition,
} from "@/lib/lightbase/client"

import {
  SEED_TOPICS,
  SEED_QUESTIONS,
  SEED_GLOSSARY,
  GLOSSARY_FALLBACK,
} from "@/lib/seed-data"

// ---------------------------------------------------------------------------
// Lightbase collection schema (mirrors lib/types.ts)
// ---------------------------------------------------------------------------

export const LIGHTBASE_COLLECTIONS: LightbaseCollectionDefinition[] = [
  {
    name: "questions",
    fields: [
      { name: "title", type: "text", required: true, searchable: true, maxLength: 500 },
      { name: "answer", type: "text", required: true, searchable: true },
      { name: "excerpt", type: "text", maxLength: 1000 },
      { name: "content", type: "text" },
      { name: "topicIds", type: "array", of: "string" },
      { name: "tags", type: "array", of: "string" },
      {
        name: "status",
        type: "string",
        enum: ["draft", "published", "archived"],
        default: "published",
        indexed: true,
      },
      { name: "viewCount", type: "integer", minimum: 0, default: 0 },
      { name: "bookmarkCount", type: "integer", minimum: 0, default: 0 },
      { name: "source", type: "string" },
      { name: "scholar", type: "string" },
      { name: "category", type: "string", indexed: true },
      { name: "imageUrl", type: "url" },
      { name: "createdBy", type: "string", indexed: true },
      { name: "createdAt", type: "datetime", indexed: true },
      { name: "updatedAt", type: "datetime", indexed: true },
    ],
    indexes: [
      { name: "questions_status_idx", fields: ["status"] },
      { name: "questions_category_idx", fields: ["category"] },
      { name: "questions_createdAt_idx", fields: ["createdAt"] },
    ],
  },
  {
    name: "topics",
    fields: [
      { name: "name", type: "string", required: true, maxLength: 100 },
      { name: "slug", type: "string", required: true, unique: true, indexed: true },
      { name: "description", type: "text" },
      { name: "color", type: "string" },
      { name: "questionCount", type: "integer", minimum: 0, default: 0 },
      { name: "createdAt", type: "datetime", indexed: true },
      { name: "updatedAt", type: "datetime", indexed: true },
    ],
    indexes: [
      { name: "topics_slug_idx", fields: ["slug"], unique: true },
    ],
  },
  {
    name: "users",
    fields: [
      { name: "email", type: "email", required: true, unique: true, indexed: true },
      { name: "name", type: "string", required: true, maxLength: 200 },
      { name: "role", type: "string", enum: ["user", "admin", "moderator"], default: "user" },
      { name: "avatarUrl", type: "url" },
      { name: "bio", type: "text", maxLength: 1000 },
      { name: "isActive", type: "boolean", default: true },
      { name: "emailVerified", type: "boolean", default: false },
      { name: "lastLoginAt", type: "datetime" },
      { name: "createdAt", type: "datetime", indexed: true },
      { name: "updatedAt", type: "datetime", indexed: true },
    ],
    indexes: [
      { name: "users_email_idx", fields: ["email"], unique: true },
    ],
  },
  {
    name: "audit-logs",
    fields: [
      { name: "action", type: "string", required: true, indexed: true },
      { name: "entity", type: "string", enum: ["question", "topic", "user", "auth"] },
      { name: "entityId", type: "string", indexed: true },
      { name: "userId", type: "string", indexed: true },
      { name: "data", type: "json" },
      { name: "timestamp", type: "datetime", indexed: true },
    ],
    indexes: [
      { name: "audit_timestamp_idx", fields: ["timestamp"] },
      { name: "audit_action_idx", fields: ["action"] },
    ],
  },
  {
    name: "glossary",
    fields: [
      { name: "term", type: "string", required: true, unique: true, indexed: true, searchable: true },
      { name: "arabic", type: "string" },
      { name: "transliteration", type: "string", indexed: true },
      { name: "definition", type: "text", required: true, searchable: true },
      { name: "category", type: "string", indexed: true },
    ],
    indexes: [
      { name: "glossary_term_idx", fields: ["term"], unique: true },
      { name: "glossary_category_idx", fields: ["category"] },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function toISODate(value: Date | string | undefined | null): string | undefined {
  if (!value) return undefined
  if (value instanceof Date) return value.toISOString()
  return new Date(value).toISOString()
}

function normaliseQuestion(doc: Record<string, unknown>): Question {
  const normalised: Record<string, unknown> = { ...doc }
  // Lightbase reserves _created_at / _updated_at; prefer them when the
  // user-provided fields are missing.
  if (!normalised.createdAt && normalised._created_at) {
    normalised.createdAt = normalised._created_at
  }
  if (!normalised.updatedAt && normalised._updated_at) {
    normalised.updatedAt = normalised._updated_at
  }
  return QuestionSchema.parse(normalised)
}

function normaliseTopic(doc: Record<string, unknown>): Topic {
  const normalised: Record<string, unknown> = { ...doc }
  if (!normalised.createdAt && normalised._created_at) {
    normalised.createdAt = normalised._created_at
  }
  if (!normalised.updatedAt && normalised._updated_at) {
    normalised.updatedAt = normalised._updated_at
  }
  return TopicSchema.parse(normalised)
}

function normaliseUser(doc: Record<string, unknown>): User {
  const normalised: Record<string, unknown> = { ...doc }
  if (!normalised.createdAt && normalised._created_at) {
    normalised.createdAt = normalised._created_at
  }
  if (!normalised.updatedAt && normalised._updated_at) {
    normalised.updatedAt = normalised._updated_at
  }
  if (!normalised.lastLoginAt && normalised.last_login_at) {
    normalised.lastLoginAt = normalised.last_login_at
  }
  return UserSchema.parse(normalised)
}

function questionToLightbaseDoc(q: Question | QuestionCreate): Record<string, unknown> {
  const out: Record<string, unknown> = { ...q }
  out.createdAt = toISODate((q as Question).createdAt)
  out.updatedAt = toISODate((q as Question).updatedAt)
  if ("id" in out) delete out.id // Lightbase autogenerates the id
  return out
}

function topicToLightbaseDoc(t: Topic | TopicCreate): Record<string, unknown> {
  const out: Record<string, unknown> = { ...t }
  out.createdAt = toISODate((t as Topic).createdAt)
  out.updatedAt = toISODate((t as Topic).updatedAt)
  if ("id" in out) delete out.id
  return out
}

function userToLightbaseDoc(u: User | UserCreate): Record<string, unknown> {
  const out: Record<string, unknown> = { ...u }
  out.createdAt = toISODate((u as User).createdAt)
  out.updatedAt = toISODate((u as User).updatedAt)
  if ((u as User).lastLoginAt) {
    out.lastLoginAt = toISODate((u as User).lastLoginAt)
  }
  if ("id" in out) delete out.id
  return out
}

// ---------------------------------------------------------------------------
// Audit log (in-memory fallback when Lightbase is not configured)
// ---------------------------------------------------------------------------

interface InMemoryAuditLog extends AuditLog {
  id: string
}

const inMemoryAuditLogs: InMemoryAuditLog[] = []

function pushInMemoryAudit(
  action: string,
  entity: AuditLog["entity"],
  entityId: string,
  userId: string,
  data?: Record<string, unknown>,
): void {
  inMemoryAuditLogs.push({
    id: generateId(),
    action,
    entity,
    entityId,
    userId,
    timestamp: new Date(),
    data: data ?? {},
  })
}

// ---------------------------------------------------------------------------
// Ensure Lightbase collections exist
// ---------------------------------------------------------------------------

export async function ensureLightbaseCollections(): Promise<void> {
  if (!lightbaseClient) return
  const existing = new Set<string>()
  try {
    const collections = await lightbaseClient.listCollections()
    for (const c of collections) existing.add(c.name)
  } catch (err) {
    // Surface a clear error but allow the runtime to continue —
    // the operators will run the seed script when valid creds arrive.
    console.error(
      "[db] ensureLightbaseCollections: failed to list collections:",
      err,
    )
    return
  }
  for (const def of LIGHTBASE_COLLECTIONS) {
    if (existing.has(def.name)) continue
    try {
      await lightbaseClient.createCollection(def)
      console.log(`[db] created Lightbase collection: ${def.name}`)
    } catch (err: any) {
      // 409 (conflict) is acceptable — another process created it
      if (err?.status !== 409) {
        console.error(
          `[db] failed to create collection ${def.name}:`,
          err?.message ?? err,
        )
      }
    }
  }
}

// ---------------------------------------------------------------------------
// InMemoryDatabase class
// ---------------------------------------------------------------------------

export class InMemoryDatabase {
  private questions: Map<string, Question> = new Map()
  private topics: Map<string, Topic> = new Map()
  private users: Map<string, User> = new Map()
  private seedingPromise: Promise<void> | null = null

  constructor() {
    this.seedingPromise = this.seedInitialData().catch((err) => {
      console.error("[db] seedInitialData failed:", err)
    })
  }

  // -----------------------------------------------------------------------
  // Predicates
  // -----------------------------------------------------------------------

  private useLightbase(): boolean {
    return Boolean(
      process.env.LIGHTBASE_API_KEY &&
        process.env.LIGHTBASE_API_KEY.trim() !== "" &&
        lightbaseClient,
    )
  }

  private get lb(): LightbaseClient {
    if (!lightbaseClient) {
      throw new Error(
        "Lightbase client is not initialised (LIGHTBASE_API_KEY is empty).",
      )
    }
    return lightbaseClient
  }

  /** Await internal seeding (no-op when Lightbase is not configured). */
  async ready(): Promise<void> {
    if (this.seedingPromise) await this.seedingPromise
  }

  // -----------------------------------------------------------------------
  // Seeding
  // -----------------------------------------------------------------------

  async seedInitialData(): Promise<void> {
    if (this.useLightbase()) {
      await ensureLightbaseCollections()
      await this.seedLightbaseIfEmpty()
      return
    }
    this.seedInMemory()
  }

  private seedInMemory(): void {
    if (this.topics.size > 0 || this.questions.size > 0) return

    const topicIdBySlug: Record<string, string> = {}
    for (const seedTopic of SEED_TOPICS) {
      const id = generateId()
      const now = new Date()
      const topic: Topic = {
        id,
        name: seedTopic.name,
        slug: seedTopic.slug,
        description: seedTopic.description,
        color: seedTopic.color,
        questionCount: 0,
        createdAt: now,
        updatedAt: now,
      }
      this.topics.set(id, topic)
      topicIdBySlug[seedTopic.slug] = id
    }

    for (const seedQuestion of SEED_QUESTIONS) {
      const id = generateId()
      const now = new Date()
      const topicId = topicIdBySlug[seedQuestion.topicSlug]
      const question: Question = {
        id,
        title: seedQuestion.title,
        answer: seedQuestion.answer,
        excerpt: seedQuestion.excerpt,
        topicIds: topicId ? [topicId] : [],
        tags: seedQuestion.tags,
        status: seedQuestion.status,
        source: seedQuestion.source,
        scholar: seedQuestion.scholar,
        category: seedQuestion.category,
        viewCount: seedQuestion.viewCount ?? 0,
        bookmarkCount: seedQuestion.bookmarkCount ?? 0,
        imageUrl: "",
        createdBy: "admin",
        createdAt: now,
        updatedAt: now,
      }
      this.questions.set(id, question)
      // increment topic questionCount
      if (topicId) {
        const topic = this.topics.get(topicId)
        if (topic) {
          topic.questionCount = (topic.questionCount ?? 0) + 1
          topic.updatedAt = now
        }
      }
    }
  }

  private async seedLightbaseIfEmpty(): Promise<void> {
    if (!lightbaseClient) return
    const topicsCount = await lightbaseClient.count("topics").catch(() => 0)
    if (topicsCount > 0) return // already seeded — do not duplicate

    // Insert topics and capture their IDs
    const topicIdBySlug: Record<string, string> = {}
    for (const seedTopic of SEED_TOPICS) {
      const now = new Date().toISOString()
      const doc = await lightbaseClient.insert<{ id: string }>("topics", {
        name: seedTopic.name,
        slug: seedTopic.slug,
        description: seedTopic.description,
        color: seedTopic.color,
        questionCount: 0,
        createdAt: now,
        updatedAt: now,
      })
      if (doc?.id) topicIdBySlug[seedTopic.slug] = doc.id
    }

    // Insert questions, mapping each to its topic
    const questionDocs = SEED_QUESTIONS.map((q) => {
      const topicId = topicIdBySlug[q.topicSlug]
      const now = new Date().toISOString()
      return {
        title: q.title,
        answer: q.answer,
        excerpt: q.excerpt,
        topicIds: topicId ? [topicId] : [],
        tags: q.tags,
        status: q.status,
        source: q.source,
        scholar: q.scholar,
        category: q.category,
        viewCount: q.viewCount ?? 0,
        bookmarkCount: q.bookmarkCount ?? 0,
        createdBy: "admin",
        imageUrl: "",
        createdAt: now,
        updatedAt: now,
      }
    })
    if (questionDocs.length > 0) {
      await lightbaseClient.bulkInsert("questions", questionDocs).catch((err) => {
        console.error("[db] bulkInsert questions failed:", err)
      })
    }
  }

  // -----------------------------------------------------------------------
  // Questions
  // -----------------------------------------------------------------------

  async createQuestion(data: QuestionCreate): Promise<Question> {
    const validatedData = QuestionCreateSchema.parse(data)
    if (this.useLightbase()) {
      const doc = await this.lb.insert<Record<string, unknown>>(
        "questions",
        questionToLightbaseDoc(validatedData),
      )
      const q = normaliseQuestion(doc)
      await this.updateTopicQuestionCountsFor(q.topicIds ?? [])
      return q
    }
    const id = generateId()
    const now = new Date()
    const question: Question = {
      ...validatedData,
      id,
      topicIds: validatedData.topicIds ?? [],
      tags: validatedData.tags ?? [],
      status: validatedData.status ?? "published",
      viewCount: validatedData.viewCount ?? 0,
      bookmarkCount: validatedData.bookmarkCount ?? 0,
      createdAt: now,
      updatedAt: now,
    }
    QuestionSchema.parse(question)
    this.questions.set(id, question)
    this.updateInMemoryTopicQuestionCounts(question.topicIds ?? [])
    return question
  }

  async getQuestion(id: string): Promise<Question | null> {
    if (this.useLightbase()) {
      const doc = await this.lb.getOne<Record<string, unknown>>("questions", id)
      if (!doc) return null
      return normaliseQuestion(doc)
    }
    return this.questions.get(id) ?? null
  }

  async getAllQuestions(): Promise<Question[]> {
    if (this.useLightbase()) {
      const res = await this.lb.query<Record<string, unknown>>("questions", {
        limit: 1000,
        sort: "createdAt:desc",
      })
      return res.data.map(normaliseQuestion)
    }
    return Array.from(this.questions.values())
  }

  async getQuestionsByTopicId(topicId: string): Promise<Question[]> {
    if (this.useLightbase()) {
      const res = await this.lb.query<Record<string, unknown>>("questions", {
        filter: { field: "topicIds", op: "contains", value: topicId },
        limit: 1000,
        sort: "createdAt:desc",
      })
      return res.data.map(normaliseQuestion)
    }
    return this.getAllQuestionsSync().filter((q) => q.topicIds?.includes(topicId))
  }

  async getQuestionsByTags(tags: string[]): Promise<Question[]> {
    if (this.useLightbase()) {
      // Lightbase arrayContains expects the field to contain ALL listed values.
      // For OR semantics (any tag), we issue one query per tag and merge.
      const seen = new Set<string>()
      const merged: Question[] = []
      for (const tag of tags) {
        const res = await this.lb.query<Record<string, unknown>>("questions", {
          filter: { field: "tags", op: "contains", value: tag },
          limit: 1000,
        })
        for (const d of res.data) {
          const q = normaliseQuestion(d)
          if (!seen.has(q.id)) {
            seen.add(q.id)
            merged.push(q)
          }
        }
      }
      return merged
    }
    return this.getAllQuestionsSync().filter((q) =>
      tags.some((tag) => q.tags?.includes(tag)),
    )
  }

  async updateQuestion(data: QuestionUpdate): Promise<Question | null> {
    const validatedData = QuestionUpdateSchema.parse(data)
    if (this.useLightbase()) {
      try {
        const doc = await this.lb.update<Record<string, unknown>>(
          "questions",
          validatedData.id,
          questionToLightbaseDoc(validatedData as Question),
        )
        const q = normaliseQuestion(doc)
        await this.updateTopicQuestionCountsFor(q.topicIds ?? [])
        return q
      } catch (err: any) {
        if (err?.code === "not_found" || err?.status === 404) return null
        throw err
      }
    }
    const existingQuestion = this.questions.get(validatedData.id)
    if (!existingQuestion) return null
    const oldTopicIds = existingQuestion.topicIds ?? []
    const updatedQuestion: Question = {
      ...existingQuestion,
      ...validatedData,
      updatedAt: new Date(),
    }
    QuestionSchema.parse(updatedQuestion)
    this.questions.set(updatedQuestion.id, updatedQuestion)
    const newTopicIds = updatedQuestion.topicIds ?? []
    if (JSON.stringify(oldTopicIds) !== JSON.stringify(newTopicIds)) {
      this.updateInMemoryTopicQuestionCounts([...oldTopicIds, ...newTopicIds])
    }
    return updatedQuestion
  }

  async deleteQuestion(id: string): Promise<boolean> {
    if (this.useLightbase()) {
      const ok = await this.lb.delete("questions", id)
      if (!ok) return false
      return true
    }
    const question = this.questions.get(id)
    if (!question) return false
    this.questions.delete(id)
    this.updateInMemoryTopicQuestionCounts(question.topicIds ?? [])
    return true
  }

  async incrementQuestionView(id: string): Promise<boolean> {
    if (this.useLightbase()) {
      try {
        const doc = await this.lb.getOne<Record<string, unknown>>("questions", id)
        if (!doc) return false
        const current = Number(doc.viewCount ?? 0)
        await this.lb.update("questions", id, {
          viewCount: current + 1,
          updatedAt: new Date().toISOString(),
        })
        return true
      } catch {
        return false
      }
    }
    const question = this.questions.get(id)
    if (!question) return false
    question.viewCount = (question.viewCount ?? 0) + 1
    question.updatedAt = new Date()
    return true
  }

  async searchQuestions(query: string): Promise<Question[]> {
    const trimmed = query.trim()
    if (this.useLightbase()) {
      if (!trimmed) {
        const res = await this.lb.query<Record<string, unknown>>("questions", {
          limit: 100,
        })
        return res.data.map(normaliseQuestion)
      }
      // Lightbase /search uses the FTS index over searchable fields
      const hits = await this.lb.search<Record<string, unknown>>("questions", trimmed, 100)
      return hits.map(normaliseQuestion)
    }
    const lower = trimmed.toLowerCase()
    return this.getAllQuestionsSync().filter(
      (q) =>
        q.title.toLowerCase().includes(lower) ||
        q.answer.toLowerCase().includes(lower) ||
        q.excerpt?.toLowerCase().includes(lower) ||
        q.tags?.some((tag) => tag.toLowerCase().includes(lower)),
    )
  }

  // -----------------------------------------------------------------------
  // Topics
  // -----------------------------------------------------------------------

  async createTopic(data: TopicCreate): Promise<Topic> {
    const validatedData = TopicCreateSchema.parse(data)
    if (this.useLightbase()) {
      const doc = await this.lb.insert<Record<string, unknown>>(
        "topics",
        topicToLightbaseDoc(validatedData),
      )
      return normaliseTopic(doc)
    }
    const id = generateId()
    const now = new Date()
    const topic: Topic = {
      ...validatedData,
      id,
      questionCount: validatedData.questionCount ?? 0,
      createdAt: now,
      updatedAt: now,
    }
    TopicSchema.parse(topic)
    this.topics.set(id, topic)
    return topic
  }

  async getTopic(id: string): Promise<Topic | null> {
    if (this.useLightbase()) {
      const doc = await this.lb.getOne<Record<string, unknown>>("topics", id)
      if (!doc) return null
      return normaliseTopic(doc)
    }
    return this.topics.get(id) ?? null
  }

  async getTopicBySlug(slug: string): Promise<Topic | null> {
    if (this.useLightbase()) {
      const res = await this.lb.query<Record<string, unknown>>("topics", {
        filter: { field: "slug", op: "eq", value: slug },
        limit: 1,
      })
      if (res.data.length === 0) return null
      return normaliseTopic(res.data[0])
    }
    return (
      Array.from(this.topics.values()).find((t) => t.slug === slug) ?? null
    )
  }

  async getAllTopics(): Promise<Topic[]> {
    if (this.useLightbase()) {
      const res = await this.lb.query<Record<string, unknown>>("topics", {
        limit: 1000,
        sort: "name:asc",
      })
      return res.data.map(normaliseTopic)
    }
    return Array.from(this.topics.values())
  }

  async updateTopic(data: TopicUpdate): Promise<Topic | null> {
    const validatedData = TopicUpdateSchema.parse(data)
    if (this.useLightbase()) {
      try {
        const doc = await this.lb.update<Record<string, unknown>>(
          "topics",
          validatedData.id,
          topicToLightbaseDoc(validatedData as Topic),
        )
        return normaliseTopic(doc)
      } catch (err: any) {
        if (err?.code === "not_found" || err?.status === 404) return null
        throw err
      }
    }
    const existingTopic = this.topics.get(validatedData.id)
    if (!existingTopic) return null
    const updatedTopic: Topic = {
      ...existingTopic,
      ...validatedData,
      updatedAt: new Date(),
    }
    TopicSchema.parse(updatedTopic)
    this.topics.set(updatedTopic.id, updatedTopic)
    return updatedTopic
  }

  async deleteTopic(id: string): Promise<boolean> {
    if (this.useLightbase()) {
      return this.lb.delete("topics", id)
    }
    const topic = this.topics.get(id)
    if (!topic) return false
    this.topics.delete(id)
    return true
  }

  async searchTopics(query: string): Promise<Topic[]> {
    const trimmed = query.trim()
    if (this.useLightbase()) {
      if (!trimmed) {
        const res = await this.lb.query<Record<string, unknown>>("topics", {
          limit: 100,
        })
        return res.data.map(normaliseTopic)
      }
      const hits = await this.lb.search<Record<string, unknown>>("topics", trimmed, 100)
      if (hits.length > 0) return hits.map(normaliseTopic)
      // Fallback: ilike on name/slug/description
      const res = await this.lb.query<Record<string, unknown>>("topics", {
        filter: {
          or: [
            { field: "name", op: "ilike", value: `%${trimmed}%` },
            { field: "slug", op: "ilike", value: `%${trimmed}%` },
            { field: "description", op: "ilike", value: `%${trimmed}%` },
          ],
        },
        limit: 100,
      })
      return res.data.map(normaliseTopic)
    }
    const lower = trimmed.toLowerCase()
    return Array.from(this.topics.values()).filter(
      (t) =>
        t.name.toLowerCase().includes(lower) ||
        t.slug.toLowerCase().includes(lower) ||
        t.description?.toLowerCase().includes(lower),
    )
  }

  // -----------------------------------------------------------------------
  // Users
  // -----------------------------------------------------------------------

  async createUser(data: UserCreate): Promise<User> {
    const validatedData = UserCreateSchema.parse(data)
    if (this.useLightbase()) {
      const doc = await this.lb.insert<Record<string, unknown>>(
        "users",
        userToLightbaseDoc(validatedData),
      )
      return normaliseUser(doc)
    }
    const id = generateId()
    const now = new Date()
    const user: User = {
      ...validatedData,
      id,
      role: validatedData.role ?? "user",
      isActive: validatedData.isActive ?? true,
      emailVerified: validatedData.emailVerified ?? false,
      createdAt: now,
      updatedAt: now,
    }
    UserSchema.parse(user)
    this.users.set(id, user)
    return user
  }

  async getUser(id: string): Promise<User | null> {
    if (this.useLightbase()) {
      const doc = await this.lb.getOne<Record<string, unknown>>("users", id)
      if (!doc) return null
      return normaliseUser(doc)
    }
    return this.users.get(id) ?? null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (this.useLightbase()) {
      const res = await this.lb.query<Record<string, unknown>>("users", {
        filter: { field: "email", op: "eq", value: email.toLowerCase() },
        limit: 1,
      })
      if (res.data.length === 0) return null
      return normaliseUser(res.data[0])
    }
    return (
      Array.from(this.users.values()).find((u) => u.email === email) ?? null
    )
  }

  async getAllUsers(): Promise<User[]> {
    if (this.useLightbase()) {
      const res = await this.lb.query<Record<string, unknown>>("users", {
        limit: 1000,
      })
      return res.data.map(normaliseUser)
    }
    return Array.from(this.users.values())
  }

  async updateUser(data: UserUpdate): Promise<User | null> {
    const validatedData = UserUpdateSchema.parse(data)
    if (this.useLightbase()) {
      try {
        const doc = await this.lb.update<Record<string, unknown>>(
          "users",
          validatedData.id,
          userToLightbaseDoc(validatedData as User),
        )
        return normaliseUser(doc)
      } catch (err: any) {
        if (err?.code === "not_found" || err?.status === 404) return null
        throw err
      }
    }
    const existingUser = this.users.get(validatedData.id)
    if (!existingUser) return null
    const updatedUser: User = {
      ...existingUser,
      ...validatedData,
      updatedAt: new Date(),
    }
    UserSchema.parse(updatedUser)
    this.users.set(updatedUser.id, updatedUser)
    return updatedUser
  }

  async deleteUser(id: string): Promise<boolean> {
    if (this.useLightbase()) {
      return this.lb.delete("users", id)
    }
    const user = this.users.get(id)
    if (!user) return false
    this.users.delete(id)
    return true
  }

  async updateUserLastLogin(id: string): Promise<User | null> {
    if (this.useLightbase()) {
      try {
        const doc = await this.lb.update<Record<string, unknown>>("users", id, {
          lastLoginAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        return normaliseUser(doc)
      } catch (err: any) {
        if (err?.code === "not_found" || err?.status === 404) return null
        throw err
      }
    }
    const user = this.users.get(id)
    if (!user) return null
    const now = new Date()
    const updatedUser: User = {
      ...user,
      lastLoginAt: now,
      updatedAt: now,
    }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  async searchUsers(query: string): Promise<User[]> {
    const trimmed = query.trim()
    if (this.useLightbase()) {
      if (!trimmed) {
        const res = await this.lb.query<Record<string, unknown>>("users", {
          limit: 100,
        })
        return res.data.map(normaliseUser)
      }
      const res = await this.lb.query<Record<string, unknown>>("users", {
        filter: {
          or: [
            { field: "name", op: "ilike", value: `%${trimmed}%` },
            { field: "email", op: "ilike", value: `%${trimmed}%` },
          ],
        },
        limit: 100,
      })
      return res.data.map(normaliseUser)
    }
    const lower = trimmed.toLowerCase()
    return Array.from(this.users.values()).filter(
      (u) =>
        u.name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower) ||
        u.bio?.toLowerCase().includes(lower),
    )
  }

  // -----------------------------------------------------------------------
  // Analytics + audit + glossary
  // -----------------------------------------------------------------------

  async getAnalytics(): Promise<Analytics> {
    const questions = await this.getAllQuestions()
    const topics = await this.getAllTopics()
    const totalViews = questions.reduce((s, q) => s + (q.viewCount ?? 0), 0)
    const totalBookmarks = questions.reduce(
      (s, q) => s + (q.bookmarkCount ?? 0),
      0,
    )
    return {
      totalQuestions: questions.length,
      totalTopics: topics.length,
      totalViews,
      totalBookmarks,
      dailyStats: [],
    }
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    if (this.useLightbase()) {
      const res = await this.lb.query<Record<string, unknown>>("audit-logs", {
        limit: 200,
        sort: "timestamp:desc",
      })
      return res.data.map((d) => {
        const out: Record<string, unknown> = { ...d }
        if (!out.timestamp && out._created_at) {
          out.timestamp = out._created_at
        }
        return {
          id: String(out.id ?? ""),
          action: String(out.action ?? ""),
          entity: (out.entity as AuditLog["entity"]) ?? "question",
          entityId: String(out.entityId ?? ""),
          userId: String(out.userId ?? ""),
          timestamp: out.timestamp ? new Date(out.timestamp as string) : new Date(),
          data: (out.data as Record<string, unknown>) ?? {},
        }
      })
    }
    return inMemoryAuditLogs
      .slice()
      .sort((a, b) => (b.timestamp.getTime() - a.timestamp.getTime()))
      .map(({ ...x }) => ({
        ...x,
        timestamp: new Date(x.timestamp),
      }))
  }

  async logAudit(
    action: string,
    entity: AuditLog["entity"],
    entityId: string,
    userId: string,
    data?: Record<string, unknown>,
  ): Promise<void> {
    if (this.useLightbase()) {
      try {
        await this.lb.insert("audit-logs", {
          action,
          entity,
          entityId,
          userId,
          data: data ?? {},
          timestamp: new Date().toISOString(),
        })
      } catch (err) {
        console.error("[db] logAudit (Lightbase) failed:", err)
      }
      return
    }
    pushInMemoryAudit(action, entity, entityId, userId, data)
  }

  async getGlossary(): Promise<GlossaryTerm[]> {
    if (this.useLightbase()) {
      try {
        const res = await this.lb.query<Record<string, unknown>>("glossary", {
          limit: 1000,
          sort: "term:asc",
        })
        if (res.data.length > 0) {
          return res.data.map((d) => ({
            id: String(d.id ?? ""),
            term: String(d.term ?? ""),
            definition: String(d.definition ?? ""),
            category: String(d.category ?? ""),
            transliteration: d.transliteration
              ? String(d.transliteration)
              : undefined,
            arabic: d.arabic ? String(d.arabic) : undefined,
          }))
        }
      } catch (err) {
        console.error("[db] getGlossary (Lightbase) failed:", err)
      }
    }
    return GLOSSARY_FALLBACK
  }

  async upsertGlossaryTerm(
    term: GlossaryTerm,
  ): Promise<GlossaryTerm | null> {
    if (this.useLightbase()) {
      try {
        const res = await this.lb.upsert<GlossaryTerm>(
          "glossary",
          { field: "term", op: "eq", value: term.term },
          {
            term: term.term,
            arabic: term.arabic,
            transliteration: term.transliteration,
            definition: term.definition,
            category: term.category,
          },
        )
        return res.document
      } catch (err) {
        console.error("[db] upsertGlossaryTerm failed:", err)
        return null
      }
    }
    return null
  }

  // -----------------------------------------------------------------------
  // Helpers: in-memory synchronous readers (for branches that filter
  // post-fetch) + topic question-count maintenance.
  // -----------------------------------------------------------------------

  private getAllQuestionsSync(): Question[] {
    return Array.from(this.questions.values())
  }

  private updateInMemoryTopicQuestionCounts(topicIds: string[]): void {
    const uniqueTopicIds = [...new Set(topicIds)]
    for (const topicId of uniqueTopicIds) {
      const topic = this.topics.get(topicId)
      if (topic) {
        const count = this.getAllQuestionsSync().filter((q) =>
          q.topicIds?.includes(topicId),
        ).length
        topic.questionCount = count
        topic.updatedAt = new Date()
      }
    }
  }

  private async updateTopicQuestionCountsFor(topicIds: string[]): Promise<void> {
    if (!this.useLightbase()) {
      this.updateInMemoryTopicQuestionCounts(topicIds)
      return
    }
    const uniqueTopicIds = [...new Set(topicIds)]
    for (const topicId of uniqueTopicIds) {
      if (!topicId) continue
      const count = await this.lb.count("questions", {
        field: "topicIds",
        op: "contains",
        value: topicId,
      })
      await this.lb.update("topics", topicId, {
        questionCount: count,
        updatedAt: new Date().toISOString(),
      }).catch(() => {})
    }
  }

  async updateTopicQuestionCounts(): Promise<void> {
    if (this.useLightbase()) {
      const topics = await this.getAllTopics()
      for (const t of topics) {
        const count = await this.lb.count("questions", {
          field: "topicIds",
          op: "contains",
          value: t.id,
        })
        await this.lb.update("topics", t.id, {
          questionCount: count,
          updatedAt: new Date().toISOString(),
        }).catch(() => {})
      }
      return
    }
    const allTopicIds = Array.from(this.topics.keys())
    this.updateInMemoryTopicQuestionCounts(allTopicIds)
  }
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

export const db = new InMemoryDatabase()

export default InMemoryDatabase

// Expose the seed glossary for callers that need it offline
export { SEED_GLOSSARY, GLOSSARY_FALLBACK }
