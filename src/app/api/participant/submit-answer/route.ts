import { NextRequest } from 'next/server'
import { getAttemptById, saveAnswer } from '@/lib/db/queries'
import { successResponse, errorResponse } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  attemptId: z.string().uuid(),
  questionId: z.number().int().positive(),
  selectedOption: z.enum(['A', 'B', 'C', 'D']),
  timeSpent: z.number().int().nonnegative(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { attemptId, questionId, selectedOption, timeSpent } = schema.parse(body)
    
    // Get attempt to validate and get question order
    const attempt = await getAttemptById(attemptId)
    if (!attempt) {
      return errorResponse('Ogiltigt försök', 400)
    }
    
    if (attempt.isCompleted) {
      return errorResponse('Provet är redan avslutat', 400)
    }
    
    // Get question order to determine correct answer
    const questionOrder = JSON.parse(attempt.questionOrder || '[]')
    const questionData = questionOrder.find((q: { id: number }) => q.id === questionId)
    
    if (!questionData) {
      return errorResponse('Ogiltig fråga', 400)
    }
    
    // Determine if answer is correct
    // The shuffledCorrectIndex tells us which position (0-3 = A-D) the correct answer is in
    const correctOptionIndex = questionData.shuffledCorrectIndex
    const correctOption = ['A', 'B', 'C', 'D'][correctOptionIndex]
    const isCorrect = selectedOption === correctOption
    
    // Save the answer
    await saveAnswer({
      attemptId,
      questionId,
      selectedOption,
      isCorrect,
      timeSpentSeconds: timeSpent,
    })
    
    return successResponse({ saved: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse('Ogiltig förfrågan', 400)
    }
    console.error('Submit answer error:', error)
    return errorResponse('Ett fel uppstod', 500)
  }
}
