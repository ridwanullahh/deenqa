import { NextRequest, NextResponse } from "next/server"
import { incrementViewCount } from "@/lib/github-db"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await incrementViewCount(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error incrementing view count:", error)
    return NextResponse.json({ error: "Failed to update view count" }, { status: 500 })
  }
}
