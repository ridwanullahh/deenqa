"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Bookmark, Moon, Sun, Menu, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import TopicCard from "@/components/topic-card"
import QuestionCard from "@/components/question-card"
import BottomNav from "@/components/bottom-nav"
import SearchModal from "@/components/search-modal"
import { useMobile } from "@/hooks/use-mobile"
import { useQuestions } from "@/hooks/use-questions"
import { useTopics } from "@/hooks/use-topics"
import { ErrorBoundary } from "@/components/error-boundary"

function HomePageContent() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const isMobile = useMobile()

  const { data: questions = [], isLoading: questionsLoading, error: questionsError } = useQuestions()
  const { data: topics = [], isLoading: topicsLoading, error: topicsError } = useTopics()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const featuredQuestions = questions.slice(0, 5)
  const trendingQuestions = questions.slice(5, 10)

  if (questionsError || topicsError) {
    throw new Error("Failed to load data. Please try again later.")
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
            onClick={() => setIsMenuOpen(true)}
            className={cn("p-2 rounded-full", theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100")}
          >
            <Menu className={cn("h-6 w-6", theme === "dark" ? "text-gray-200" : "text-gray-700")} />
          </button>
          <h1 className={cn("text-xl font-semibold", theme === "dark" ? "text-white" : "text-emerald-800")}>
            IslamicQ&A
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className={cn("p-2 rounded-full", theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100")}
          >
            <Search className={cn("h-5 w-5", theme === "dark" ? "text-gray-200" : "text-gray-700")} />
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn("p-2 rounded-full", theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-gray-200" /> : <Moon className="h-5 w-5 text-gray-700" />}
          </button>
          <Link
            href="/bookmarks"
            className={cn("p-2 rounded-full", theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100")}
          >
            <Bookmark className={cn("h-5 w-5", theme === "dark" ? "text-gray-200" : "text-gray-700")} />
          </Link>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "fixed top-0 left-0 h-full w-[280px] z-50 p-4 flex flex-col",
                theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900",
              )}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={cn("p-2 rounded-full", theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1">
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/"
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        theme === "dark" ? "bg-gray-800" : "bg-emerald-50 text-emerald-900",
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/topics"
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100",
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                      </svg>
                      Topics
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/archive"
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100",
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Archive
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/bookmarks"
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100",
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                      </svg>
                      Bookmarks
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/history"
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100",
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      History
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/glossary"
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                        theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100",
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Glossary
                    </Link>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3
                    className={cn(
                      "px-3 mb-2 text-sm font-medium",
                      theme === "dark" ? "text-gray-400" : "text-gray-500",
                    )}
                  >
                    Settings
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        href="/settings"
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                          theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100",
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                        </svg>
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/profile"
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                          theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100",
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Profile
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>

              <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className={cn("px-3 text-sm", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
                  <p>Islamic Q&A Platform</p>
                  <p className="mt-1">Version 1.0.0</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 px-4 py-6 pb-20">
        {(questionsLoading || topicsLoading) && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        )}

        {!questionsLoading && !topicsLoading && (
          <>
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className={cn("text-xl font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                  Daily Featured
                </h2>
                <Link
                  href="/featured"
                  className={cn(
                    "text-sm font-medium",
                    theme === "dark"
                      ? "text-emerald-400 hover:text-emerald-300"
                      : "text-emerald-600 hover:text-emerald-700",
                  )}
                >
                  View All
                </Link>
              </div>

              <div className="relative overflow-hidden rounded-2xl">
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-90",
                    theme === "dark" ? "opacity-80" : "opacity-90",
                  )}
                />
                <div className="relative p-6 text-white">
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-medium bg-white/20 rounded-full">
                    Featured
                  </span>
                  <h3 className="text-xl font-bold mb-2">
                    {featuredQuestions[0]?.title || "Explore Islamic Knowledge"}
                  </h3>
                  <p className="mb-4 text-white/90 line-clamp-2">
                    {featuredQuestions[0]?.excerpt || "Browse our collection of authentic Islamic Q&A"}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/80">
                      <span className="font-medium">Browse Topics</span>
                    </div>
                    {featuredQuestions[0] && (
                      <Link
                        href={`/question/${featuredQuestions[0].id}`}
                        className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium text-emerald-900 bg-white rounded-lg hover:bg-white/90"
                      >
                        Read More
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className={cn("text-xl font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                  Browse by Topic
                </h2>
                <Link
                  href="/topics"
                  className={cn(
                    "text-sm font-medium",
                    theme === "dark"
                      ? "text-emerald-400 hover:text-emerald-300"
                      : "text-emerald-600 hover:text-emerald-700",
                  )}
                >
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {topics.length === 0 && (
                  <div className="col-span-2 md:col-span-4 text-center py-8">
                    <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      No topics available yet
                    </p>
                  </div>
                )}
                {topics.slice(0, 4).map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className={cn("text-xl font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                  Trending Questions
                </h2>
                <Link
                  href="/trending"
                  className={cn(
                    "text-sm font-medium",
                    theme === "dark"
                      ? "text-emerald-400 hover:text-emerald-300"
                      : "text-emerald-600 hover:text-emerald-700",
                  )}
                >
                  View All
                </Link>
              </div>

              <div className="space-y-6">
                {trendingQuestions.length === 0 && (
                  <div className="text-center py-8">
                    <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                      No questions available yet
                    </p>
                  </div>
                )}
                {trendingQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className={cn("text-xl font-semibold", theme === "dark" ? "text-white" : "text-gray-900")}>
                  Recently Added
                </h2>
              </div>

              <div className="space-y-6">
                {featuredQuestions.slice(0, 3).map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

export default function HomePage() {
  return (
    <ErrorBoundary>
      <HomePageContent />
    </ErrorBoundary>
  )
}
