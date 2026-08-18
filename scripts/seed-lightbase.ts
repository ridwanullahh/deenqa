// Bismillah Ar-Rahman Ar-Roheem.
//
// Seed script: ensures Lightbase collections exist (topics, questions,
// glossary, audit-logs), then upserts the seed data from
// lib/seed-data.ts into Lightbase. Idempotent: safe to run repeatedly.
//
// Run: npx tsx scripts/seed-lightbase.ts
//
// Env vars (see .env.example):
//   LIGHTBASE_API_KEY, LIGHTBASE_BASE_URL,
//   LIGHTBASE_PROJECT (=deenqa), LIGHTBASE_TENANT (=default)

import { LightbaseClient, type LightbaseCollectionDefinition } from "../lib/lightbase/client"
import { SEED_TOPICS, SEED_QUESTIONS, SEED_GLOSSARY, type SeedQuestion } from "../lib/seed-data"

async function main() {
  const apiKey = process.env.LIGHTBASE_API_KEY
  const baseUrl = process.env.LIGHTBASE_BASE_URL
  const project = process.env.LIGHTBASE_PROJECT
  const tenant = process.env.LIGHTBASE_TENANT || "default"

  if (!apiKey || !baseUrl || !project) {
    console.error(
      "[seed-lightbase] ERROR: LIGHTBASE_API_KEY, LIGHTBASE_BASE_URL, and LIGHTBASE_PROJECT must be set.",
    )
    console.error("[seed-lightbase] Set them in .env (see .env.example). No fallback to in-memory in production.")
    process.exit(2)
  }

  const client = new LightbaseClient({ baseUrl, apiKey, project, tenant })

  console.log("-".repeat(60))
  console.log("[seed-lightbase] Starting")
  console.log(`[seed-lightbase] Project: ${project}`)
  console.log(`[seed-lightbase] Tenant:  ${tenant}`)
  console.log(`[seed-lightbase] Base:    ${baseUrl}`)

  // 1. Health check
  try {
    const ok = await client.health()
    if (!ok) throw new Error("health endpoint returned false")
    console.log("[seed-lightbase] Server health: ok")
  } catch (e) {
    console.error("[seed-lightbase] Health check failed:", (e as Error).message)
    process.exit(1)
  }

  // 2. Define collection schemas
  const collections: LightbaseCollectionDefinition[] = [
    {
      name: "topics",
      fields: [
        { name: "name", type: "string", required: true, indexed: true },
        { name: "slug", type: "string", required: true, unique: true, indexed: true },
        { name: "description", type: "text", searchable: true },
        { name: "color", type: "string" },
        { name: "questionCount", type: "integer", default: 0 },
        { name: "createdAt", type: "datetime" },
        { name: "updatedAt", type: "datetime" },
      ],
      indexes: [{ name: "topics_slug_idx", fields: ["slug"], unique: true }],
    },
    {
      name: "questions",
      fields: [
        { name: "title", type: "text", required: true, searchable: true, indexed: true },
        { name: "answer", type: "text", required: true, searchable: true },
        { name: "excerpt", type: "text", searchable: true },
        { name: "topicIds", type: "array", of: "string" },
        { name: "tags", type: "array", of: "string" },
        { name: "status", type: "string", default: "published", indexed: true },
        { name: "viewCount", type: "integer", default: 0 },
        { name: "bookmarkCount", type: "integer", default: 0 },
        { name: "source", type: "string" },
        { name: "scholar", type: "string" },
        { name: "createdBy", type: "string" },
        { name: "createdAt", type: "datetime" },
        { name: "updatedAt", type: "datetime" },
      ],
      indexes: [
        { name: "questions_status_idx", fields: ["status"] },
        { name: "questions_created_idx", fields: ["createdAt"] },
      ],
    },
    {
      name: "glossary",
      fields: [
        { name: "term", type: "string", required: true, indexed: true, searchable: true },
        { name: "termArabic", type: "string", indexed: true },
        { name: "transliteration", type: "string", indexed: true },
        { name: "definition", type: "text", required: true, searchable: true },
        { name: "category", type: "string", indexed: true },
        { name: "order", type: "integer", default: 0 },
        { name: "createdAt", type: "datetime" },
      ],
      indexes: [{ name: "glossary_term_idx", fields: ["term"], unique: true }],
    },
    {
      name: "audit-logs",
      fields: [
        { name: "action", type: "string", required: true, indexed: true },
        { name: "userId", type: "string", indexed: true },
        { name: "data", type: "json" },
        { name: "ip", type: "string" },
        { name: "timestamp", type: "datetime", required: true },
      ],
      indexes: [{ name: "audit_action_idx", fields: ["action"] }],
    },
    {
      name: "users",
      fields: [
        { name: "email", type: "email", required: true, unique: true, indexed: true },
        { name: "name", type: "string" },
        { name: "bio", type: "text", searchable: true },
        { name: "role", type: "string", default: "user", indexed: true },
        { name: "isActive", type: "boolean", default: true },
        { name: "emailVerified", type: "boolean", default: false },
        { name: "lastLoginAt", type: "datetime" },
        { name: "createdAt", type: "datetime" },
        { name: "updatedAt", type: "datetime" },
      ],
      indexes: [{ name: "users_email_idx", fields: ["email"], unique: true }],
    },
  ]

  // 3. Ensure collections exist
  let existing: string[] = []
  try {
    const list = await client.listCollections()
    existing = list.map((c: any) => (typeof c === "string" ? c : c?.name)).filter(Boolean) as string[]
    console.log(`[seed-lightbase] Existing collections: ${existing.length ? existing.join(", ") : "(none)"}`)
  } catch (e) {
    console.warn("[seed-lightbase] Could not list collections:", (e as Error).message)
  }

  const created: string[] = []
  for (const def of collections) {
    if (existing.includes(def.name)) continue
    try {
      await client.createCollection(def)
      created.push(def.name)
      console.log(`[seed-lightbase] Created collection: ${def.name}`)
    } catch (e) {
      const msg = (e as Error).message || ""
      if (/conflict|already exists|409/i.test(msg)) continue
      console.warn(`[seed-lightbase] Failed to create collection ${def.name}:`, msg)
    }
  }
  if (created.length === 0 && existing.length > 0) {
    console.log("[seed-lightbase] All collections already exist; nothing to create.")
  }

  // 4. Seed topics (idempotent via upsert on slug)
  console.log(`[seed-lightbase] Seeding ${SEED_TOPICS.length} topics (upsert on slug)...`)
  let topicsOk = 0
  let topicsFail = 0
  for (const t of SEED_TOPICS) {
    try {
      await client.upsert(
        "topics",
        { field: "slug", op: "eq", value: t.slug },
        {
          name: t.name,
          slug: t.slug,
          description: t.description,
          color: t.color,
          questionCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      )
      topicsOk++
    } catch (e) {
      console.warn(`[seed-lightbase] upsert topic ${t.slug} failed:`, (e as Error).message)
      topicsFail++
    }
  }
  console.log(`[seed-lightbase] Topics: ${topicsOk} ok, ${topicsFail} failed`)

  // 5. Seed questions (idempotent via upsert on title)
  console.log(`[seed-lightbase] Seeding ${SEED_QUESTIONS.length} questions (upsert on title)...`)
  let qOk = 0
  let qFail = 0
  for (const q of SEED_QUESTIONS as SeedQuestion[]) {
    try {
      await client.upsert(
        "questions",
        { field: "title", op: "eq", value: q.title },
        {
          title: q.title,
          answer: q.answer,
          excerpt: q.excerpt || q.answer.slice(0, 160),
          topicIds: q.topicSlug ? [q.topicSlug] : [],
          tags: q.tags || [],
          status: q.status || "published",
          viewCount: 0,
          bookmarkCount: 0,
          source: q.source || "Seed data",
          scholar: q.scholar || "",
          createdBy: "seed-script",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      )
      qOk++
    } catch (e) {
      console.warn(`[seed-lightbase] upsert question "${q.title.slice(0, 60)}..." failed:`, (e as Error).message)
      qFail++
    }
  }
  console.log(`[seed-lightbase] Questions: ${qOk} ok, ${qFail} failed`)

  // 6. Seed glossary (idempotent via upsert on term)
  console.log(`[seed-lightbase] Seeding ${SEED_GLOSSARY.length} glossary terms (upsert on term)...`)
  let gOk = 0
  let gFail = 0
  for (let i = 0; i < SEED_GLOSSARY.length; i++) {
    const term = SEED_GLOSSARY[i]
    try {
      await client.upsert(
        "glossary",
        { field: "term", op: "eq", value: term.term },
        {
          term: term.term,
          termArabic: (term as any).arabic || (term as any).termArabic || "",
          transliteration: (term as any).transliteration || "",
          definition: term.definition,
          category: (term as any).category || "general",
          order: i,
          createdAt: new Date().toISOString(),
        },
      )
      gOk++
    } catch (e) {
      console.warn(`[seed-lightbase] upsert glossary "${term.term}" failed:`, (e as Error).message)
      gFail++
    }
  }
  console.log(`[seed-lightbase] Glossary: ${gOk} ok, ${gFail} failed`)

  console.log("-".repeat(60))
  console.log("[seed-lightbase] Done.")
  console.log("  Topics:    " + topicsOk + " ok")
  console.log("  Questions: " + qOk + " ok")
  console.log("  Glossary:  " + gOk + " ok")
  console.log("-".repeat(60))
  process.exit(0)
}

main().catch((e) => {
  console.error("[seed-lightbase] FATAL:", e?.message || e)
  process.exit(1)
})
