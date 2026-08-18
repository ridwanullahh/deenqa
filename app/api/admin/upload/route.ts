import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"
export const dynamic = "force-dynamic"

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

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const cloudinaryUrl = process.env.CLOUDINARY_URL
    if (!cloudinaryUrl) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append("file", new Blob([buffer]))
    cloudinaryFormData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET || "unsigned")

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    )

    if (!cloudinaryResponse.ok) {
      throw new Error("Failed to upload to Cloudinary")
    }

    const result = await cloudinaryResponse.json()

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
