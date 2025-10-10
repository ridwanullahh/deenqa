import { NextRequest, NextResponse } from "next/server"
import { getAnalytics, getAuditLogs } from "@/lib/github-db"

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false
  }

  const token = authHeader.substring(7)
  const adminCredentials = process.env.ADMIN_CREDENTIALS
  if (!adminCredentials) {
    return false
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [username, password] = decoded.split(":")
    const [adminUsername, adminPassword] = adminCredentials.split(":")
    
    return username === adminUsername && password === adminPassword
  } catch (error) {
    console.error("Auth verification error:", error)
    return false
  }
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const analytics = await getAnalytics()
    const auditLogs = await getAuditLogs()

    const recentLogs = auditLogs.slice(-50).reverse()

    return NextResponse.json({
      analytics,
      recentActivity: recentLogs,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
