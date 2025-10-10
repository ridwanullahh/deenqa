"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export default function BottomNav() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-2 px-4",
        theme === "dark"
          ? "bg-gray-900/90 backdrop-blur-md border-t border-gray-800"
          : "bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-sm",
      )}
    >
      <Link
        href="/"
        className={cn(
          "flex flex-col items-center justify-center w-16 py-1",
          pathname === "/"
            ? theme === "dark"
              ? "text-emerald-400"
              : "text-emerald-600"
            : theme === "dark"
              ? "text-gray-400"
              : "text-gray-500",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="text-xs mt-1">Home</span>
      </Link>

      <Link
        href="/topics"
        className={cn(
          "flex flex-col items-center justify-center w-16 py-1",
          pathname === "/topics" || pathname.startsWith("/topic/")
            ? theme === "dark"
              ? "text-emerald-400"
              : "text-emerald-600"
            : theme === "dark"
              ? "text-gray-400"
              : "text-gray-500",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
        <span className="text-xs mt-1">Topics</span>
      </Link>

      <Link
        href="/search"
        className={cn(
          "flex flex-col items-center justify-center w-16 py-1",
          pathname === "/search"
            ? theme === "dark"
              ? "text-emerald-400"
              : "text-emerald-600"
            : theme === "dark"
              ? "text-gray-400"
              : "text-gray-500",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="text-xs mt-1">Search</span>
      </Link>

      <Link
        href="/bookmarks"
        className={cn(
          "flex flex-col items-center justify-center w-16 py-1",
          pathname === "/bookmarks"
            ? theme === "dark"
              ? "text-emerald-400"
              : "text-emerald-600"
            : theme === "dark"
              ? "text-gray-400"
              : "text-gray-500",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
        <span className="text-xs mt-1">Saved</span>
      </Link>

      <Link
        href="/settings"
        className={cn(
          "flex flex-col items-center justify-center w-16 py-1",
          pathname === "/settings"
            ? theme === "dark"
              ? "text-emerald-400"
              : "text-emerald-600"
            : theme === "dark"
              ? "text-gray-400"
              : "text-gray-500",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
        <span className="text-xs mt-1">Settings</span>
      </Link>
    </div>
  )
}
