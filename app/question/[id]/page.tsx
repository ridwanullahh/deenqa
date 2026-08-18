"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Copy,
  Search,
  Edit3,
  Save,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useQuestion, incrementQuestionView } from "@/hooks/use-questions"
import BottomNav from "@/components/bottom-nav"
import RelatedQuestionCard from "@/components/related-question-card"
import SearchModal from "@/components/search-modal"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export default function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { theme } = useTheme()
  const { id } = use(params)
  const [mounted, setMounted] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [userNotes, setUserNotes] = useState("")
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [activeTab, setActiveTab] = useState("answer")

  const { data: question, isLoading } = useQuestion(id)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (question) {
      setIsBookmarked(localStorage.getItem(`bookmark-${id}`) === "true")
      const savedNotes = localStorage.getItem(`notes-${id}`)
      if (savedNotes) {
        setUserNotes(savedNotes)
      }
      incrementQuestionView(id)
    }
  }, [question, id])

  const toggleBookmark = () => {
    const newState = !isBookmarked
    setIsBookmarked(newState)
    if (newState) {
      localStorage.setItem(`bookmark-${id}`, "true")
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]")
      if (!bookmarks.includes(id)) {
        bookmarks.push(id)
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
      }
    } else {
      localStorage.removeItem(`bookmark-${id}`)
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]")
      const updated = bookmarks.filter((bmId: string) => bmId !== id)
      localStorage.setItem("bookmarks", JSON.stringify(updated))
    }
  }

  const saveNotes = () => {
    localStorage.setItem(`notes-${id}`, userNotes)
    setIsEditingNotes(false)
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: question?.title,
          text: question?.excerpt || question?.answer.substring(0, 100),
          url: url,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(url)
      alert("Link copied to clipboard!")
    }
  }

  const copyAnswer = () => {
    if (question) {
      navigator.clipboard.writeText(question.answer)
      alert("Answer copied to clipboard!")
    }
  }

  if (!mounted) return null

  if (isLoading) {
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

  if (!question) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          theme === "dark" ? "bg-gray-950" : "bg-[#f8f6f1]",
        )}
      >
        <div className="text-center">
          <h2 className={cn("text-xl font-semibold mb-2", theme === "dark" ? "text-white" : "text-gray-900")}>
            Question not found
          </h2>
          <p className={cn("mb-4", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
            The question you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Go Home
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
        <button
          onClick={() => router.back()}
          className={cn("p-2 rounded-full", theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100")}
        >
          <ArrowLeft className={cn("h-5 w-5", theme === "dark" ? "text-gray-200" : "text-gray-700")} />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className={cn("p-2 rounded-full", theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100")}
          >
            <Search className={cn("h-5 w-5", theme === "dark" ? "text-gray-200" : "text-gray-700")} />
          </button>
          <button
            onClick={toggleBookmark}
            className={cn(
              "p-2 rounded-full",
              isBookmarked
                ? "bg-emerald-600 text-white"
                : theme === "dark"
                  ? "hover:bg-gray-800 text-gray-200"
                  : "hover:bg-gray-100 text-gray-700",
            )}
          >
            <Bookmark className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleShare}
            className={cn("p-2 rounded-full", theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100")}
          >
            <Share2 className={cn("h-5 w-5", theme === "dark" ? "text-gray-200" : "text-gray-700")} />
          </button>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="flex-1 px-4 py-6 pb-20">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-2xl p-6 mb-6",
            theme === "dark" ? "bg-gray-900 border border-gray-800" : "bg-white shadow-sm",
          )}
        >
          <h1 className={cn("text-2xl font-bold mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
            {question.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags?.map((tag: string) => (
              <span
                key={tag}
                className={cn(
                  "px-3 py-1 text-xs rounded-full",
                  theme === "dark"
                    ? "bg-emerald-900/40 text-emerald-400"
                    : "bg-emerald-100 text-emerald-800",
                )}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setActiveTab("answer")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                activeTab === "answer"
                  ? "bg-emerald-600 text-white"
                  : theme === "dark"
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              Answer
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                activeTab === "notes"
                  ? "bg-emerald-600 text-white"
                  : theme === "dark"
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              My Notes
            </button>
          </div>

          {activeTab === "answer" ? (
            <>
              <div
                className={cn(
                  "prose max-w-none mb-6",
                  theme === "dark" ? "prose-invert" : "prose-gray",
                )}
              >
                <p className={cn("text-base leading-relaxed", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                  {question.answer}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyAnswer}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                    theme === "dark"
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  )}
                >
                  <Copy className="h-4 w-4" />
                  Copy Answer
                </button>
              </div>
            </>
          ) : (
            <div>
              {isEditingNotes ? (
                <div>
                  <textarea
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="Write your notes here..."
                    className={cn(
                      "w-full h-48 p-4 rounded-lg border-0 focus:ring-2 focus:ring-emerald-500/50 resize-none",
                      theme === "dark"
                        ? "bg-gray-800 text-white placeholder-gray-400"
                        : "bg-gray-100 text-gray-900 placeholder-gray-500",
                    )}
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={saveNotes}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <Save className="h-4 w-4" />
                      Save Notes
                    </button>
                    <button
                      onClick={() => setIsEditingNotes(false)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium",
                        theme === "dark"
                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      )}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {userNotes ? (
                    <div>
                      <p
                        className={cn(
                          "mb-4 whitespace-pre-wrap",
                          theme === "dark" ? "text-gray-300" : "text-gray-700",
                        )}
                      >
                        {userNotes}
                      </p>
                      <button
                        onClick={() => setIsEditingNotes(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit Notes
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className={cn("mb-4", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                        No notes yet. Start writing your thoughts!
                      </p>
                      <button
                        onClick={() => setIsEditingNotes(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 mx-auto"
                      >
                        <Edit3 className="h-4 w-4" />
                        Add Notes
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.article>
      </main>

      <BottomNav />
    </div>
  )
}
