"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bookmark, VolumeIcon as VolumeUp, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface QuestionCardProps {
  question: any
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if question is bookmarked
    setIsBookmarked(localStorage.getItem(`bookmark-${question.id}`) === "true")
  }, [question.id])

  if (!mounted) return null

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newState = !isBookmarked
    setIsBookmarked(newState)
    localStorage.setItem(`bookmark-${question.id}`, newState.toString())
  }

  return (
    <Link href={`/question/${question.id}`}>
      <div
        className={cn(
          "rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group",
          theme === "dark"
            ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-800/80 hover:border-gray-600"
            : "bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:border-gray-300 shadow-sm",
        )}
      >
        {/* Category Header */}
        <div
          className={cn(
            "px-4 py-2 border-b",
            question.category === "Prayer"
              ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100 dark:from-emerald-900/20 dark:to-teal-900/20 dark:border-emerald-800/30"
              : question.category === "Fasting"
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800/30"
                : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800/30",
            theme === "dark" ? "border-gray-700/50" : "border-gray-200/50",
          )}
        >
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full",
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
              <Clock className="h-3 w-3" />
              {question.category}
            </span>
            <button
              onClick={toggleBookmark}
              className={cn(
                "p-1.5 rounded-full transition-all",
                isBookmarked
                  ? theme === "dark"
                    ? "text-emerald-400 bg-emerald-900/30"
                    : "text-emerald-600 bg-emerald-100"
                  : theme === "dark"
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
              )}
            >
              <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3
            className={cn(
              "text-lg font-semibold mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors",
              theme === "dark" ? "text-white group-hover:text-emerald-400" : "text-gray-900",
            )}
          >
            {question.title}
          </h3>

          <p className={cn("text-sm mb-4 line-clamp-3", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
            {question.excerpt || question.answer.substring(0, 150) + "..."}
          </p>

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {question.tags.slice(0, 3).map((tag: string, index: number) => (
                <span
                  key={index}
                  className={cn(
                    "px-2 py-0.5 text-xs rounded-md",
                    theme === "dark"
                      ? "bg-gray-700/50 text-gray-300 border border-gray-600/30"
                      : "bg-gray-100 text-gray-600 border border-gray-200",
                  )}
                >
                  #{tag}
                </span>
              ))}
              {question.tags.length > 3 && (
                <span
                  className={cn("px-2 py-0.5 text-xs rounded-md", theme === "dark" ? "text-gray-400" : "text-gray-500")}
                >
                  +{question.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200",
                  )}
                >
                  <User className="h-3 w-3 text-gray-500" />
                </div>
                <div className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                  <span className="font-medium">{question.scholar}</span>
                </div>
              </div>
              <div className={cn("text-xs hidden sm:block", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                <span className="font-medium">Source:</span> {question.source}
              </div>
            </div>
            <button
              className={cn(
                "flex items-center gap-1.5 p-2 rounded-full transition-all",
                theme === "dark"
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
              )}
            >
              <VolumeUp className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Listen</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
