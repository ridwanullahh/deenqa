import { NextRequest, NextResponse } from "next/server"
import { getTopics, createTopic, updateTopic, deleteTopic } from "@/lib/github-db"

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

export async function GET() {
  try {
    const topics = await getTopics()
    return NextResponse.json({ topics })
  } catch (error) {
    console.error("Error fetching topics:", error)
    return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const username = verifyAuth(request)
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const topic = await createTopic(data)

    return NextResponse.json({ topic }, { status: 201 })
  } catch (error) {
    console.error("Error creating topic:", error)
    return NextResponse.json({ error: "Failed to create topic" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const username = verifyAuth(request)
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, ...updates } = await request.json()
    const topic = await updateTopic(id, updates, username)

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    return NextResponse.json({ topic })
  } catch (error) {
    console.error("Error updating topic:", error)
    return NextResponse.json({ error: "Failed to update topic" }, { status: 500 })
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
      return NextResponse.json({ error: "Topic ID required" }, { status: 400 })
    }

    const success = await deleteTopic(id, username)

    if (!success) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting topic:", error)
    return NextResponse.json({ error: "Failed to delete topic" }, { status: 500 })
  }
}
