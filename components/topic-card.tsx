"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface TopicCardProps {
  topic: any
}

export default function TopicCard({ topic }: TopicCardProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Link href={`/topic/${topic.slug}`}>
      <div
        className={cn(
          "rounded-xl overflow-hidden h-full transition-all duration-200",
          theme === "dark"
            ? "bg-gray-800 hover:bg-gray-750 hover:shadow-md hover:shadow-black/20"
            : "bg-white hover:shadow-md",
        )}
      >
        <div className="p-4 flex flex-col items-center justify-center text-center h-full">
          <div
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center mb-3",
              topic.color === "emerald"
                ? theme === "dark"
                  ? "bg-emerald-900/40 text-emerald-400"
                  : "bg-emerald-100 text-emerald-800"
                : topic.color === "blue"
                  ? theme === "dark"
                    ? "bg-blue-900/40 text-blue-400"
                    : "bg-blue-100 text-blue-800"
                  : theme === "dark"
                    ? "bg-amber-900/40 text-amber-400"
                    : "bg-amber-100 text-amber-800",
            )}
          >
            {topic.icon}
          </div>
          <h3 className={cn("font-medium mb-1", theme === "dark" ? "text-white" : "text-gray-900")}>{topic.name}</h3>
          <p className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-500")}>{topic.count} questions</p>
        </div>
      </div>
    </Link>
  )
}
