"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pencil, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"

interface Topic {
  id: string
  name: string
  slug: string
  questionCount: number
  color: string
  description: string
}

export function TopicManager() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    questionCount: 0,
    color: "emerald",
    description: "",
  })

  const colors = ["emerald", "blue", "amber", "purple", "rose", "cyan", "pink", "indigo"]

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/topics", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setTopics(data.topics)
      }
    } catch (error) {
      toast.error("Failed to fetch topics")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let response
      if (editingTopic) {
        response = await fetch("/api/admin/topics", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id: editingTopic.id, ...formData }),
        })
      } else {
        response = await fetch("/api/admin/topics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        })
      }

      if (response.ok) {
        toast.success(editingTopic ? "Topic updated successfully" : "Topic created successfully")
        setIsDialogOpen(false)
        resetForm()
        fetchTopics()
      } else {
        const data = await response.json().catch(() => ({}))
        toast.error(data.error || "Failed to save topic")
      }
    } catch (error) {
      toast.error("Failed to save topic")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this topic?")) return

    try {
      const response = await fetch(`/api/admin/topics?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        toast.success("Topic deleted successfully")
        fetchTopics()
      } else {
        const data = await response.json().catch(() => ({}))
        toast.error(data.error || "Failed to delete topic")
      }
    } catch (error) {
      toast.error("Failed to delete topic")
    }
  }

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic)
    setFormData({
      name: topic.name,
      slug: topic.slug,
      questionCount: topic.questionCount,
      color: topic.color,
      description: topic.description,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingTopic(null)
    setFormData({
      name: "",
      slug: "",
      questionCount: 0,
      color: "emerald",
      description: "",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Topic Management</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Topic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingTopic ? "Edit Topic" : "Add New Topic"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value
                        setFormData({
                          ...formData,
                          name,
                          slug: name.toLowerCase().replace(/\s+/g, "-"),
                        })
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Question Count</Label>
                    <Input
                      type="number"
                      value={formData.questionCount}
                      onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Color</Label>
                    <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color} value={color}>
                            <span className="flex items-center gap-2">
                              <span className={`w-4 h-4 rounded-full bg-${color}-500`} />
                              {color}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingTopic ? "Update" : "Create"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <Card key={topic.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{topic.name}</h3>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(topic)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(topic.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{topic.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full bg-${topic.color}-500`} />
                      <span className="text-sm">{topic.questionCount} questions</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
