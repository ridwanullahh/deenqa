import { NextRequest, NextResponse } from "next/server"
import { getQuestions, getQuestion, getQuestionsByTopicId, searchQuestions } from "@/lib/github-db"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const topicId = searchParams.get("topicId")
    const search = searchParams.get("search")
    const status = searchParams.get("status") || "published"
    
    if (id) {
      const question = await getQuestion(id)
      if (!question) {
        return NextResponse.json({ error: "Question not found" }, { status: 404 })
      }
      return NextResponse.json({ question })
    }

    let questions = search 
      ? await searchQuestions(search)
      : topicId 
      ? await getQuestionsByTopicId(topicId)
      : await getQuestions()

    questions = questions.filter((q) => q.status === status)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    )
  }
}
