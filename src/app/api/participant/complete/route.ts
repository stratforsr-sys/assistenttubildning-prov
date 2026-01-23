import { NextRequest } from 'next/server'
import {
  getAttemptById,
  countCorrectAnswers,
  completeAttempt,
  getAnswersByAttemptId
} from '@/lib/db/queries'
import { getQuestionById } from '@/lib/questions'
import { successResponse, errorResponse } from '@/lib/utils'
import { z } from 'zod'
import type { QuestionType } from '@/types'

const schema = z.object({
  attemptId: z.string().uuid(),
  isTimedOut: z.boolean().optional().default(false),
  totalTimeSeconds: z.number().int().nonnegative(),
})

interface QuestionOrderItem {
  id: number
  type: QuestionType
  originalOrder?: string[] // Only for multiple-choice
  shuffledCorrectIndex?: number // Only for multiple-choice
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { attemptId, isTimedOut, totalTimeSeconds } = schema.parse(body)

    // Get attempt
    const attempt = await getAttemptById(attemptId)
    if (!attempt) {
      return errorResponse('Ogiltigt försök', 400)
    }

    if (attempt.isCompleted) {
      return errorResponse('Provet är redan avslutat', 400)
    }

    // Count correct answers
    const totalCorrect = await countCorrectAnswers(attemptId)

    // Complete the attempt
    const completedAttempt = await completeAttempt(
      attemptId,
      totalCorrect,
      totalTimeSeconds,
      isTimedOut
    )

    // Get all answers for review
    const answers = await getAnswersByAttemptId(attemptId)
    const questionOrder: QuestionOrderItem[] = JSON.parse(attempt.questionOrder || '[]')

    // Build result data
    const answerResults = questionOrder.map((qData) => {
      const question = getQuestionById(qData.id)
      const answer = answers.find(a => a.questionId === qData.id)

      if (!question) return null

      // Handle different question types
      if (question.type === 'multiple-choice') {
        // Build shuffled options for multiple choice
        const originalOrder = qData.originalOrder || ['A', 'B', 'C', 'D']
        const shuffledOptions = originalOrder.map((origKey: string, idx: number) => {
          const origOption = question.options.find(o => o.key === origKey)
          return {
            key: ['A', 'B', 'C', 'D'][idx],
            text: origOption?.text || '',
          }
        })

        // The correct answer in shuffled order
        const correctOption = ['A', 'B', 'C', 'D'][qData.shuffledCorrectIndex ?? 0]

        return {
          questionId: question.id,
          questionText: question.text,
          questionType: 'multiple-choice' as const,
          options: shuffledOptions,
          selectedOption: answer?.selectedOption || null,
          correctOption,
          isCorrect: answer?.isCorrect || false,
          timeSpent: answer?.timeSpentSeconds || 0,
        }
      } else if (question.type === 'true-false') {
        return {
          questionId: question.id,
          questionText: question.text,
          questionType: 'true-false' as const,
          selectedOption: answer?.selectedOption || null,
          correctOption: question.correctAnswer,
          writtenAnswer: answer?.writtenAnswer || null,
          explanation: question.explanation,
          isCorrect: answer?.isCorrect || false,
          timeSpent: answer?.timeSpentSeconds || 0,
        }
      } else {
        // Written question
        return {
          questionId: question.id,
          questionText: question.text,
          questionType: 'written' as const,
          writtenAnswer: answer?.writtenAnswer || null,
          acceptedKeywords: question.acceptedKeywords,
          exampleAnswer: question.exampleAnswer,
          isCorrect: answer?.isCorrect || false,
          timeSpent: answer?.timeSpentSeconds || 0,
        }
      }
    }).filter(Boolean)

    return successResponse({
      attemptId: completedAttempt.id,
      totalScore: completedAttempt.totalScore,
      totalCorrect: completedAttempt.totalCorrect,
      totalQuestions: completedAttempt.totalQuestions,
      totalTimeSeconds: completedAttempt.totalTimeSeconds,
      percentage: Math.round((completedAttempt.totalCorrect! / completedAttempt.totalQuestions) * 100),
      answers: answerResults,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse('Ogiltig förfrågan', 400)
    }
    console.error('Complete exam error:', error)
    return errorResponse('Ett fel uppstod', 500)
  }
}
