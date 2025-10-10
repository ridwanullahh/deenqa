import { getQuestions, getTopics, getQuestion, getTopicBySlug } from "./github-db"

export async function getFeaturedQuestions() {
  return getQuestions()
}

export async function getTopicsData() {
  return getTopics()
}

export async function getQuestionById(id: string) {
  return getQuestion(id)
}

export async function getTopicBySlugData(slug: string) {
  return getTopicBySlug(slug)
}
