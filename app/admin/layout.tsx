// Admin layout: server-side session verification.
// Bismillah Ar-Rahman Ar-Raheem.
//
// Reads the `deenqa_admin` JWT cookie and verifies it. If invalid or
// missing, redirects to /admin/login. The middleware also gates this
// path; this is the defense-in-depth check the task requires.

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value || ""

  let username: string | null = null
  if (token) {
    try {
      const result = await verifyAdminToken(token)
      if (result.ok) username = result.username
    } catch (err) {
      console.error("[admin/layout] verifyAdminToken failed:", err)
    }
  }

  if (!username) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm dark:border-b dark:border-gray-800">
        <a href="/admin" className="text-xl font-semibold text-emerald-800 dark:text-white">
          DeenQA Admin
        </a>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
            Signed in as <span className="font-medium">{username}</span>
          </span>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  )
}
