// Glossary API: returns Islamic terms from the Lightbase `glossary`

// collection (when configured) or falls back to the in-code seed glossary.
// Bismillah Ar-Rahman Ar-Raheem.

import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const glossary = await db.getGlossary()
    return NextResponse.json({ glossary })
  } catch (error) {
    console.error("Error fetching glossary:", error)
    return NextResponse.json(
      { error: "Failed to fetch glossary" },
      { status: 500 },
    )
  }
}
