// Admin login page: server-rendered with a small client form.
// Bismillah Ar-Rahman Ar-Raheem.
//
// The page reads the `from` query string so that after a successful
// login the user is returned to the page they originally requested.
// The actual auth call goes to POST /api/auth/login which sets the
// `deenqa_admin` JWT cookie. On success the client navigates to `from`
// or `/admin`.

import { Suspense } from "react"
import AdminLoginForm from "./admin-login-form"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300">
            DeenQA Admin
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage questions, topics, and review activity.
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading...</div>}>
          <AdminLoginFormWrapper />
        </Suspense>
      </div>
    </div>
  )
}

// We must await searchParams because Next.js 15 makes it a Promise.
async function AdminLoginFormWrapper() {
  return <AdminLoginForm />
}
