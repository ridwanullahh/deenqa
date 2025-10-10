"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface RelatedQuestionCardProps {
  question: any
}

export default function RelatedQuestionCard({ question }: RelatedQuestionCardProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Link href={`/question/${question.id}`}>
      <div
        className={cn(
          "rounded-xl overflow-hidden transition-all duration-200 p-3",
          theme === "dark" ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50 border border-gray-200",
        )}
      >
        <h3 className={cn("text-sm font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>
          {question.title}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={cn(
              "inline-block px-2 py-0.5 text-xs font-medium rounded-full",
              question.category === "Prayer"
                ? theme === "dark"
                  ? "bg-emerald-900/40 text-emerald-400"
                  : "bg-emerald-100 text-emerald-800"
                : question.category === "Fasting"
                  ? theme === "dark"
                    ? "bg-blue-900/40 text-blue-400"
                    : "bg-blue-100 text-blue-800"
                  : theme === "dark"
                    ? "bg-amber-900/40 text-amber-400"
                    : "bg-amber-100 text-amber-800",
            )}
          >
            {question.category}
          </span>
          <div className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
            <span className="font-medium">Source:</span> {question.source}
          </div>
        </div>
      </div>
    </Link>
  )
}
