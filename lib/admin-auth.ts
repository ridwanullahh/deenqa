// Admin auth library: HS256 JWT signing + verification, and a
// `verifyAdminRequest` helper that the API routes call to gate admin
// mutations. Bismillah Ar-Rahman Ar-Raheem.
//
// The token is stored in an httpOnly cookie named `deenqa_admin` (set
// by the login route). The middleware reads the same cookie to protect
// `/admin/*` pages. The API routes accept either the cookie OR an
// `Authorization: Bearer <jwt>` header (for programmatic clients).
//
// HMAC-SHA256 is used through the Web Crypto API (works on both the
// Node.js and Edge runtimes).

import { NextRequest } from "next/server"

const ADMIN_COOKIE = "deenqa_admin"
const TOKEN_TTL_SECONDS = 60 * 60 * 2 // 2 hours

interface AdminClaims {
  sub: string // username
  iat: number
  exp: number
}

function base64UrlEncode(input: string | ArrayBuffer): string {
  let bytes: Uint8Array
  if (typeof input === "string") {
    bytes = new TextEncoder().encode(input)
  } else {
    bytes = new Uint8Array(input)
  }
  let str = ""
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i])
  const b64 = btoa(str)
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/")
  const b64 = padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "=")
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function getKey(secret: string): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(secret)
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign", "verify"],
  )
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim()
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not configured. Set a 32+ byte hex secret in .env.",
    )
  }
  return secret
}

export async function signAdminToken(username: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const claims: AdminClaims = {
    sub: username,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  }
  const header = { alg: "HS256", typ: "JWT" }
  const payload = base64UrlEncode(JSON.stringify(header)) + "." +
    base64UrlEncode(JSON.stringify(claims))
  const key = await getKey(getSecret())
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  )
  return payload + "." + base64UrlEncode(sig)
}

export async function verifyAdminToken(
  token: string,
): Promise<{ ok: true; username: string } | { ok: false }> {
  if (!token || !token.includes(".")) return { ok: false }
  const parts = token.split(".")
  if (parts.length !== 3) return { ok: false }
  const [headerB64, payloadB64, sigB64] = parts
  let claims: AdminClaims
  try {
    const payloadBytes = base64UrlDecode(payloadB64)
    const payloadText = new TextDecoder().decode(payloadBytes)
    claims = JSON.parse(payloadText) as AdminClaims
  } catch {
    return { ok: false }
  }
  if (!claims.sub || !claims.exp || !claims.iat) return { ok: false }
  const now = Math.floor(Date.now() / 1000)
  if (claims.exp < now) return { ok: false }

  let key: CryptoKey
  try {
    key = await getKey(getSecret())
  } catch {
    return { ok: false }
  }
  const signedPart = headerB64 + "." + payloadB64
  const sigBytes = base64UrlDecode(sigB64)
  // Copy into a fresh ArrayBuffer to satisfy the strict BufferSource type
  // required by WebCrypto across Node and Edge runtimes.
  const sigBuffer = new ArrayBuffer(sigBytes.byteLength)
  new Uint8Array(sigBuffer).set(sigBytes)
  let ok = false
  try {
    ok = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBuffer,
      new TextEncoder().encode(signedPart),
    )
  } catch {
    return { ok: false }
  }
  if (!ok) return { ok: false }
  return { ok: true, username: claims.sub }
}

export interface VerifyAdminResult {
  ok: boolean
  username: string
}

export async function verifyAdminRequest(
  request: NextRequest,
): Promise<VerifyAdminResult> {
  // Prefer the cookie; fall back to Authorization: Bearer <jwt>
  const cookieToken = request.cookies.get(ADMIN_COOKIE)?.value
  const authHeader = request.headers.get("authorization") || ""
  const bearer = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7).trim()
    : ""

  const token = cookieToken || bearer
  if (!token) return { ok: false, username: "" }
  const result = await verifyAdminToken(token)
  if (!result.ok) return { ok: false, username: "" }
  return { ok: true, username: result.username }
}

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE
export const ADMIN_TOKEN_TTL_SECONDS = TOKEN_TTL_SECONDS
