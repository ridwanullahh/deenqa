import {
  Question,
  QuestionCreate,
  QuestionUpdate,
  QuestionSchema,
  QuestionCreateSchema,
  QuestionUpdateSchema,
  Topic,
  TopicCreate,
  TopicUpdate,
  TopicSchema,
  TopicCreateSchema,
  TopicUpdateSchema,
  User,
  UserCreate,
  UserUpdate,
  UserSchema,
  UserCreateSchema,
  UserUpdateSchema,
} from "@/lib/types"

class InMemoryDatabase {
  private questions: Map<string, Question> = new Map()
  private topics: Map<string, Topic> = new Map()
  private users: Map<string, User> = new Map()

  constructor() {
    this.seedInitialData()
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  private seedInitialData(): void {
    const prayerTopic = this.createTopic({
      name: "Prayer",
      slug: "prayer",
      description: "Questions about Salah and prayer practices",
    })

    const fastingTopic = this.createTopic({
      name: "Fasting",
      slug: "fasting",
      description: "Questions about fasting and Ramadan",
    })

    this.createQuestion({
      title: "What are the 5 daily prayers?",
      answer: "The five daily prayers (Salah) are: Fajr (dawn), Dhuhr (midday), Asr (afternoon), Maghrib (sunset), and Isha (night). These prayers are obligatory for all adult Muslims and form one of the Five Pillars of Islam.",
      excerpt: "Learn about the five obligatory daily prayers in Islam",
      topicIds: [prayerTopic.id],
      tags: ["prayer", "salah", "basics"],
      status: "published",
    })

    this.createQuestion({
      title: "Can I combine prayers while traveling?",
      answer: "Yes, it is permissible to combine Dhuhr with Asr, and Maghrib with Isha during travel. This is based on authentic hadiths where the Prophet Muhammad (peace be upon him) combined prayers during his journeys. The combining of prayers is a mercy and facilitation for travelers.",
      excerpt: "Understanding the ruling on combining prayers during travel",
      topicIds: [prayerTopic.id],
      tags: ["prayer", "travel", "combining"],
      status: "published",
    })

    this.createQuestion({
      title: "When does Ramadan fasting begin and end?",
      answer: "The daily fast during Ramadan begins at Fajr (dawn) when the first light appears in the sky, and ends at Maghrib (sunset) when the sun completely sets. Muslims abstain from food, drink, and other specific activities during these hours.",
      excerpt: "Timing of daily fasting during Ramadan",
      topicIds: [fastingTopic.id],
      tags: ["fasting", "ramadan", "timing"],
      status: "published",
    })
  }

  createQuestion(data: QuestionCreate): Question {
    const validatedData = QuestionCreateSchema.parse(data)
    const id = this.generateId()
    const now = new Date()

    const question: Question = {
      ...validatedData,
      id,
      topicIds: validatedData.topicIds ?? [],
      tags: validatedData.tags ?? [],
      status: validatedData.status ?? "published",
      createdAt: now,
      updatedAt: now,
    }

    QuestionSchema.parse(question)
    this.questions.set(id, question)
    this.updateTopicQuestionCounts(question.topicIds)

    return question
  }

  getQuestion(id: string): Question | null {
    const question = this.questions.get(id)
    return question ?? null
  }

  getAllQuestions(): Question[] {
    return Array.from(this.questions.values())
  }

  getQuestionsByTopicId(topicId: string): Question[] {
    return this.getAllQuestions().filter((q) => q.topicIds?.includes(topicId))
  }

  getQuestionsByTags(tags: string[]): Question[] {
    return this.getAllQuestions().filter((q) =>
      tags.some((tag) => q.tags?.includes(tag))
    )
  }

  updateQuestion(data: QuestionUpdate): Question | null {
    const validatedData = QuestionUpdateSchema.parse(data)
    const existingQuestion = this.questions.get(validatedData.id)

    if (!existingQuestion) {
      return null
    }

    const oldTopicIds = existingQuestion.topicIds ?? []

    const updatedQuestion: Question = {
      ...existingQuestion,
      ...validatedData,
      updatedAt: new Date(),
    }

    QuestionSchema.parse(updatedQuestion)
    this.questions.set(updatedQuestion.id, updatedQuestion)

    const newTopicIds = updatedQuestion.topicIds ?? []
    if (JSON.stringify(oldTopicIds) !== JSON.stringify(newTopicIds)) {
      this.updateTopicQuestionCounts([...oldTopicIds, ...newTopicIds])
    }

    return updatedQuestion
  }

  deleteQuestion(id: string): boolean {
    const question = this.questions.get(id)
    if (!question) {
      return false
    }

    this.questions.delete(id)
    this.updateTopicQuestionCounts(question.topicIds ?? [])
    return true
  }

  createTopic(data: TopicCreate): Topic {
    const validatedData = TopicCreateSchema.parse(data)
    const id = this.generateId()
    const now = new Date()

    const topic: Topic = {
      ...validatedData,
      id,
      questionCount: validatedData.questionCount ?? 0,
      createdAt: now,
      updatedAt: now,
    }

    TopicSchema.parse(topic)
    this.topics.set(id, topic)

    return topic
  }

  getTopic(id: string): Topic | null {
    const topic = this.topics.get(id)
    return topic ?? null
  }

  getTopicBySlug(slug: string): Topic | null {
    return Array.from(this.topics.values()).find((t) => t.slug === slug) ?? null
  }

  getAllTopics(): Topic[] {
    return Array.from(this.topics.values())
  }

  updateTopic(data: TopicUpdate): Topic | null {
    const validatedData = TopicUpdateSchema.parse(data)
    const existingTopic = this.topics.get(validatedData.id)

    if (!existingTopic) {
      return null
    }

    const updatedTopic: Topic = {
      ...existingTopic,
      ...validatedData,
      updatedAt: new Date(),
    }

    TopicSchema.parse(updatedTopic)
    this.topics.set(updatedTopic.id, updatedTopic)

    return updatedTopic
  }

  deleteTopic(id: string): boolean {
    const topic = this.topics.get(id)
    if (!topic) {
      return false
    }

    this.topics.delete(id)
    return true
  }

  private updateTopicQuestionCounts(topicIds: string[]): void {
    const uniqueTopicIds = [...new Set(topicIds)]

    for (const topicId of uniqueTopicIds) {
      const topic = this.topics.get(topicId)
      if (topic) {
        const count = this.getQuestionsByTopicId(topicId).length
        topic.questionCount = count
        topic.updatedAt = new Date()
      }
    }
  }

  createUser(data: UserCreate): User {
    const validatedData = UserCreateSchema.parse(data)
    const id = this.generateId()
    const now = new Date()

    const user: User = {
      ...validatedData,
      id,
      role: validatedData.role ?? "user",
      isActive: validatedData.isActive ?? true,
      emailVerified: validatedData.emailVerified ?? false,
      createdAt: now,
      updatedAt: now,
    }

    UserSchema.parse(user)
    this.users.set(id, user)

    return user
  }

  getUser(id: string): User | null {
    const user = this.users.get(id)
    return user ?? null
  }

  getUserByEmail(email: string): User | null {
    return Array.from(this.users.values()).find((u) => u.email === email) ?? null
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  updateUser(data: UserUpdate): User | null {
    const validatedData = UserUpdateSchema.parse(data)
    const existingUser = this.users.get(validatedData.id)

    if (!existingUser) {
      return null
    }

    const updatedUser: User = {
      ...existingUser,
      ...validatedData,
      updatedAt: new Date(),
    }

    UserSchema.parse(updatedUser)
    this.users.set(updatedUser.id, updatedUser)

    return updatedUser
  }

  deleteUser(id: string): boolean {
    const user = this.users.get(id)
    if (!user) {
      return false
    }

    this.users.delete(id)
    return true
  }

  updateUserLastLogin(id: string): User | null {
    const user = this.users.get(id)
    if (!user) {
      return null
    }

    const updatedUser: User = {
      ...user,
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    }

    this.users.set(id, updatedUser)
    return updatedUser
  }

  searchQuestions(query: string): Question[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllQuestions().filter(
      (q) =>
        q.title.toLowerCase().includes(lowerQuery) ||
        q.answer.toLowerCase().includes(lowerQuery) ||
        q.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        q.excerpt?.toLowerCase().includes(lowerQuery)
    )
  }

  searchTopics(query: string): Topic[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllTopics().filter(
      (t) =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.slug.toLowerCase().includes(lowerQuery) ||
        t.description?.toLowerCase().includes(lowerQuery)
    )
  }

  searchUsers(query: string): User[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllUsers().filter(
      (u) =>
        u.name.toLowerCase().includes(lowerQuery) ||
        u.email.toLowerCase().includes(lowerQuery) ||
        u.bio?.toLowerCase().includes(lowerQuery)
    )
  }
}

export const db = new InMemoryDatabase()

export default InMemoryDatabase
