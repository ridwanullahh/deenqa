"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import TopicCard from "@/components/topic-card"
import BottomNav from "@/components/bottom-nav"
import SearchModal from "@/components/search-modal"
import { useTopics, useSearchTopics } from "@/hooks/use-topics"
import { ErrorBoundary } from "@/components/error-boundary"

function TopicsPageContent() {
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const { data: allTopics = [], isLoading, error } = useTopics()
  const { data: searchResults } = useSearchTopics(searchQuery)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (error) {
    throw new Error("Failed to load topics. Please try again later.")
  }

  const topics = searchQuery && searchResults ? searchResults : allTopics

  return (
    <div className={cn("min-h-screen flex flex-col", theme === "dark" ? "bg-gray-950" : "bg-[#f8f6f1]")}>
      {/* Header */}
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
            Browse Topics
          </h1>
        </div>
        <button
          onClick={() => setIsSearchOpen(true)}
          className={cn("p-2 rounded-full", theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100")}
        >
          <Search className={cn("h-5 w-5", theme === "dark" ? "text-gray-200" : "text-gray-700")} />
        </button>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Search Bar */}
      <div
        className={cn(
          "sticky top-[57px] z-20 px-4 py-3",
          theme === "dark"
            ? "bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
            : "bg-white/80 backdrop-blur-md shadow-sm",
        )}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2.5 rounded-xl transition-all border-0 focus:ring-2 focus:ring-emerald-500/50",
              theme === "dark"
                ? "bg-gray-800 text-white placeholder-gray-400"
                : "bg-gray-100 text-gray-900 placeholder-gray-500",
            )}
          />
          <Search
            className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
              theme === "dark" ? "text-gray-400" : "text-gray-500",
            )}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12">
            <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              {searchQuery ? "No topics found matching your search" : "No topics available yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TopicCard topic={topic} />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}

export default function TopicsPage() {
  return (
    <ErrorBoundary>
      <TopicsPageContent />
    </ErrorBoundary>
  )
}
