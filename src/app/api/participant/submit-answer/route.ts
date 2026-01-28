import { NextRequest } from 'next/server'
import { getAttemptById, saveAnswer } from '@/lib/db/queries'
import { successResponse, errorResponse } from '@/lib/utils'
import { getQuestionById, checkTrueFalseAnswer, checkWrittenAnswer } from '@/lib/questions'
import { z } from 'zod'

const schema = z.object({
  attemptId: z.string().uuid(),
  questionId: z.number().int().positive(),
  selectedOption: z.string(), // A/B/C/D for multiple-choice, 'true'/'false' for true-false, 'written' for written
  writtenAnswer: z.string().optional(), // For written questions and true-false motivation
  timeSpent: z.number().int().nonnegative(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { attemptId, questionId, selectedOption, writtenAnswer, timeSpent } = schema.parse(body)

    // Get attempt to validate and get question order
    const attempt = await getAttemptById(attemptId)
    if (!attempt) {
      return errorResponse('Ogiltigt försök', 400)
    }

    if (attempt.isCompleted) {
      return errorResponse('Provet är redan avslutat', 400)
    }

    // Get the original question to determine type
    const question = getQuestionById(questionId)
    if (!question) {
      return errorResponse('Ogiltig fråga', 400)
    }

    // Get question order to determine correct answer for shuffled multiple-choice
    const questionOrder = JSON.parse(attempt.questionOrder || '[]')
    const questionData = questionOrder.find((q: { id: number }) => q.id === questionId)

    if (!questionData) {
      return errorResponse('Ogiltig fråga', 400)
    }

    let isCorrect = false

    // Determine if answer is correct based on question type
    switch (question.type) {
      case 'multiple-choice': {
        // The shuffledCorrectIndex tells us which position (0-3 = A-D) the correct answer is in
        const correctOptionIndex = questionData.shuffledCorrectIndex
        const correctOption = ['A', 'B', 'C', 'D'][correctOptionIndex]
        isCorrect = selectedOption === correctOption
        break
      }

      case 'true-false': {
        // Check if selected option (true/false) is correct
        isCorrect = checkTrueFalseAnswer(questionId, selectedOption)

        // For true-false with motivation, we could give partial credit
        // but for simplicity, we just check the true/false part
        break
      }

      case 'written': {
        // Check written answer for keywords
        if (writtenAnswer) {
          const result = checkWrittenAnswer(questionId, writtenAnswer)
          isCorrect = result.isCorrect
        }
        break
      }
    }

    // Save the answer
    await saveAnswer({
      attemptId,
      questionId,
      selectedOption,
      isCorrect,
      timeSpentSeconds: timeSpent,
      writtenAnswer: writtenAnswer || null,
    })

    return successResponse({ saved: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse('Ogiltig förfrågan', 400)
    }
    console.error('Submit answer error:', error)
    // Return more descriptive error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Okänt fel'
    return errorResponse(`Databasfel: ${errorMessage}`, 500)
  }
}
