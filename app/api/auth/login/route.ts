import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const adminCredentials = process.env.ADMIN_CREDENTIALS
    if (!adminCredentials) {
      return NextResponse.json({ error: "Admin credentials not configured" }, { status: 500 })
    }

    const [adminUsername, adminPassword] = adminCredentials.split(":")
    
    if (username === adminUsername && password === adminPassword) {
      const token = Buffer.from(`${username}:${password}`).toString("base64")
      
      return NextResponse.json(
        { 
          success: true, 
          user: { username },
          token 
        },
        { status: 200 }
      )
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
