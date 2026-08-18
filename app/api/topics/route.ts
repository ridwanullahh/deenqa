import { NextRequest, NextResponse } from "next/server"
import { getTopics, getTopic, getTopicBySlug, searchTopics } from "@/lib/github-db"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const slug = searchParams.get("slug")
    const search = searchParams.get("search")

    if (id) {
      const topic = await getTopic(id)
      if (!topic) {
        return NextResponse.json({ error: "Topic not found" }, { status: 404 })
      }
      return NextResponse.json({ topic })
    }

    if (slug) {
      const topic = await getTopicBySlug(slug)
      if (!topic) {
        return NextResponse.json({ error: "Topic not found" }, { status: 404 })
      }
      return NextResponse.json({ topic })
    }

    const topics = search ? await searchTopics(search) : await getTopics()

    return NextResponse.json({ topics })
  } catch (error) {
    console.error("Error fetching topics:", error)
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    )
  }
}
