"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Search, Mic } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useSearchQuestions } from "@/hooks/use-questions"
import QuestionCard from "@/components/question-card"
import BottomNav from "@/components/bottom-nav"

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState(query)
  const [isListening, setIsListening] = useState(false)

  const { data: searchResults = [], isLoading } = useSearchQuestions(query)

  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      setIsListening(true)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        router.push(`/search?q=${encodeURIComponent(transcript)}`)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      alert("Speech recognition is not supported in your browser")
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  if (!mounted) return null

  return (
    <div className={cn("min-h-screen flex flex-col", theme === "dark" ? "bg-gray-950" : "bg-[#f8f6f1]")}>
      <header
        className={cn(
          "sticky top-0 z-30 px-4 py-3 border-b",
          theme === "dark"
            ? "bg-gray-900/90 backdrop-blur-md border-gray-800"
            : "bg-white/90 backdrop-blur-md shadow-sm border-gray-200",
        )}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className={cn("p-2 rounded-full", theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100")}
          >
            <ArrowLeft className={cn("h-5 w-5", theme === "dark" ? "text-gray-200" : "text-gray-700")} />
          </button>
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
                theme === "dark" ? "text-gray-400" : "text-gray-500",
              )}
            />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className={cn(
                "w-full pl-10 pr-10 py-2 rounded-xl border-0 focus:ring-2 focus:ring-emerald-500/50",
                theme === "dark"
                  ? "bg-gray-800 text-white placeholder-gray-400"
                  : "bg-gray-100 text-gray-900 placeholder-gray-500",
              )}
            />
            <button
              onClick={startListening}
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full",
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700",
              )}
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        <div className={cn("mb-6", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
          {query && (
            <div className="mb-4">
              <span className="text-sm">Search results for: </span>
              <span className={cn("font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                "{query}"
              </span>
            </div>
          )}
          <div className="text-sm">
            {isLoading ? "Searching..." : `${searchResults.length} results found`}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "animate-pulse rounded-xl p-4",
                  theme === "dark" ? "bg-gray-900" : "bg-white",
                )}
              >
                <div className={cn("h-6 rounded mb-3", theme === "dark" ? "bg-gray-800" : "bg-gray-200")} />
                <div className={cn("h-4 rounded mb-2", theme === "dark" ? "bg-gray-800" : "bg-gray-200")} />
                <div className={cn("h-4 rounded w-3/4", theme === "dark" ? "bg-gray-800" : "bg-gray-200")} />
              </div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-6">
            {searchResults.map((question: any) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        ) : query ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div
              className={cn(
                "mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4",
                theme === "dark" ? "bg-gray-900" : "bg-gray-100",
              )}
            >
              <Search className={cn("h-10 w-10", theme === "dark" ? "text-gray-600" : "text-gray-400")} />
            </div>
            <h3 className={cn("text-lg font-semibold mb-2", theme === "dark" ? "text-white" : "text-gray-900")}>
              No results found
            </h3>
            <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Try different keywords or check your spelling
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div
              className={cn(
                "mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4",
                theme === "dark" ? "bg-gray-900" : "bg-gray-100",
              )}
            >
              <Search className={cn("h-10 w-10", theme === "dark" ? "text-gray-600" : "text-gray-400")} />
            </div>
            <h3 className={cn("text-lg font-semibold mb-2", theme === "dark" ? "text-white" : "text-gray-900")}>
              Start searching
            </h3>
            <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              Enter a keyword to find questions
            </p>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
