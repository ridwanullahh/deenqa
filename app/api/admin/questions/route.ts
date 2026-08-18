import { NextRequest, NextResponse } from "next/server"
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  searchQuestions,
  updateTopicQuestionCounts,
} from "@/lib/github-db"

export const runtime = "edge"
export const dynamic = "force-dynamic"

function verifyAuth(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  const adminCredentials = process.env.ADMIN_CREDENTIALS
  if (!adminCredentials) {
    return null
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [username, password] = decoded.split(":")
    const [adminUsername, adminPassword] = adminCredentials.split(":")

    if (username === adminUsername && password === adminPassword) {
      return username
    }
  } catch (error) {
    console.error("Auth verification error:", error)
  }

  return null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const topicId = searchParams.get("topicId")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"

    let questions = search
      ? await searchQuestions(search)
      : await getQuestions()

    if (status && status !== "all") {
      questions = questions.filter((q) => q.status === status)
    }

    if (topicId) {
      questions = questions.filter((q) => q.topicIds?.includes(topicId))
    }

    questions.sort((a, b) => {
      const aVal = a[sort as keyof typeof a]
      const bVal = b[sort as keyof typeof b]
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      if (order === "asc") {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })

    const total = questions.length
    const start = (page - 1) * limit
    const end = start + limit
    const paginated = questions.slice(start, end)

    return NextResponse.json({
      questions: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const username = verifyAuth(request)
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const question = await createQuestion({
      ...data,
      createdBy: username,
      viewCount: 0,
      bookmarkCount: 0,
    })

    await updateTopicQuestionCounts()

    return NextResponse.json({ question }, { status: 201 })
  } catch (error) {
    console.error("Error creating question:", error)
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const username = verifyAuth(request)
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, ...updates } = await request.json()
    const question = await updateQuestion(id, updates, username)

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    await updateTopicQuestionCounts()

    return NextResponse.json({ question })
  } catch (error) {
    console.error("Error updating question:", error)
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const username = verifyAuth(request)
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Question ID required" },
        { status: 400 }
      )
    }

    const success = await deleteQuestion(id, username)

    if (!success) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    await updateTopicQuestionCounts()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    )
  }
}
