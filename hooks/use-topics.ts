import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface Topic {
  id: string
  name: string
  slug: string
  questionCount: number
  description?: string
  createdAt: string
  updatedAt: string
}

interface TopicCreate {
  name: string
  slug: string
  questionCount?: number
  description?: string
}

export function useTopics() {
  return useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const res = await fetch("/api/topics")
      if (!res.ok) throw new Error("Failed to fetch topics")
      const data = await res.json()
      return data.topics as Topic[]
    },
  })
}

export function useTopic(id: string) {
  return useQuery({
    queryKey: ["topics", id],
    queryFn: async () => {
      const res = await fetch(`/api/topics?id=${id}`)
      if (!res.ok) throw new Error("Failed to fetch topic")
      const data = await res.json()
      return data.topic as Topic
    },
    enabled: !!id,
  })
}

export function useTopicBySlug(slug: string) {
  return useQuery({
    queryKey: ["topics", "slug", slug],
    queryFn: async () => {
      const res = await fetch(`/api/topics?slug=${slug}`)
      if (!res.ok) throw new Error("Failed to fetch topic")
      const data = await res.json()
      return data.topic as Topic
    },
    enabled: !!slug,
  })
}

export function useSearchTopics(query: string) {
  return useQuery({
    queryKey: ["topics", "search", query],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=topics`)
      if (!res.ok) throw new Error("Failed to search topics")
      const data = await res.json()
      return data.topics as Topic[]
    },
    enabled: query.length > 0,
  })
}

export function useAdminTopics() {
  return useQuery({
    queryKey: ["admin", "topics"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/admin/topics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to fetch topics")
      return res.json()
    },
  })
}

export function useCreateTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TopicCreate) => {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/admin/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create topic")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "topics"] })
    },
  })
}

export function useUpdateTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { id: string } & Partial<Topic>) => {
      const token = localStorage.getItem("adminToken")
      const res = await fetch("/api/admin/topics", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to update topic")
      return res.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["topics"] })
      queryClient.invalidateQueries({ queryKey: ["topics", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["admin", "topics"] })
    },
  })
}

export function useDeleteTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("adminToken")
      const res = await fetch(`/api/admin/topics?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to delete topic")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "topics"] })
    },
  })
}
