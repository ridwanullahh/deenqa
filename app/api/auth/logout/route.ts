// Admin logout API: clears the deenqa_admin JWT cookie.

// Bismillah Ar-Rahman Ar-Raheem.

import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth"
import { db } from "@/lib/db"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  if (cookie) {
    try {
      const { verifyAdminToken } = await import("@/lib/admin-auth")
      const result = await verifyAdminToken(cookie)
      if (result.ok) {
        await db.logAudit("logout", "auth", "-", result.username, {})
      }
    } catch (err) {
      console.error("Audit log (logout) failed:", err)
    }
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  })
  return response
}
