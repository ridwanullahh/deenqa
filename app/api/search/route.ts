import { NextRequest, NextResponse } from "next/server"
import { searchQuestions, searchTopics } from "@/lib/github-db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") || "all"

    if (!query) {
      return NextResponse.json({ error: "Search query required" }, { status: 400 })
    }

    let results: any = {}

    if (type === "all" || type === "questions") {
      const questions = await searchQuestions(query)
      results.questions = questions.filter((q) => q.status === "published")
    }

    if (type === "all" || type === "topics") {
      const topics = await searchTopics(query)
      results.topics = topics
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json(
      { error: "Failed to search" },
      { status: 500 }
    )
  }
}
