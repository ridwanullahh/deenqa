"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
export default function AdminLoginPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const adminCreds = process.env.NEXT_PUBLIC_ADMIN_CREDENTIALS || ""
    const admins = adminCreds.split(",").map((cred) => {
      const [adminEmail, adminPassword] = cred.split(":")
      return { email: adminEmail, password: adminPassword }
    })

    const admin = admins.find(
      (admin) => admin.email === email && admin.password === password
    )

    if (admin) {
      localStorage.setItem("admin-token", "true")
      router.push("/admin")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center", theme === "dark" ? "bg-gray-950" : "bg-[#f8f6f1]")}>
      <div className={cn("w-full max-w-md p-8 space-y-6 rounded-2xl", theme === "dark" ? "bg-gray-900" : "bg-white shadow-lg")}>
        <div className="text-center">
          <h1 className={cn("text-3xl font-bold", theme === "dark" ? "text-white" : "text-emerald-800")}>
            Admin Login
          </h1>
          <p className={cn("mt-2", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
            Enter your credentials to access the dashboard.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className={cn("block text-sm font-medium", theme === "dark" ? "text-gray-300" : "text-gray-700")}
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2",
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white focus:ring-emerald-500 focus:border-emerald-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-emerald-500 focus:border-emerald-500",
              )}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className={cn("block text-sm font-medium", theme === "dark" ? "text-gray-300" : "text-gray-700")}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2",
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white focus:ring-emerald-500 focus:border-emerald-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-emerald-500 focus:border-emerald-500",
              )}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              className={cn(
                "w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2",
                theme === "dark"
                  ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                  : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
              )}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}