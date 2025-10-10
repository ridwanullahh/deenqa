"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, AlertCircle } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuestions, useCreateQuestion, useUpdateQuestion, useDeleteQuestion } from "@/hooks/use-questions"
import { ErrorBoundary } from "@/components/error-boundary"
import type { QuestionCreate } from "@/lib/types"

function AdminQuestionsPageContent() {
  const { theme } = useTheme()
  const { data: questions = [], isLoading, error } = useQuestions()
  const createMutation = useCreateQuestion()
  const updateMutation = useUpdateQuestion()
  const deleteMutation = useDeleteQuestion()
  const [isEditing, setIsEditing] = useState<any>(null)
  const [formError, setFormError] = useState("")

  const handleSubmit = async () => {
    setFormError("")
    
    try {
      if (!isEditing.title || !isEditing.answer) {
        setFormError("Title and answer are required")
        return
      }

      if (isEditing.id) {
        await updateMutation.mutateAsync(isEditing)
      } else {
        const questionData: QuestionCreate = {
          title: isEditing.title,
          answer: isEditing.answer,
          excerpt: isEditing.excerpt || "",
          topicIds: [],
          tags: [],
          status: "published",
        }
        await createMutation.mutateAsync(questionData)
      }
      setIsEditing(null)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save question")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return
    
    try {
      await deleteMutation.mutateAsync(id)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete question")
    }
  }

  if (error) {
    throw new Error("Failed to load questions. Please try again later.")
  }

  return (
    <div className={cn("min-h-screen", theme === "dark" ? "bg-gray-950" : "bg-[#f8f6f1]")}>
      <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm dark:border-b dark:border-gray-800">
        <h1 className="text-xl font-semibold text-emerald-800 dark:text-white">
          Manage Questions
        </h1>
      </header>
      <main className="p-6">
        <div className="mb-6">
          <Button onClick={() => setIsEditing({ title: "", answer: "", excerpt: "" })} disabled={isLoading}>
            Add New Question
          </Button>
        </div>

        {isEditing && (
          <div className="mb-6 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-lg font-semibold mb-4">{isEditing.id ? "Edit" : "Add"} Question</h2>
            
            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{formError}</span>
              </div>
            )}

            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={isEditing.title || ""}
                onChange={(e) => setIsEditing({ ...isEditing, title: e.target.value })}
                disabled={createMutation.isPending || updateMutation.isPending}
              />
              <Input
                placeholder="Excerpt"
                value={isEditing.excerpt || ""}
                onChange={(e) => setIsEditing({ ...isEditing, excerpt: e.target.value })}
                disabled={createMutation.isPending || updateMutation.isPending}
              />
              <Textarea
                placeholder="Answer"
                value={isEditing.answer || ""}
                onChange={(e) => setIsEditing({ ...isEditing, answer: e.target.value })}
                rows={6}
                disabled={createMutation.isPending || updateMutation.isPending}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {isEditing.id ? "Update" : "Create"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(null)
                    setFormError("")
                  }}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <p className={cn("text-sm", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
              No questions yet. Add your first question!
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Excerpt</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{q.excerpt}</TableCell>
                    <TableCell className="space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => setIsEditing(q)}
                        disabled={deleteMutation.isPending}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(q.id)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  )
}

export default function AdminQuestionsPage() {
  return (
    <ErrorBoundary>
      <AdminQuestionsPageContent />
    </ErrorBoundary>
  )
}
