import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getAttemptWithParticipant, getAnswersByAttemptId } from '@/lib/db/queries'
import { QUESTIONS, getQuestionById } from '@/lib/questions'
import { successResponse, errorResponse } from '@/lib/utils'
import type { QuestionType } from '@/types'

interface QuestionOrderItem {
  id: number
  type: QuestionType
  originalOrder?: string[] // Only for multiple-choice
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin auth
    await requireAdmin()
  } catch {
    return errorResponse('Ej auktoriserad', 401)
  }

  try {
    const attemptId = params.id

    // Get attempt with participant
    const attemptData = await getAttemptWithParticipant(attemptId)

    if (!attemptData) {
      return errorResponse('Försöket hittades inte', 404)
    }

    const { attempt, participant } = attemptData

    // Get all answers
    const answers = await getAnswersByAttemptId(attemptId)

    // Get question order from attempt
    let questionOrder: QuestionOrderItem[] = []
    try {
      questionOrder = JSON.parse(attempt.questionOrder || '[]')
    } catch {
      // Fallback to default order
      questionOrder = QUESTIONS.map(q => ({
        id: q.id,
        type: q.type,
        originalOrder: q.type === 'multiple-choice' ? ['A', 'B', 'C', 'D'] : undefined
      }))
    }

    // Build detailed answer results
    const answerResults = questionOrder.map((qOrder) => {
      const question = getQuestionById(qOrder.id)
      const answer = answers.find(a => a.questionId === qOrder.id)

      if (!question) {
        return null
      }

      // Handle different question types
      if (question.type === 'multiple-choice') {
        // Map the correct answer to shuffled position
        const originalOrder = qOrder.originalOrder || ['A', 'B', 'C', 'D']
        const correctIndex = originalOrder.indexOf(question.correctAnswer)
        const correctOption = (['A', 'B', 'C', 'D'] as const)[correctIndex]

        // Map options back to shuffled display
        const displayOptions = question.options.map((_, idx) => {
          return {
            key: (['A', 'B', 'C', 'D'] as const)[idx],
            text: question.options.find(o => o.key === originalOrder[idx])?.text || '',
          }
        })

        return {
          questionId: question.id,
          questionText: question.text,
          questionType: 'multiple-choice' as const,
          options: displayOptions,
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
      attemptId: attempt.id,
      participantName: `${participant.firstName} ${participant.lastName}`,
      completedAt: attempt.completedAt?.toISOString() || new Date().toISOString(),
      isTimedOut: attempt.isTimedOut,
      totalScore: attempt.totalScore || 0,
      totalCorrect: attempt.totalCorrect || 0,
      totalQuestions: attempt.totalQuestions,
      totalTimeSeconds: attempt.totalTimeSeconds || 0,
      percentage: Math.round(((attempt.totalCorrect || 0) / attempt.totalQuestions) * 100),
      answers: answerResults,
    })
  } catch (error) {
    console.error('Get attempt detail error:', error)
    return errorResponse('Ett fel uppstod', 500)
  }
}
