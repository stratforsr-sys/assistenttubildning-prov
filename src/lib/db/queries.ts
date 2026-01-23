// ===========================================
// TELINK EXAM PLATFORM - DATABASE QUERIES
// ===========================================

import { db } from './index'
import { 
  examCodes, 
  participants, 
  attempts, 
  answers, 
  adminSessions,
  type NewExamCode,
  type NewParticipant,
  type NewAttempt,
  type NewAnswer,
  type NewAdminSession,
} from './schema'
import { eq, and, desc, sql, gte, lte, count, avg } from 'drizzle-orm'
import { QUESTIONS } from '../questions'

// ===========================================
// EXAM CODES QUERIES
// ===========================================

export async function getExamCodeByCode(code: string) {
  const result = await db
    .select()
    .from(examCodes)
    .where(
      and(
        eq(examCodes.code, code.toUpperCase()),
        eq(examCodes.isActive, true)
      )
    )
    .limit(1)
  
  return result[0] || null
}

export async function getAllExamCodes() {
  return db
    .select()
    .from(examCodes)
    .orderBy(desc(examCodes.createdAt))
}

export async function createExamCode(data: NewExamCode) {
  const result = await db
    .insert(examCodes)
    .values({
      ...data,
      code: data.code.toUpperCase(),
    })
    .returning()
  
  return result[0]
}

export async function updateExamCodeStatus(id: string, isActive: boolean) {
  const result = await db
    .update(examCodes)
    .set({ isActive })
    .where(eq(examCodes.id, id))
    .returning()
  
  return result[0]
}

// ===========================================
// PARTICIPANTS QUERIES
// ===========================================

function normalizeFullName(firstName: string, lastName: string): string {
  return `${firstName.toLowerCase().trim()} ${lastName.toLowerCase().trim()}`
}

export async function findParticipantByName(firstName: string, lastName: string) {
  const normalized = normalizeFullName(firstName, lastName)
  
  const result = await db
    .select()
    .from(participants)
    .where(eq(participants.fullNameNormalized, normalized))
    .limit(1)
  
  return result[0] || null
}

export async function createParticipant(data: Omit<NewParticipant, 'fullNameNormalized'>) {
  const result = await db
    .insert(participants)
    .values({
      ...data,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      fullNameNormalized: normalizeFullName(data.firstName, data.lastName),
    })
    .returning()
  
  return result[0]
}

export async function checkDuplicateAttempt(
  firstName: string, 
  lastName: string, 
  examCodeId: string
): Promise<boolean> {
  const normalized = normalizeFullName(firstName, lastName)
  
  const result = await db
    .select({ count: count() })
    .from(attempts)
    .innerJoin(participants, eq(attempts.participantId, participants.id))
    .where(
      and(
        eq(participants.fullNameNormalized, normalized),
        eq(attempts.examCodeId, examCodeId)
      )
    )
  
  return (result[0]?.count || 0) > 0
}

// ===========================================
// ATTEMPTS QUERIES
// ===========================================

export async function createAttempt(data: NewAttempt) {
  const result = await db
    .insert(attempts)
    .values(data)
    .returning()
  
  return result[0]
}

export async function getAttemptById(id: string) {
  const result = await db
    .select()
    .from(attempts)
    .where(eq(attempts.id, id))
    .limit(1)
  
  return result[0] || null
}

export async function getAttemptWithParticipant(id: string) {
  const result = await db
    .select({
      attempt: attempts,
      participant: participants,
    })
    .from(attempts)
    .innerJoin(participants, eq(attempts.participantId, participants.id))
    .where(eq(attempts.id, id))
    .limit(1)
  
  return result[0] || null
}

export async function completeAttempt(
  id: string, 
  totalCorrect: number, 
  totalTimeSeconds: number,
  isTimedOut: boolean = false
) {
  const totalQuestions = QUESTIONS.length
  const totalScore = Math.round((totalCorrect / totalQuestions) * 100)
  
  const result = await db
    .update(attempts)
    .set({
      isCompleted: true,
      isTimedOut,
      completedAt: new Date(),
      totalCorrect,
      totalScore,
      totalTimeSeconds,
    })
    .where(eq(attempts.id, id))
    .returning()
  
  return result[0]
}

export async function getAllAttempts() {
  return db
    .select({
      id: attempts.id,
      participantName: sql<string>`${participants.firstName} || ' ' || ${participants.lastName}`,
      date: attempts.completedAt,
      score: attempts.totalScore,
      totalCorrect: attempts.totalCorrect,
      totalQuestions: attempts.totalQuestions,
      timeSeconds: attempts.totalTimeSeconds,
      isTimedOut: attempts.isTimedOut,
    })
    .from(attempts)
    .innerJoin(participants, eq(attempts.participantId, participants.id))
    .where(eq(attempts.isCompleted, true))
    .orderBy(desc(attempts.completedAt))
}

export async function deleteAttempt(id: string) {
  // Answers will be cascade deleted due to foreign key constraint
  await db
    .delete(attempts)
    .where(eq(attempts.id, id))
}

// ===========================================
// ANSWERS QUERIES
// ===========================================

export async function saveAnswer(data: NewAnswer & { writtenAnswer?: string | null }) {
  // Upsert - update if exists, insert if not
  const existing = await db
    .select()
    .from(answers)
    .where(
      and(
        eq(answers.attemptId, data.attemptId),
        eq(answers.questionId, data.questionId)
      )
    )
    .limit(1)

  if (existing[0]) {
    const result = await db
      .update(answers)
      .set({
        selectedOption: data.selectedOption,
        writtenAnswer: data.writtenAnswer,
        isCorrect: data.isCorrect,
        timeSpentSeconds: data.timeSpentSeconds,
        answeredAt: new Date(),
      })
      .where(eq(answers.id, existing[0].id))
      .returning()

    return result[0]
  } else {
    const result = await db
      .insert(answers)
      .values({
        attemptId: data.attemptId,
        questionId: data.questionId,
        selectedOption: data.selectedOption,
        writtenAnswer: data.writtenAnswer,
        isCorrect: data.isCorrect,
        timeSpentSeconds: data.timeSpentSeconds,
      })
      .returning()

    return result[0]
  }
}

export async function getAnswersByAttemptId(attemptId: string) {
  return db
    .select()
    .from(answers)
    .where(eq(answers.attemptId, attemptId))
    .orderBy(answers.questionId)
}

export async function countCorrectAnswers(attemptId: string): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(answers)
    .where(
      and(
        eq(answers.attemptId, attemptId),
        eq(answers.isCorrect, true)
      )
    )
  
  return result[0]?.count || 0
}

// ===========================================
// ADMIN SESSION QUERIES
// ===========================================

export async function createAdminSession(data: NewAdminSession) {
  const result = await db
    .insert(adminSessions)
    .values(data)
    .returning()
  
  return result[0]
}

export async function getAdminSessionByToken(token: string) {
  const result = await db
    .select()
    .from(adminSessions)
    .where(
      and(
        eq(adminSessions.token, token),
        gte(adminSessions.expiresAt, new Date())
      )
    )
    .limit(1)
  
  return result[0] || null
}

export async function deleteAdminSession(token: string) {
  await db
    .delete(adminSessions)
    .where(eq(adminSessions.token, token))
}

export async function cleanupExpiredSessions() {
  await db
    .delete(adminSessions)
    .where(lte(adminSessions.expiresAt, new Date()))
}

// ===========================================
// STATISTICS QUERIES
// ===========================================

export async function getExamStats() {
  const allAttempts = await db
    .select({
      totalScore: attempts.totalScore,
      totalTimeSeconds: attempts.totalTimeSeconds,
    })
    .from(attempts)
    .where(eq(attempts.isCompleted, true))
  
  if (allAttempts.length === 0) {
    return {
      totalParticipants: 0,
      averageScore: 0,
      medianScore: 0,
      minScore: 0,
      maxScore: 0,
      averageTime: 0,
      completionRate: 100,
    }
  }
  
  const scores = allAttempts.map(a => a.totalScore || 0).sort((a, b) => a - b)
  const times = allAttempts.map(a => a.totalTimeSeconds || 0)
  
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
  const median = (arr: number[]) => {
    const mid = Math.floor(arr.length / 2)
    return arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2
  }
  
  return {
    totalParticipants: allAttempts.length,
    averageScore: Math.round(sum(scores) / scores.length),
    medianScore: Math.round(median(scores)),
    minScore: Math.min(...scores),
    maxScore: Math.max(...scores),
    averageTime: Math.round(sum(times) / times.length),
    completionRate: 100, // All returned attempts are completed
  }
}

export async function getQuestionStats() {
  const allAnswers = await db
    .select({
      questionId: answers.questionId,
      selectedOption: answers.selectedOption,
      isCorrect: answers.isCorrect,
    })
    .from(answers)
    .innerJoin(attempts, eq(answers.attemptId, attempts.id))
    .where(eq(attempts.isCompleted, true))

  // Group by question
  const questionMap = new Map<number, {
    total: number
    correct: number
    options: Map<string, number>
  }>()

  for (const answer of allAnswers) {
    if (!questionMap.has(answer.questionId)) {
      questionMap.set(answer.questionId, {
        total: 0,
        correct: 0,
        options: new Map([['A', 0], ['B', 0], ['C', 0], ['D', 0], ['true', 0], ['false', 0], ['written', 0], ['none', 0]]),
      })
    }

    const stats = questionMap.get(answer.questionId)!
    stats.total++
    if (answer.isCorrect) stats.correct++

    const opt = answer.selectedOption || 'none'
    stats.options.set(opt, (stats.options.get(opt) || 0) + 1)
  }

  // Convert to array with question details
  const result = QUESTIONS.map(question => {
    const stats = questionMap.get(question.id) || {
      total: 0,
      correct: 0,
      options: new Map([['A', 0], ['B', 0], ['C', 0], ['D', 0], ['true', 0], ['false', 0], ['written', 0], ['none', 0]]),
    }

    const correctPercentage = stats.total > 0
      ? Math.round((stats.correct / stats.total) * 100)
      : 0

    // Different option distribution based on question type
    let optionDistribution
    if (question.type === 'multiple-choice') {
      optionDistribution = ['A', 'B', 'C', 'D'].map(opt => ({
        option: opt,
        count: stats.options.get(opt) || 0,
        percentage: stats.total > 0
          ? Math.round(((stats.options.get(opt) || 0) / stats.total) * 100)
          : 0,
      }))
    } else if (question.type === 'true-false') {
      optionDistribution = ['true', 'false'].map(opt => ({
        option: opt === 'true' ? 'Sant' : 'Falskt',
        count: stats.options.get(opt) || 0,
        percentage: stats.total > 0
          ? Math.round(((stats.options.get(opt) || 0) / stats.total) * 100)
          : 0,
      }))
    } else {
      // Written questions - just show correct/incorrect
      optionDistribution = [
        {
          option: 'Rätt',
          count: stats.correct,
          percentage: stats.total > 0
            ? Math.round((stats.correct / stats.total) * 100)
            : 0,
        },
        {
          option: 'Fel',
          count: stats.total - stats.correct,
          percentage: stats.total > 0
            ? Math.round(((stats.total - stats.correct) / stats.total) * 100)
            : 0,
        },
      ]
    }

    // Find most common wrong answer (only for multiple choice)
    let mostCommonWrongAnswer: string | null = null
    if (question.type === 'multiple-choice') {
      let maxWrongCount = 0
      for (const [opt, optCount] of stats.options.entries()) {
        if (opt !== question.correctAnswer && opt !== 'none' && ['A', 'B', 'C', 'D'].includes(opt) && optCount > maxWrongCount) {
          maxWrongCount = optCount
          mostCommonWrongAnswer = opt
        }
      }
    }

    return {
      questionId: question.id,
      questionText: question.text,
      questionType: question.type,
      correctPercentage,
      optionDistribution,
      difficulty: correctPercentage > 90 ? 'easy' : correctPercentage < 30 ? 'hard' : 'medium',
      mostCommonWrongAnswer,
    }
  })

  return result
}

export async function getScoreDistribution() {
  const allAttempts = await db
    .select({ totalCorrect: attempts.totalCorrect })
    .from(attempts)
    .where(eq(attempts.isCompleted, true))

  // Updated ranges for 30 questions
  const ranges = [
    { min: 0, max: 6, label: '0-6' },
    { min: 7, max: 12, label: '7-12' },
    { min: 13, max: 18, label: '13-18' },
    { min: 19, max: 24, label: '19-24' },
    { min: 25, max: 27, label: '25-27' },
    { min: 28, max: 30, label: '28-30' },
  ]

  return ranges.map(range => ({
    range: range.label,
    count: allAttempts.filter(a =>
      (a.totalCorrect || 0) >= range.min && (a.totalCorrect || 0) <= range.max
    ).length,
  }))
}

export async function getTimeVsScoreData() {
  return db
    .select({
      time: attempts.totalTimeSeconds,
      score: attempts.totalCorrect,
      name: sql<string>`${participants.firstName} || ' ' || LEFT(${participants.lastName}, 1) || '.'`,
    })
    .from(attempts)
    .innerJoin(participants, eq(attempts.participantId, participants.id))
    .where(eq(attempts.isCompleted, true))
}

export async function getTrendData() {
  const result = await db
    .select({
      date: sql<string>`DATE(${attempts.completedAt})`,
      averageScore: sql<number>`AVG(${attempts.totalCorrect})`,
      count: count(),
    })
    .from(attempts)
    .where(eq(attempts.isCompleted, true))
    .groupBy(sql`DATE(${attempts.completedAt})`)
    .orderBy(sql`DATE(${attempts.completedAt})`)
  
  return result.map(r => ({
    date: r.date,
    averageScore: Math.round(Number(r.averageScore)),
    count: r.count,
  }))
}
