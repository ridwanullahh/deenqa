async function fetchWithErrorHandling(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options)
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`)
    }
    return res.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("An unexpected error occurred")
  }
}

export async function getQuestions() {
  const data = await fetchWithErrorHandling("/api/questions?status=published")
  return data.questions || []
}

export async function getQuestion(id: string) {
  const data = await fetchWithErrorHandling(`/api/questions?id=${id}`)
  return data.question
}

export async function getTopics() {
  const data = await fetchWithErrorHandling("/api/topics")
  return data.topics || []
}

export async function getTopic(id: string) {
  const data = await fetchWithErrorHandling(`/api/topics?id=${id}`)
  return data.topic
}

export async function getTopicBySlug(slug: string) {
  const data = await fetchWithErrorHandling(`/api/topics?slug=${slug}`)
  return data.topic
}

export async function searchQuestions(query: string) {
  const data = await fetchWithErrorHandling(
    `/api/search?q=${encodeURIComponent(query)}&type=questions`
  )
  return data.questions || []
}

export async function searchTopics(query: string) {
  const data = await fetchWithErrorHandling(
    `/api/search?q=${encodeURIComponent(query)}&type=topics`
  )
  return data.topics || []
}

const sdk = {
  getQuestions,
  getQuestion,
  getTopics,
  getTopic,
  getTopicBySlug,
  searchQuestions,
  searchTopics,
}

export default sdk
