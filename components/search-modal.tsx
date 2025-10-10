"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Filter, Mic, Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useQuestions } from "@/hooks/use-questions"
import { useTopics } from "@/hooks/use-topics"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: allQuestions = [] } = useQuestions()
  const { data: allTopics = [] } = useTopics()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true)
      const filtered = allQuestions.filter((q: any) => {
        const matchesQuery =
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesCategory = selectedCategories.length === 0 || 
          q.topicIds?.some((topicId: string) => {
            const topic = allTopics.find((t: any) => t.id === topicId)
            return topic && selectedCategories.includes(topic.name)
          })

        return matchesQuery && matchesCategory
      })
      setSearchResults(filtered)
      setIsLoading(false)
    } else {
      setSearchResults([])
      setIsLoading(false)
    }
  }, [searchQuery, selectedCategories, allQuestions, allTopics])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))

      router.push(`/search?q=${encodeURIComponent(query)}`)
      onClose()
    }
  }

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
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    }
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className={cn(
            "relative w-full max-w-2xl mx-4 mt-16 rounded-2xl shadow-2xl overflow-hidden",
            theme === "dark" ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200",
          )}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search
                  className={cn("absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5", {
                    "text-gray-400": theme === "dark",
                    "text-gray-500": theme !== "dark",
                  })}
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search questions, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                  className={cn(
                    "w-full pl-10 pr-12 py-3 rounded-xl border-0 focus:ring-2 focus:ring-emerald-500/50",
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
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "p-3 rounded-xl",
                  showFilters
                    ? "bg-emerald-600 text-white"
                    : theme === "dark"
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                <Filter className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className={cn(
                  "p-3 rounded-xl",
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4"
              >
                <div>
                  <h4 className={cn("text-sm font-medium mb-2", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                    Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allTopics.slice(0, 6).map((topic: any) => (
                      <button
                        key={topic.id}
                        onClick={() => toggleCategory(topic.name)}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-full transition-all",
                          selectedCategories.includes(topic.name)
                            ? "bg-emerald-600 text-white"
                            : theme === "dark"
                              ? "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                        )}
                      >
                        {topic.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={clearFilters}
                    className={cn("text-sm", theme === "dark" ? "text-emerald-400" : "text-emerald-600")}
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}
                  >
                    Hide Filters
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {searchQuery ? (
              <div className="p-4">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn("animate-pulse rounded-lg p-3", theme === "dark" ? "bg-gray-800" : "bg-gray-100")}
                      >
                        <div className={cn("h-4 rounded mb-2", theme === "dark" ? "bg-gray-700" : "bg-gray-200")} />
                        <div className={cn("h-3 rounded w-3/4", theme === "dark" ? "bg-gray-700" : "bg-gray-200")} />
                      </div>
                    ))}
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <div className={cn("text-sm mb-3", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      {searchResults.length} results found
                    </div>
                    {searchResults.slice(0, 5).map((question) => (
                      <button
                        key={question.id}
                        onClick={() => {
                          router.push(`/question/${question.id}`)
                          onClose()
                        }}
                        className={cn(
                          "w-full text-left p-3 rounded-lg transition-all group",
                          theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50",
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
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
                                "text-xs mt-1 line-clamp-2",
                                theme === "dark" ? "text-gray-400" : "text-gray-600",
                              )}
                            >
                              {question.answer.substring(0, 100)}...
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {question.tags?.slice(0, 2).map((tag: string) => (
                                <span
                                  key={tag}
                                  className={cn(
                                    "px-2 py-0.5 text-xs rounded-full",
                                    theme === "dark"
                                      ? "bg-emerald-900/40 text-emerald-400"
                                      : "bg-emerald-100 text-emerald-800",
                                  )}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 ml-2 flex-shrink-0" />
                        </div>
                      </button>
                    ))}
                    {searchResults.length > 5 && (
                      <button
                        onClick={() => handleSearch(searchQuery)}
                        className={cn(
                          "w-full p-3 text-center text-sm font-medium rounded-lg",
                          theme === "dark" ? "text-emerald-400 hover:bg-gray-800" : "text-emerald-600 hover:bg-gray-50",
                        )}
                      >
                        View all {searchResults.length} results
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search
                      className={cn("h-12 w-12 mx-auto mb-3", theme === "dark" ? "text-gray-600" : "text-gray-400")}
                    />
                    <h3 className={cn("font-medium mb-1", theme === "dark" ? "text-white" : "text-gray-900")}>
                      No results found
                    </h3>
                    <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <h3
                      className={cn("text-sm font-medium mb-3", theme === "dark" ? "text-gray-300" : "text-gray-700")}
                    >
                      Recent Searches
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(search)}
                          className={cn(
                            "flex items-center gap-3 w-full p-2 rounded-lg text-left",
                            theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50",
                          )}
                        >
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className={cn("text-sm", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                            {search}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className={cn("text-sm font-medium mb-3", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                    Popular Topics
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {allTopics.slice(0, 6).map((topic: any) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          router.push(`/topic/${topic.slug}`)
                          onClose()
                        }}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg text-left",
                          theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50",
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                            theme === "dark"
                              ? "bg-emerald-900/40 text-emerald-400"
                              : "bg-emerald-100 text-emerald-800",
                          )}
                        >
                          {topic.name.charAt(0)}
                        </div>
                        <div>
                          <div className={cn("text-sm font-medium", theme === "dark" ? "text-white" : "text-gray-900")}>
                            {topic.name}
                          </div>
                          <div className={cn("text-xs", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                            {topic.questionCount} questions
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
