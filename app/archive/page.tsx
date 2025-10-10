"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useQuestions } from "@/hooks/use-questions"
import { useTopics } from "@/hooks/use-topics"
import BottomNav from "@/components/bottom-nav"

export default function ArchivePage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const { data: allQuestions = [] } = useQuestions()
  const { data: allTopics = [] } = useTopics()

  useEffect(() => {
    setMounted(true)
  }, [])

  const groupedByMonth = allQuestions.reduce((acc: any, question: any) => {
    const date = new Date(question.createdAt)
    const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    if (!acc[monthYear]) {
      acc[monthYear] = []
    }
    acc[monthYear].push(question)
    return acc
  }, {})

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
            Archive
          </h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        <div className="space-y-6">
          {Object.keys(groupedByMonth).length > 0 ? (
            Object.entries(groupedByMonth).map(([monthYear, questions]: [string, any]) => (
              <motion.div
                key={monthYear}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-2xl p-6",
                  theme === "dark" ? "bg-gray-900 border border-gray-800" : "bg-white shadow-sm",
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      theme === "dark"
                        ? "bg-emerald-900/40 text-emerald-400"
                        : "bg-emerald-100 text-emerald-800",
                    )}
                  >
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className={cn("text-lg font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                      {monthYear}
                    </h2>
                    <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      {questions.length} {questions.length === 1 ? "question" : "questions"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {questions.map((question: any) => (
                    <button
                      key={question.id}
                      onClick={() => router.push(`/question/${question.id}`)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-all group flex items-center justify-between",
                        theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50",
                      )}
                    >
                      <div className="flex-1">
                        <h3
                          className={cn(
                            "font-medium text-sm line-clamp-1 group-hover:text-emerald-600",
                            theme === "dark" ? "text-white" : "text-gray-900",
                          )}
                        >
                          {question.title}
                        </h3>
                        <p
                          className={cn(
                            "text-xs mt-1 line-clamp-1",
                            theme === "dark" ? "text-gray-400" : "text-gray-600",
                          )}
                        >
                          {question.excerpt || question.answer.substring(0, 80)}...
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 ml-2 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ))
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
                <Calendar className={cn("h-10 w-10", theme === "dark" ? "text-gray-600" : "text-gray-400")} />
              </div>
              <h3 className={cn("text-xl font-semibold mb-2", theme === "dark" ? "text-white" : "text-gray-900")}>
                No archived questions
              </h3>
              <p className={cn("text-center text-sm mb-6", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                Browse questions to see them organized by date
              </p>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Explore Questions
              </button>
            </motion.div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
