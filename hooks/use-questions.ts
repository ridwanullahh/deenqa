"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface Question {
  id: string
  title: string
  answer: string
  excerpt?: string
  topicIds: string[]
  tags: string[]
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
  createdBy?: string
  viewCount: number
  bookmarkCount: number
  imageUrl?: string
  source?: string
  scholar?: string
  category?: string
}

interface QuestionCreate {
  title: string
  answer: string
  excerpt?: string
  topicIds?: string[]
  tags?: string[]
  status?: "draft" | "published" | "archived"
  viewCount?: number
  bookmarkCount?: number
  imageUrl?: string
}

// The admin JWT is an httpOnly cookie named `deenqa_admin`; the browser
// sends it automatically with every same-origin request. No localStorage
// token is needed.

export function useQuestions(status: string = "published") {
  return useQuery({
    queryKey: ["questions", status],
    queryFn: async () => {
      const res = await fetch(`/api/questions?status=${status}`)
      if (!res.ok) throw new Error("Failed to fetch questions")
      const data = await res.json()
      return data.questions as Question[]
    },
  })
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: ["questions", id],
    queryFn: async () => {
      const res = await fetch(`/api/questions?id=${id}`)
      if (!res.ok) throw new Error("Failed to fetch question")
      const data = await res.json()
      return data.question as Question
    },
    enabled: !!id,
  })
}

export function useQuestionsByTopic(topicId: string) {
  return useQuery({
    queryKey: ["questions", "topic", topicId],
    queryFn: async () => {
      const res = await fetch(`/api/questions?topicId=${topicId}&status=published`)
      if (!res.ok) throw new Error("Failed to fetch questions")
      const data = await res.json()
      return data.questions as Question[]
    },
    enabled: !!topicId,
  })
}

export function useSearchQuestions(query: string) {
  return useQuery({
    queryKey: ["questions", "search", query],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=questions`)
      if (!res.ok) throw new Error("Failed to search questions")
      const data = await res.json()
      return data.questions as Question[]
    },
    enabled: query.length > 0,
  })
}

export function useAdminQuestions(params: {
  status?: string
  page?: number
  limit?: number
  sort?: string
  order?: string
  search?: string
}) {
  const queryParams = new URLSearchParams()
  if (params.status) queryParams.append("status", params.status)
  if (params.page) queryParams.append("page", params.page.toString())
  if (params.limit) queryParams.append("limit", params.limit.toString())
  if (params.sort) queryParams.append("sort", params.sort)
  if (params.order) queryParams.append("order", params.order)
  if (params.search) queryParams.append("search", params.search)

  return useQuery({
    queryKey: ["admin", "questions", ...Object.values(params)],
    queryFn: async () => {
      // credentials: "include" ensures the httpOnly admin cookie is sent
      const res = await fetch(`/api/admin/questions?${queryParams}`, {
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch questions")
      return res.json()
    },
  })
}

export function useCreateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: QuestionCreate) => {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to create question")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "questions"] })
    },
  })
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { id: string } & Partial<Question>) => {
      const res = await fetch("/api/admin/questions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to update question")
      }
      return res.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      queryClient.invalidateQueries({ queryKey: ["questions", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["admin", "questions"] })
    },
  })
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/questions?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to delete question")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "questions"] })
    },
  })
}

export async function incrementQuestionView(id: string) {
  try {
    await fetch(`/api/questions/${id}/view`, {
      method: "POST",
      credentials: "include",
    })
  } catch (error) {
    console.error("Failed to increment view count:", error)
  }
}
