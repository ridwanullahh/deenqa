"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface GlossaryTerm {
  id: string
  term: string
  definition: string
  category: string
  transliteration?: string
  arabic?: string
}

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGlossary()
  }, [])

  const fetchGlossary = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/glossary", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setTerms(data.glossary || [])
      }
    } catch (error) {
      console.error("Failed to load glossary:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTerms = terms.filter(
    (item) =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.transliteration ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  )

  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const firstLetter = term.term[0]?.toUpperCase() || "?"
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(term)
    return acc
  }, {} as Record<string, GlossaryTerm[]>)

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Islamic Glossary</h1>
        <p className="text-muted-foreground">
          Common Islamic terms and their definitions — sourced from the
          Lightbase `glossary` collection when configured, falling back to the
          in-code seed glossary in local development.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">Loading terms...</p>
        </div>
      ) : terms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No terms available.</p>
        </div>
      ) : (
        Object.keys(groupedTerms)
          .sort()
          .map((letter) => (
            <div key={letter} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">{letter}</h2>
              <div className="space-y-4">
                {groupedTerms[letter].map((term) => (
                  <Card key={term.id || term.term}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {term.term}
                            {term.arabic && (
                              <span className="ml-3 text-emerald-700 dark:text-emerald-400 text-lg" dir="rtl">
                                {term.arabic}
                              </span>
                            )}
                          </h3>
                          {term.transliteration && (
                            <p className="text-xs text-muted-foreground">
                              {term.transliteration}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary">{term.category}</Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {term.definition}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
      )}

      {!loading && filteredTerms.length === 0 && terms.length > 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No terms found matching your search.
          </p>
        </div>
      )}
    </div>
  )
}
