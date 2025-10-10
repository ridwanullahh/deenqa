"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { BookmarkIcon, Clock, FileText, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Note {
  questionId: string
  questionTitle: string
  note: string
  createdAt: string
}

export default function ProfilePage() {
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarks")
    const savedHistory = localStorage.getItem("readingHistory")
    const savedNotes = localStorage.getItem("personalNotes")

    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks))
    if (savedHistory) setHistory(JSON.parse(savedHistory))
    if (savedNotes) setNotes(JSON.parse(savedNotes))
  }, [])

  const saveNote = () => {
    if (!selectedQuestion || !newNote.trim()) return

    const historyItem = history.find((h) => h.id === selectedQuestion)
    if (!historyItem) return

    const note: Note = {
      questionId: selectedQuestion,
      questionTitle: historyItem.title,
      note: newNote,
      createdAt: new Date().toISOString(),
    }

    const updatedNotes = [...notes, note]
    setNotes(updatedNotes)
    localStorage.setItem("personalNotes", JSON.stringify(updatedNotes))
    setNewNote("")
    setSelectedQuestion(null)
    toast.success("Note saved successfully")
  }

  const deleteNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index)
    setNotes(updatedNotes)
    localStorage.setItem("personalNotes", JSON.stringify(updatedNotes))
    toast.success("Note deleted")
  }

  const stats = {
    bookmarksCount: bookmarks.length,
    historyCount: history.length,
    notesCount: notes.length,
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Your bookmarks, history, and personal notes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
            <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookmarksCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reading History</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.historyCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notesCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookmarks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="bookmarks">
          <Card>
            <CardHeader>
              <CardTitle>Saved Bookmarks</CardTitle>
            </CardHeader>
            <CardContent>
              {bookmarks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No bookmarks yet. Start bookmarking questions you want to save.
                </div>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((id) => {
                    const item = history.find((h) => h.id === id)
                    return item ? (
                      <Link
                        key={id}
                        href={`/question/${id}`}
                        className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <p className="font-medium">{item.title}</p>
                        <Badge variant="outline" className="mt-1">
                          {item.category}
                        </Badge>
                      </Link>
                    ) : null
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Reading History</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No reading history yet. Start exploring questions.
                </div>
              ) : (
                <div className="space-y-2">
                  {history.slice(0, 20).map((item) => (
                    <Link
                      key={`${item.id}-${item.viewedAt}`}
                      href={`/question/${item.id}`}
                      className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Badge variant="outline">{item.category}</Badge>
                        <span>•</span>
                        <span>{new Date(item.viewedAt).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Personal Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Add Note</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedQuestion || ""}
                  onChange={(e) => setSelectedQuestion(e.target.value)}
                >
                  <option value="">Select a question from history</option>
                  {history.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
                <Textarea
                  placeholder="Write your note here..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={4}
                />
                <Button onClick={saveNote} disabled={!selectedQuestion || !newNote.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Note
                </Button>
              </div>

              {notes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No notes yet. Add notes to remember key points from questions.
                </div>
              ) : (
                <div className="space-y-3 mt-6">
                  {notes.map((note, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{note.questionTitle}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNote(index)}
                          >
                            Delete
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{note.note}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
