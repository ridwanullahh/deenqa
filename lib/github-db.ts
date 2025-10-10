import { Octokit } from "@octokit/rest"

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const GITHUB_OWNER = process.env.GITHUB_OWNER || "your-org"
const GITHUB_REPO = process.env.GITHUB_REPO || "qa-data"
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main"

interface Question {
  id: string
  title: string
  answer: string
  excerpt?: string
  topicIds: string[]
  tags: string[]
  status: "draft" | "published" | "pending"
  createdAt: string
  updatedAt: string
  createdBy: string
  viewCount: number
  bookmarkCount: number
  imageUrl?: string
}

interface Topic {
  id: string
  name: string
  slug: string
  questionCount: number
  description?: string
  createdAt: string
  updatedAt: string
}

interface AuditLog {
  id: string
  action: string
  entity: "question" | "topic"
  entityId: string
  userId: string
  timestamp: string
  changes?: Record<string, unknown>
}

interface Analytics {
  totalQuestions: number
  totalTopics: number
  totalViews: number
  totalBookmarks: number
  dailyStats: Array<{
    date: string
    views: number
    searches: number
  }>
}

async function getFileFromGitHub(path: string): Promise<any> {
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      ref: GITHUB_BRANCH,
    })

    if ("content" in data && data.type === "file") {
      const content = Buffer.from(data.content, "base64").toString("utf-8")
      return { content: JSON.parse(content), sha: data.sha }
    }

    throw new Error(`File ${path} not found or is not a file`)
  } catch (error: any) {
    if (error.status === 404) {
      return { content: getDefaultContent(path), sha: null }
    }
    throw error
  }
}

async function updateFileInGitHub(
  path: string,
  content: any,
  message: string,
  sha?: string | null
): Promise<void> {
  const contentString = JSON.stringify(content, null, 2)
  const contentBase64 = Buffer.from(contentString).toString("base64")

  const params: any = {
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path,
    message,
    content: contentBase64,
    branch: GITHUB_BRANCH,
  }

  if (sha) {
    params.sha = sha
  }

  await octokit.repos.createOrUpdateFileContents(params)
}

function getDefaultContent(path: string): any {
  if (path === "questions.json") return []
  if (path === "topics.json") return []
  if (path === "audit-logs.json") return []
  if (path === "analytics.json") {
    return {
      totalQuestions: 0,
      totalTopics: 0,
      totalViews: 0,
      totalBookmarks: 0,
      dailyStats: [],
    }
  }
  return null
}

export async function getQuestions(): Promise<Question[]> {
  const { content } = await getFileFromGitHub("questions.json")
  return content
}

export async function getQuestion(id: string): Promise<Question | null> {
  const questions = await getQuestions()
  return questions.find((q) => q.id === id) || null
}

export async function createQuestion(
  question: Omit<Question, "id" | "createdAt" | "updatedAt">
): Promise<Question> {
  const { content: questions, sha } = await getFileFromGitHub("questions.json")
  const newQuestion: Question = {
    ...question,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  questions.push(newQuestion)

  await updateFileInGitHub(
    "questions.json",
    questions,
    `Create question: ${newQuestion.title}`,
    sha
  )

  await logAudit("create", "question", newQuestion.id, question.createdBy)
  await updateAnalytics()

  return newQuestion
}

export async function updateQuestion(
  id: string,
  updates: Partial<Question>,
  userId: string
): Promise<Question | null> {
  const { content: questions, sha } = await getFileFromGitHub("questions.json")
  const index = questions.findIndex((q: Question) => q.id === id)

  if (index === -1) return null

  const updatedQuestion = {
    ...questions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  questions[index] = updatedQuestion

  await updateFileInGitHub(
    "questions.json",
    questions,
    `Update question: ${updatedQuestion.title}`,
    sha
  )

  await logAudit("update", "question", id, userId, updates)
  await updateAnalytics()

  return updatedQuestion
}

export async function deleteQuestion(
  id: string,
  userId: string
): Promise<boolean> {
  const { content: questions, sha } = await getFileFromGitHub("questions.json")
  const filtered = questions.filter((q: Question) => q.id !== id)

  if (filtered.length === questions.length) return false

  await updateFileInGitHub(
    "questions.json",
    filtered,
    `Delete question: ${id}`,
    sha
  )

  await logAudit("delete", "question", id, userId)
  await updateAnalytics()

  return true
}

export async function getTopics(): Promise<Topic[]> {
  const { content } = await getFileFromGitHub("topics.json")
  return content
}

export async function getTopic(id: string): Promise<Topic | null> {
  const topics = await getTopics()
  return topics.find((t) => t.id === id) || null
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const topics = await getTopics()
  return topics.find((t) => t.slug === slug) || null
}

export async function createTopic(
  topic: Omit<Topic, "id" | "createdAt" | "updatedAt">
): Promise<Topic> {
  const { content: topics, sha } = await getFileFromGitHub("topics.json")
  const newTopic: Topic = {
    ...topic,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  topics.push(newTopic)

  await updateFileInGitHub(
    "topics.json",
    topics,
    `Create topic: ${newTopic.name}`,
    sha
  )

  await logAudit("create", "topic", newTopic.id, "admin")

  return newTopic
}

export async function updateTopic(
  id: string,
  updates: Partial<Topic>,
  userId: string
): Promise<Topic | null> {
  const { content: topics, sha } = await getFileFromGitHub("topics.json")
  const index = topics.findIndex((t: Topic) => t.id === id)

  if (index === -1) return null

  const updatedTopic = {
    ...topics[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  topics[index] = updatedTopic

  await updateFileInGitHub(
    "topics.json",
    topics,
    `Update topic: ${updatedTopic.name}`,
    sha
  )

  await logAudit("update", "topic", id, userId, updates)

  return updatedTopic
}

export async function deleteTopic(
  id: string,
  userId: string
): Promise<boolean> {
  const { content: topics, sha } = await getFileFromGitHub("topics.json")
  const filtered = topics.filter((t: Topic) => t.id !== id)

  if (filtered.length === topics.length) return false

  await updateFileInGitHub("topics.json", filtered, `Delete topic: ${id}`, sha)

  await logAudit("delete", "topic", id, userId)

  return true
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const { content } = await getFileFromGitHub("audit-logs.json")
  return content
}

async function logAudit(
  action: string,
  entity: "question" | "topic",
  entityId: string,
  userId: string,
  changes?: Record<string, unknown>
): Promise<void> {
  try {
    const { content: logs, sha } = await getFileFromGitHub("audit-logs.json")
    const newLog: AuditLog = {
      id: String(Date.now()),
      action,
      entity,
      entityId,
      userId,
      timestamp: new Date().toISOString(),
      changes,
    }
    logs.push(newLog)

    await updateFileInGitHub(
      "audit-logs.json",
      logs,
      `Audit log: ${action} ${entity}`,
      sha
    )
  } catch (error) {
    console.error("Failed to log audit:", error)
  }
}

export async function getAnalytics(): Promise<Analytics> {
  const { content } = await getFileFromGitHub("analytics.json")
  return content
}

async function updateAnalytics(): Promise<void> {
  try {
    const questions = await getQuestions()
    const topics = await getTopics()

    const totalViews = questions.reduce((sum, q) => sum + (q.viewCount || 0), 0)
    const totalBookmarks = questions.reduce(
      (sum, q) => sum + (q.bookmarkCount || 0),
      0
    )

    const { content: analytics, sha } = await getFileFromGitHub(
      "analytics.json"
    )
    analytics.totalQuestions = questions.length
    analytics.totalTopics = topics.length
    analytics.totalViews = totalViews
    analytics.totalBookmarks = totalBookmarks

    await updateFileInGitHub(
      "analytics.json",
      analytics,
      "Update analytics",
      sha
    )
  } catch (error) {
    console.error("Failed to update analytics:", error)
  }
}

export async function incrementViewCount(id: string): Promise<void> {
  const { content: questions, sha } = await getFileFromGitHub("questions.json")
  const question = questions.find((q: Question) => q.id === id)

  if (question) {
    question.viewCount = (question.viewCount || 0) + 1
    question.updatedAt = new Date().toISOString()

    await updateFileInGitHub(
      "questions.json",
      questions,
      `Increment view count for question: ${id}`,
      sha
    )

    await updateAnalytics()
  }
}

export async function searchQuestions(query: string): Promise<Question[]> {
  const questions = await getQuestions()
  const lowercaseQuery = query.toLowerCase()
  return questions.filter(
    (q) =>
      q.title.toLowerCase().includes(lowercaseQuery) ||
      q.answer.toLowerCase().includes(lowercaseQuery) ||
      q.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
      q.excerpt?.toLowerCase().includes(lowercaseQuery)
  )
}

export async function searchTopics(query: string): Promise<Topic[]> {
  const topics = await getTopics()
  const lowercaseQuery = query.toLowerCase()
  return topics.filter(
    (t) =>
      t.name.toLowerCase().includes(lowercaseQuery) ||
      t.slug.toLowerCase().includes(lowercaseQuery) ||
      t.description?.toLowerCase().includes(lowercaseQuery)
  )
}

export async function getQuestionsByTopicId(
  topicId: string
): Promise<Question[]> {
  const questions = await getQuestions()
  return questions.filter((q) => q.topicIds?.includes(topicId))
}

export async function updateTopicQuestionCounts(): Promise<void> {
  try {
    const questions = await getQuestions()
    const { content: topics, sha } = await getFileFromGitHub("topics.json")

    for (const topic of topics) {
      const count = questions.filter((q) =>
        q.topicIds?.includes(topic.id)
      ).length
      topic.questionCount = count
      topic.updatedAt = new Date().toISOString()
    }

    await updateFileInGitHub(
      "topics.json",
      topics,
      "Update topic question counts",
      sha
    )
  } catch (error) {
    console.error("Failed to update topic question counts:", error)
  }
}
