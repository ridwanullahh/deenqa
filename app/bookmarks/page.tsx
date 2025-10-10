"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useQuestions } from "@/hooks/use-questions"
import QuestionCard from "@/components/question-card"
import BottomNav from "@/components/bottom-nav"

export default function BookmarksPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<any[]>([])

  const { data: allQuestions = [] } = useQuestions()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (allQuestions.length > 0) {
      const bookmarkIds = JSON.parse(localStorage.getItem("bookmarks") || "[]")
      const bookmarked = allQuestions.filter((q: any) => bookmarkIds.includes(q.id))
      setBookmarkedQuestions(bookmarked)
    }
  }, [allQuestions])

  if (!mounted) return null

  return (
    <div className={cn("min-h-screen flex flex-col", theme === "dark" ? "bg-gray-950" : "bg-[#f8f6f1]")}>
      <header
        className={cn(
          "sticky top-0 z-30 px-4 py-3 flex items-center justify-between",
          theme === "dark"
            ? "bg-gray-900/90 backdrop-blur-md border-b border-gray-800"
            : "bg-white/90 backdrop-blur-md shadow-sm",
        )}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className={cn("p-2 rounded-full", theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100")}
          >
            <ArrowLeft className={cn("h-5 w-5", theme === "dark" ? "text-gray-200" : "text-gray-700")} />
          </button>
          <h1 className={cn("text-lg font-semibold", theme === "dark" ? "text-white" : "text-emerald-800")}>
            Bookmarks
          </h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        {bookmarkedQuestions.length > 0 ? (
          <div className="space-y-6">
            <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              {bookmarkedQuestions.length} bookmarked {bookmarkedQuestions.length === 1 ? "question" : "questions"}
            </p>
            {bookmarkedQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mb-6",
                theme === "dark" ? "bg-gray-900" : "bg-gray-100",
              )}
            >
              <Bookmark className={cn("h-10 w-10", theme === "dark" ? "text-gray-600" : "text-gray-400")} />
            </div>
            <h3 className={cn("text-xl font-semibold mb-2", theme === "dark" ? "text-white" : "text-gray-900")}>
              No bookmarks yet
            </h3>
            <p className={cn("text-center text-sm mb-6", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Bookmark questions to save them for later reading
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Explore Questions
            </button>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
