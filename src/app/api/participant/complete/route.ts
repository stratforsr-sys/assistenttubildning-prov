import { NextRequest } from 'next/server'
import { 
  getAttemptById, 
  countCorrectAnswers, 
  completeAttempt,
  getAnswersByAttemptId 
} from '@/lib/db/queries'
import { QUESTIONS, getQuestionById } from '@/lib/questions'
import { successResponse, errorResponse } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  attemptId: z.string().uuid(),
  isTimedOut: z.boolean().optional().default(false),
  totalTimeSeconds: z.number().int().nonnegative(),
})

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
    const questionOrder = JSON.parse(attempt.questionOrder || '[]')
    
    // Build result data
    const answerResults = questionOrder.map((qData: { 
      id: number
      originalOrder: string[]
      shuffledCorrectIndex: number 
    }) => {
      const question = getQuestionById(qData.id)
      const answer = answers.find(a => a.questionId === qData.id)
      
      if (!question) return null
      
      // Build shuffled options
      const shuffledOptions = qData.originalOrder.map((origKey: string, idx: number) => {
        const origOption = question.options.find(o => o.key === origKey)
        return {
          key: ['A', 'B', 'C', 'D'][idx],
          text: origOption?.text || '',
        }
      })
      
      // The correct answer in shuffled order
      const correctOption = ['A', 'B', 'C', 'D'][qData.shuffledCorrectIndex]
      
      return {
        questionId: question.id,
        questionText: question.text,
        options: shuffledOptions,
        selectedOption: answer?.selectedOption || null,
        correctOption,
        isCorrect: answer?.isCorrect || false,
        timeSpent: answer?.timeSpentSeconds || 0,
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
