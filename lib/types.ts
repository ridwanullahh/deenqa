import { z } from "zod"

// Question status enum follows the Lightbase collection schema:
// draft / published / archived.
export const QuestionStatusEnum = z.enum(["draft", "published", "archived"])
export type QuestionStatus = z.infer<typeof QuestionStatusEnum>

export const QuestionSchema = z.object({
  id: z.string().min(1, "Question ID is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title must be less than 500 characters"),
  content: z.string().optional(),
  answer: z.string().min(1, "Answer is required"),
  topicIds: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  excerpt: z.string().optional(),
  source: z.string().optional(),
  scholar: z.string().optional(),
  category: z.string().optional(),
  status: QuestionStatusEnum.optional().default("published"),
  viewCount: z.number().int().nonnegative().optional().default(0),
  bookmarkCount: z.number().int().nonnegative().optional().default(0),
  imageUrl: z.string().optional(),
  createdBy: z.string().optional(),
  createdAt: z.coerce.date().optional().default(() => new Date()),
  updatedAt: z.coerce.date().optional().default(() => new Date()),
})

export const QuestionCreateSchema = QuestionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const QuestionUpdateSchema = QuestionSchema.partial()
  .required({ id: true })

export type Question = z.infer<typeof QuestionSchema>
export type QuestionCreate = z.infer<typeof QuestionCreateSchema>
export type QuestionUpdate = z.infer<typeof QuestionUpdateSchema>

export const TopicSchema = z.object({
  id: z.string().min(1, "Topic ID is required"),
  name: z
    .string()
    .min(1, "Topic name is required")
    .max(100, "Topic name must be less than 100 characters"),
  description: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  questionCount: z.number().int().nonnegative().optional().default(0),
  color: z.string().optional(),
  createdAt: z.coerce.date().optional().default(() => new Date()),
  updatedAt: z.coerce.date().optional().default(() => new Date()),
})

export const TopicCreateSchema = TopicSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const TopicUpdateSchema = TopicSchema.partial().required({ id: true })

export type Topic = z.infer<typeof TopicSchema>
export type TopicCreate = z.infer<typeof TopicCreateSchema>
export type TopicUpdate = z.infer<typeof TopicUpdateSchema>

export const UserRoleEnum = z.enum(["user", "admin", "moderator"])
export type UserRole = z.infer<typeof UserRoleEnum>

export const UserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  email: z.string().email("Invalid email address"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be less than 200 characters"),
  role: UserRoleEnum.default("user"),
  avatarUrl: z.string().optional(),
  bio: z
    .string()
    .max(1000, "Bio must be less than 1000 characters")
    .optional(),
  isActive: z.boolean().default(true),
  emailVerified: z.boolean().default(false),
  createdAt: z.coerce.date().optional().default(() => new Date()),
  updatedAt: z.coerce.date().optional().default(() => new Date()),
  lastLoginAt: z.coerce.date().optional(),
})

export const UserCreateSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
})

export const UserUpdateSchema = UserSchema.partial().required({ id: true })

export type User = z.infer<typeof UserSchema>
export type UserCreate = z.infer<typeof UserCreateSchema>
export type UserUpdate = z.infer<typeof UserUpdateSchema>

// ---------------------------------------------------------------------------
// Audit log (used by admin mutations)
// ---------------------------------------------------------------------------

export const AuditLogSchema = z.object({
  id: z.string().min(1),
  action: z.string().min(1),
  entity: z.enum(["question", "topic", "user", "auth"]).default("question"),
  entityId: z.string().default(""),
  userId: z.string().default(""),
  timestamp: z.coerce.date().optional().default(() => new Date()),
  data: z.record(z.string(), z.unknown()).optional().default({}),
})

export type AuditLog = z.infer<typeof AuditLogSchema>

// ---------------------------------------------------------------------------
// Analytics aggregate (computed from questions / topics collections)
// ---------------------------------------------------------------------------

export interface Analytics {
  totalQuestions: number
  totalTopics: number
  totalViews: number
  totalBookmarks: number
  dailyStats: Array<{ date: string; views: number; searches: number }>
}

// ---------------------------------------------------------------------------
// Glossary (Islamic terms)
// ---------------------------------------------------------------------------

export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  category: string
  transliteration?: string
  arabic?: string
}
