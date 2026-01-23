import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { answers, attempts } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { successResponse, errorResponse } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  attemptId: z.string().uuid(),
  questionId: z.number().int().positive(),
  isCorrect: z.boolean(),
})

export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    await requireAdmin()
  } catch {
    return errorResponse('Ej auktoriserad', 401)
  }

  try {
    const body = await request.json()
    const { attemptId, questionId, isCorrect } = schema.parse(body)

    // Update the answer's isCorrect status
    const result = await db
      .update(answers)
      .set({ isCorrect })
      .where(
        and(
          eq(answers.attemptId, attemptId),
          eq(answers.questionId, questionId)
        )
      )
      .returning()

    if (result.length === 0) {
      return errorResponse('Svaret hittades inte', 404)
    }

    // Recalculate total correct for the attempt
    const allAnswers = await db
      .select({ isCorrect: answers.isCorrect })
      .from(answers)
      .where(eq(answers.attemptId, attemptId))

    const totalCorrect = allAnswers.filter(a => a.isCorrect === true).length
    const totalQuestions = allAnswers.length

    // Update attempt with new totals
    await db
      .update(attempts)
      .set({
        totalCorrect,
        totalScore: Math.round((totalCorrect / totalQuestions) * 100),
      })
      .where(eq(attempts.id, attemptId))

    return successResponse({
      answerId: result[0].id,
      isCorrect: result[0].isCorrect,
      totalCorrect,
      totalScore: Math.round((totalCorrect / totalQuestions) * 100),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse('Ogiltig förfrågan', 400)
    }
    console.error('Grade answer error:', error)
    return errorResponse('Ett fel uppstod', 500)
  }
}
