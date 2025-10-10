import fs from "fs"
import path from "path"

const DB_PATH = path.join(process.cwd(), "db")

interface Question {
  id: string
  title: string
  category: string
  tags: string[]
  answer: string
  excerpt: string
  source: string
  scholar: string
  status: "draft" | "published" | "pending"
  createdAt: string
  updatedAt: string
  createdBy: string
  viewCount: number
  bookmarkCount: number
  imageUrl?: string
}

interface Topic {
  id: string
  name: string
  slug: string
  count: number
  color: string
  description: string
  createdAt: string
  updatedAt: string
}

async function seed() {
  console.log("🌱 Starting database seed...")

  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH, { recursive: true })
    console.log("✅ Created db directory")
  }

  const questions: Question[] = JSON.parse(
    fs.readFileSync(path.join(DB_PATH, "questions.json"), "utf-8")
  )
  console.log(`✅ Loaded ${questions.length} questions`)

  const topics: Topic[] = JSON.parse(
    fs.readFileSync(path.join(DB_PATH, "topics.json"), "utf-8")
  )
  console.log(`✅ Loaded ${topics.length} topics`)

  const analytics = {
    totalQuestions: questions.length,
    totalTopics: topics.length,
    totalViews: questions.reduce((sum, q) => sum + q.viewCount, 0),
    totalBookmarks: questions.reduce((sum, q) => sum + q.bookmarkCount, 0),
    dailyStats: [],
  }

  fs.writeFileSync(path.join(DB_PATH, "analytics.json"), JSON.stringify(analytics, null, 2))
  console.log("✅ Updated analytics")

  if (!fs.existsSync(path.join(DB_PATH, "audit-logs.json"))) {
    fs.writeFileSync(path.join(DB_PATH, "audit-logs.json"), "[]")
    console.log("✅ Initialized audit logs")
  }

  console.log("🎉 Database seed complete!")
  console.log("\nStats:")
  console.log(`- Questions: ${analytics.totalQuestions}`)
  console.log(`- Topics: ${analytics.totalTopics}`)
  console.log(`- Total Views: ${analytics.totalViews}`)
  console.log(`- Total Bookmarks: ${analytics.totalBookmarks}`)
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error)
  process.exit(1)
})
