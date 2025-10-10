"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const glossaryTerms = [
  { term: "Salah", definition: "The Islamic prayer, one of the Five Pillars of Islam", category: "Worship" },
  { term: "Zakat", definition: "Obligatory charity given to the poor, one of the Five Pillars", category: "Worship" },
  { term: "Hajj", definition: "The pilgrimage to Makkah, required once in a lifetime for those who are able", category: "Worship" },
  { term: "Sawm", definition: "Fasting, especially during Ramadan", category: "Worship" },
  { term: "Shahada", definition: "The Islamic testimony of faith", category: "Aqeedah" },
  { term: "Iman", definition: "Faith and belief in Islamic principles", category: "Aqeedah" },
  { term: "Tawhid", definition: "The Oneness of Allah", category: "Aqeedah" },
  { term: "Wudu", definition: "Ritual ablution performed before prayer", category: "Purification" },
  { term: "Ghusl", definition: "Full ritual bath for purification", category: "Purification" },
  { term: "Qiblah", definition: "The direction of the Ka'bah in Makkah, faced during prayer", category: "Prayer" },
  { term: "Riba", definition: "Interest or usury, prohibited in Islam", category: "Finance" },
  { term: "Halal", definition: "Permissible according to Islamic law", category: "Fiqh" },
  { term: "Haram", definition: "Forbidden according to Islamic law", category: "Fiqh" },
  { term: "Makruh", definition: "Disliked but not forbidden", category: "Fiqh" },
  { term: "Mustahabb", definition: "Recommended but not obligatory", category: "Fiqh" },
  { term: "Fard", definition: "Obligatory religious duty", category: "Fiqh" },
  { term: "Sunnah", definition: "The way of the Prophet Muhammad (peace be upon him)", category: "Hadith" },
  { term: "Hadith", definition: "Narrations about the Prophet Muhammad (peace be upon him)", category: "Hadith" },
  { term: "Sahih", definition: "Authentic, used to describe authentic hadiths", category: "Hadith" },
  { term: "Tafsir", definition: "Exegesis or explanation of the Quran", category: "Quran" },
  { term: "Surah", definition: "A chapter of the Quran", category: "Quran" },
  { term: "Ayah", definition: "A verse of the Quran", category: "Quran" },
  { term: "Jummah", definition: "Friday, specifically the Friday congregational prayer", category: "Prayer" },
  { term: "Eid", definition: "Islamic celebration, Eid al-Fitr and Eid al-Adha", category: "Celebration" },
  { term: "Ramadan", definition: "The ninth month of the Islamic calendar, month of fasting", category: "Fasting" },
  { term: "Zakah al-Fitr", definition: "Charity given at the end of Ramadan", category: "Charity" },
  { term: "Sadaqah", definition: "Voluntary charity", category: "Charity" },
  { term: "Jihad", definition: "Striving or struggling in the way of Allah", category: "General" },
  { term: "Khutbah", definition: "Sermon, especially the Friday sermon", category: "Prayer" },
  { term: "Masjid", definition: "Mosque, place of worship", category: "General" },
  { term: "Ummah", definition: "The global Muslim community", category: "General" },
  { term: "Dua", definition: "Supplication or prayer to Allah", category: "Worship" },
  { term: "Dhikr", definition: "Remembrance of Allah", category: "Worship" },
  { term: "Taqwa", definition: "God-consciousness, piety", category: "Spirituality" },
  { term: "Ihsan", definition: "Excellence in worship, doing good", category: "Spirituality" },
]

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTerms = glossaryTerms.filter(
    (item) =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const firstLetter = term.term[0].toUpperCase()
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(term)
    return acc
  }, {} as Record<string, typeof glossaryTerms>)

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Islamic Glossary</h1>
        <p className="text-muted-foreground">
          Common Islamic terms and their definitions
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

      {Object.keys(groupedTerms)
        .sort()
        .map((letter) => (
          <div key={letter} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">{letter}</h2>
            <div className="space-y-4">
              {groupedTerms[letter].map((term) => (
                <Card key={term.term}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{term.term}</h3>
                      <Badge variant="secondary">{term.category}</Badge>
                    </div>
                    <p className="text-muted-foreground">{term.definition}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No terms found matching your search</p>
        </div>
      )}
    </div>
  )
}
