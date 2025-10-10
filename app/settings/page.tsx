"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Moon, Sun, Globe, Bell, VolumeIcon as VolumeUp, Type, Eye, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import BottomNav from "@/components/bottom-nav"

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [fontSize, setFontSize] = useState("medium")
  const [language, setLanguage] = useState("english")
  const [notifications, setNotifications] = useState(true)
  const [autoPlayAudio, setAutoPlayAudio] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Load settings from localStorage in a real app
    const savedFontSize = localStorage.getItem("fontSize") || "medium"
    const savedLanguage = localStorage.getItem("language") || "english"
    const savedNotifications = localStorage.getItem("notifications") !== "false"
    const savedAutoPlayAudio = localStorage.getItem("autoPlayAudio") === "true"

    setFontSize(savedFontSize)
    setLanguage(savedLanguage)
    setNotifications(savedNotifications)
    setAutoPlayAudio(savedAutoPlayAudio)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("fontSize", fontSize)
      localStorage.setItem("language", language)
      localStorage.setItem("notifications", notifications.toString())
      localStorage.setItem("autoPlayAudio", autoPlayAudio.toString())

      // Apply font size to document
      document.documentElement.style.fontSize = fontSize === "small" ? "14px" : fontSize === "large" ? "18px" : "16px"
    }
  }, [fontSize, language, notifications, autoPlayAudio, mounted])

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const toggleNotifications = () => {
    setNotifications(!notifications)
  }

  const toggleAutoPlayAudio = () => {
    setAutoPlayAudio(!autoPlayAudio)
  }

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
            Settings
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Appearance */}
          <div>
            <h2 className={cn("text-lg font-medium mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
              Appearance
            </h2>
            <div className={cn("rounded-xl overflow-hidden", theme === "dark" ? "bg-gray-800" : "bg-white")}>
              <button
                onClick={toggleTheme}
                className={cn(
                  "flex items-center justify-between w-full p-4",
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50",
                )}
              >
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon className={cn("h-5 w-5", theme === "dark" ? "text-gray-300" : "text-gray-700")} />
                  ) : (
                    <Sun className={cn("h-5 w-5", theme === "dark" ? "text-gray-300" : "text-gray-700")} />
                  )}
                  <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Dark Mode</span>
                </div>
                <div
                  className={cn("w-12 h-6 rounded-full relative", theme === "dark" ? "bg-emerald-600" : "bg-gray-300")}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                      theme === "dark" ? "right-1" : "left-1",
                    )}
                  />
                </div>
              </button>

              <div className={cn("h-px", theme === "dark" ? "bg-gray-700" : "bg-gray-200")} />

              <div className={cn("p-4", theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50")}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Type className={cn("h-5 w-5", theme === "dark" ? "text-gray-300" : "text-gray-700")} />
                    <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Font Size</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFontSize("small")}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg",
                      fontSize === "small"
                        ? theme === "dark"
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-600 text-white"
                        : theme === "dark"
                          ? "bg-gray-700 text-gray-300 border border-gray-600"
                          : "bg-gray-100 text-gray-700",
                    )}
                  >
                    Small
                  </button>
                  <button
                    onClick={() => setFontSize("medium")}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg",
                      fontSize === "medium"
                        ? theme === "dark"
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-600 text-white"
                        : theme === "dark"
                          ? "bg-gray-700 text-gray-300 border border-gray-600"
                          : "bg-gray-100 text-gray-700",
                    )}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setFontSize("large")}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg",
                      fontSize === "large"
                        ? theme === "dark"
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-600 text-white"
                        : theme === "dark"
                          ? "bg-gray-700 text-gray-300 border border-gray-600"
                          : "bg-gray-100 text-gray-700",
                    )}
                  >
                    Large
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Language & Region */}
          <div>
            <h2 className={cn("text-lg font-medium mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
              Language & Region
            </h2>
            <div className={cn("rounded-xl overflow-hidden", theme === "dark" ? "bg-gray-800" : "bg-white")}>
              <div className={cn("p-4", theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className={cn("h-5 w-5", theme === "dark" ? "text-gray-300" : "text-gray-700")} />
                    <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Language</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={cn(
                        "bg-transparent border-none text-right pr-8 appearance-none",
                        theme === "dark" ? "text-gray-300" : "text-gray-700",
                      )}
                    >
                      <option value="english">English</option>
                      <option value="arabic">Arabic</option>
                      <option value="urdu">Urdu</option>
                      <option value="french">French</option>
                      <option value="indonesian">Indonesian</option>
                    </select>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h2 className={cn("text-lg font-medium mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
              Notifications & Media
            </h2>
            <div className={cn("rounded-xl overflow-hidden", theme === "dark" ? "bg-gray-800" : "bg-white")}>
              <button
                onClick={toggleNotifications}
                className={cn(
                  "flex items-center justify-between w-full p-4",
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <Bell className={cn("h-5 w-5", theme === "dark" ? "text-gray-300" : "text-gray-700")} />
                  <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Push Notifications</span>
                </div>
                <div
                  className={cn(
                    "w-12 h-6 rounded-full relative",
                    notifications ? "bg-emerald-600" : theme === "dark" ? "bg-gray-700" : "bg-gray-300",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                      notifications ? "right-1" : "left-1",
                    )}
                  />
                </div>
              </button>

              <div className={cn("h-px", theme === "dark" ? "bg-gray-700" : "bg-gray-200")} />

              <button
                onClick={toggleAutoPlayAudio}
                className={cn(
                  "flex items-center justify-between w-full p-4",
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <VolumeUp className={cn("h-5 w-5", theme === "dark" ? "text-gray-300" : "text-gray-700")} />
                  <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Auto-play Audio</span>
                </div>
                <div
                  className={cn(
                    "w-12 h-6 rounded-full relative",
                    autoPlayAudio ? "bg-emerald-600" : theme === "dark" ? "bg-gray-700" : "bg-gray-300",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                      autoPlayAudio ? "right-1" : "left-1",
                    )}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Accessibility */}
          <div>
            <h2 className={cn("text-lg font-medium mb-4", theme === "dark" ? "text-white" : "text-gray-900")}>
              Accessibility
            </h2>
            <div className={cn("rounded-xl overflow-hidden", theme === "dark" ? "bg-gray-800" : "bg-white")}>
              <Link
                href="/accessibility"
                className={cn(
                  "flex items-center justify-between w-full p-4",
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <Eye className={cn("h-5 w-5", theme === "dark" ? "text-gray-300" : "text-gray-700")} />
                  <span className={theme === "dark" ? "text-white" : "text-gray-900"}>Screen Reader Support</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </Link>
            </div>
          </div>

          {/* About */}
          <div className="pt-4 text-center">
            <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-500")}>
              Islamic Q&A Platform v1.0.0
            </p>
            <p className={cn("text-xs mt-1", theme === "dark" ? "text-gray-500" : "text-gray-400")}>
              © 2023 Islamic Knowledge Foundation
            </p>
          </div>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
