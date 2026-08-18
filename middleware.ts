// Middleware: protects /admin/* (except /admin/login) by verifying
// the admin JWT cookie. Bismillah Ar-Rahman Ar-Raheem.
//
// On failure, the user is redirected to /admin/login?from=<original-path>.
// On success (or on non-admin paths), the request continues. The matcher
// runs the middleware only on /admin routes and on the login API.

import { NextRequest, NextResponse } from "next/server"
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth"

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/login"],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public: the login page itself, the login API, and admin static assets.
  if (pathname === "/admin/login" || pathname === "/api/auth/login") {
    return NextResponse.next()
  }

  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value || ""
  const authHeader = request.headers.get("authorization") || ""
  const bearer = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7).trim()
    : ""
  const token = cookie || bearer

  // API routes: respond with 401 JSON when token is missing/invalid.
  if (pathname.startsWith("/api/admin/")) {
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }
    const result = await verifyAdminToken(token)
    if (!result.ok) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }
    return NextResponse.next()
  }

  // Pages under /admin (except /admin/login): redirect to /admin/login.
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const url = new URL("/admin/login", request.url)
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }
    const result = await verifyAdminToken(token)
    if (!result.ok) {
      const url = new URL("/admin/login", request.url)
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}
