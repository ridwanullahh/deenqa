"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Filter, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useTopicBySlug } from "@/hooks/use-topics"
import { useQuestionsByTopic } from "@/hooks/use-questions"
import QuestionCard from "@/components/question-card"
import BottomNav from "@/components/bottom-nav"
import SearchModal from "@/components/search-modal"

export default function TopicPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const { data: topic, isLoading: topicLoading } = useTopicBySlug(params.slug)
  const { data: topicQuestions = [], isLoading: questionsLoading } = useQuestionsByTopic(topic?.id || "")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (topicLoading || questionsLoading) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          theme === "dark" ? "bg-gray-950" : "bg-[#f8f6f1]",
        )}
      >
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" />
          <p className={cn("mt-4", theme === "dark" ? "text-gray-400" : "text-gray-600")}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          theme === "dark" ? "bg-gray-950" : "bg-[#f8f6f1]",
        )}
      >
        <div className="text-center">
          <h2 className={cn("text-xl font-semibold mb-2", theme === "dark" ? "text-white" : "text-gray-900")}>
            Topic not found
          </h2>
          <p className={cn("mb-4", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
            The topic you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/topics")}
            className="px-4 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Browse Topics
          </button>
        </div>
      </div>
    )
  }

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
            {topic.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className={cn("p-2 rounded-full", theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100")}
          >
            <Search className={cn("h-5 w-5", theme === "dark" ? "text-gray-200" : "text-gray-700")} />
          </button>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="flex-1 px-4 py-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-2xl p-6 mb-6",
            theme === "dark" ? "bg-gray-900 border border-gray-800" : "bg-white shadow-sm",
          )}
        >
          <h2 className={cn("text-2xl font-bold mb-2", theme === "dark" ? "text-white" : "text-gray-900")}>
            {topic.name}
          </h2>
          {topic.description && (
            <p className={cn("text-sm mb-4", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              {topic.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm">
            <span
              className={cn(
                "px-3 py-1 rounded-full",
                theme === "dark"
                  ? "bg-emerald-900/40 text-emerald-400"
                  : "bg-emerald-100 text-emerald-800",
              )}
            >
              {topicQuestions.length} Questions
            </span>
          </div>
        </motion.div>

        <section>
          <h3 className={cn("text-lg font-semibold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
            All Questions
          </h3>
          {topicQuestions.length === 0 ? (
            <div className="text-center py-12">
              <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                No questions available in this topic yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {topicQuestions.map((question: any) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
