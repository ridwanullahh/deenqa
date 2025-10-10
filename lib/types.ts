import { z } from "zod"

export const QuestionSchema = z.object({
  id: z.string().min(1, "Question ID is required"),
  title: z.string().min(1, "Title is required").max(500, "Title must be less than 500 characters"),
  content: z.string().optional(),
  answer: z.string().min(1, "Answer is required"),
  topicIds: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  excerpt: z.string().optional(),
  source: z.string().optional(),
  scholar: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional().default("published"),
  createdAt: z.date().optional().default(() => new Date()),
  updatedAt: z.date().optional().default(() => new Date()),
})

export const QuestionCreateSchema = QuestionSchema.omit({ id: true, createdAt: true, updatedAt: true })

export const QuestionUpdateSchema = QuestionSchema.partial().required({ id: true })

export type Question = z.infer<typeof QuestionSchema>
export type QuestionCreate = z.infer<typeof QuestionCreateSchema>
export type QuestionUpdate = z.infer<typeof QuestionUpdateSchema>

export const TopicSchema = z.object({
  id: z.string().min(1, "Topic ID is required"),
  name: z.string().min(1, "Topic name is required").max(100, "Topic name must be less than 100 characters"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  questionCount: z.number().int().nonnegative().optional().default(0),
  color: z.string().optional(),
  createdAt: z.date().optional().default(() => new Date()),
  updatedAt: z.date().optional().default(() => new Date()),
})

export const TopicCreateSchema = TopicSchema.omit({ id: true, createdAt: true, updatedAt: true })

export const TopicUpdateSchema = TopicSchema.partial().required({ id: true })

export type Topic = z.infer<typeof TopicSchema>
export type TopicCreate = z.infer<typeof TopicCreateSchema>
export type TopicUpdate = z.infer<typeof TopicUpdateSchema>

export const UserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").max(200, "Name must be less than 200 characters"),
  role: z.enum(["admin", "moderator", "user"]).default("user"),
  avatarUrl: z.string().url("Invalid avatar URL").optional(),
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
  isActive: z.boolean().default(true),
  emailVerified: z.boolean().default(false),
  createdAt: z.date().optional().default(() => new Date()),
  updatedAt: z.date().optional().default(() => new Date()),
  lastLoginAt: z.date().optional(),
})

export const UserCreateSchema = UserSchema.omit({ id: true, createdAt: true, updatedAt: true, lastLoginAt: true })

export const UserUpdateSchema = UserSchema.partial().required({ id: true })

export type User = z.infer<typeof UserSchema>
export type UserCreate = z.infer<typeof UserCreateSchema>
export type UserUpdate = z.infer<typeof UserUpdateSchema>
