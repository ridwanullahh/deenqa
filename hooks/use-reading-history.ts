import { useEffect, useState } from "react"

interface HistoryItem {
  id: string
  title: string
  category: string
  viewedAt: string
}

export function useReadingHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("readingHistory")
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const addToHistory = (item: Omit<HistoryItem, "viewedAt">) => {
    const newItem: HistoryItem = {
      ...item,
      viewedAt: new Date().toISOString(),
    }

    const updated = [newItem, ...history.filter((h) => h.id !== item.id)].slice(0, 50)
    setHistory(updated)
    localStorage.setItem("readingHistory", JSON.stringify(updated))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("readingHistory")
  }

  const removeItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id)
    setHistory(updated)
    localStorage.setItem("readingHistory", JSON.stringify(updated))
  }

  return { history, addToHistory, clearHistory, removeItem }
}
