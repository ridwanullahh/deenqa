"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Upload, Download, Search, Image as ImageIcon, Eye, Bookmark, FileText, User } from "lucide-react"
import { toast } from "sonner"

interface Question {
  id: string
  title: string
  category: string
  tags: string[]
  answer: string
  excerpt: string
  source: string
  scholar: string
  status: "draft" | "published" | "archived"
  viewCount: number
  bookmarkCount: number
  imageUrl?: string
}

export function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: "",
    answer: "",
    excerpt: "",
    source: "",
    scholar: "",
    status: "draft" as Question["status"],
    imageUrl: "",
  })
  const [uploading, setUploading] = useState(false)

  const categories = ["Prayer", "Fasting", "Zakat", "Hajj", "Family", "Business", "Aqeedah", "Tafsir", "Hadith"]

  useEffect(() => {
    fetchQuestions()
  }, [currentPage, filterStatus, filterCategory])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      })
      if (filterStatus !== "all") params.append("status", filterStatus)
      if (filterCategory !== "all") params.append("category", filterCategory)

      const response = await fetch(`/api/admin/questions?${params}`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      toast.error("Failed to fetch questions")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()),
        viewCount: 0,
        bookmarkCount: 0,
      }

      let response
      if (editingQuestion) {
        response = await fetch("/api/admin/questions", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id: editingQuestion.id, ...payload }),
        })
      } else {
        response = await fetch("/api/admin/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        })
      }

      if (response.ok) {
        toast.success(editingQuestion ? "Question updated successfully" : "Question created successfully")
        setIsDialogOpen(false)
        resetForm()
        fetchQuestions()
      } else {
        const data = await response.json().catch(() => ({}))
        toast.error(data.error || "Failed to save question")
      }
    } catch (error) {
      toast.error("Failed to save question")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return

    try {
      const response = await fetch(`/api/admin/questions?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        toast.success("Question deleted successfully")
        fetchQuestions()
      } else {
        const data = await response.json().catch(() => ({}))
        toast.error(data.error || "Failed to delete question")
      }
    } catch (error) {
      toast.error("Failed to delete question")
    }
  }

  const handleEdit = (question: Question) => {
    setEditingQuestion(question)
    setFormData({
      title: question.title,
      category: question.category,
      tags: question.tags.join(", "),
      answer: question.answer,
      excerpt: question.excerpt,
      source: question.source,
      scholar: question.scholar,
      status: question.status,
      imageUrl: question.imageUrl || "",
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingQuestion(null)
    setFormData({
      title: "",
      category: "",
      tags: "",
      answer: "",
      excerpt: "",
      source: "",
      scholar: "",
      status: "draft",
      imageUrl: "",
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({ ...prev, imageUrl: data.url }))
        toast.success("Image uploaded successfully")
      } else {
        toast.error("Failed to upload image")
      }
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(questions, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `questions-export-${Date.now()}.json`
    link.click()
    toast.success("Questions exported successfully")
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const importedQuestions = JSON.parse(text)

      for (const question of importedQuestions) {
        await fetch("/api/admin/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...question,
            viewCount: question.viewCount ?? 0,
            bookmarkCount: question.bookmarkCount ?? 0,
          }),
        })
      }

      toast.success(`${importedQuestions.length} questions imported successfully`)
      fetchQuestions()
    } catch (error) {
      toast.error("Failed to import questions")
    }
  }

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Question Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={formData.status} onValueChange={(value: Question["status"]) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Tags (comma-separated)</Label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="prayer, fasting, hajj"
                    />
                  </div>
                  <div>
                    <Label>Answer</Label>
                    <Textarea
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      rows={8}
                      required
                    />
                  </div>
                  <div>
                    <Label>Excerpt</Label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={2}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Source</Label>
                      <Input
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        placeholder="Sahih Bukhari"
                      />
                    </div>
                    <div>
                      <Label>Scholar</Label>
                      <Input
                        value={formData.scholar}
                        onChange={(e) => setFormData({ ...formData, scholar: e.target.value })}
                        placeholder="Ibn Baz"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Image</Label>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      {formData.imageUrl && (
                        <Button type="button" variant="outline" size="icon" onClick={() => window.open(formData.imageUrl, "_blank")}>
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingQuestion ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" asChild>
              <label>
                <Upload className="h-4 w-4 mr-2" />
                Import
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <Card key={question.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{question.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline">{question.category}</Badge>
                          <Badge variant={question.status === "published" ? "default" : question.status === "archived" ? "secondary" : "outline"}>
                            {question.status}
                          </Badge>
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{question.excerpt}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {question.viewCount} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Bookmark className="h-3 w-3" />
                            {question.bookmarkCount} bookmarks
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {question.source}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {question.scholar}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(question)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(question.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
