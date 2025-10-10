import { NextRequest, NextResponse } from "next/server"
import { incrementViewCount } from "@/lib/github-db"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await incrementViewCount(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error incrementing view count:", error)
    return NextResponse.json({ error: "Failed to update view count" }, { status: 500 })
  }
}
