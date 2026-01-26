import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getAttemptWithParticipant, getAnswersByAttemptId } from '@/lib/db/queries'
import { QUESTIONS, getQuestionById } from '@/lib/questions'
import { successResponse, errorResponse } from '@/lib/utils'
import type { QuestionType } from '@/types'

interface QuestionOrderItem {
  id: number
  type: QuestionType
  originalOrder?: string[]
  shuffledCorrectIndex?: number
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
  } catch {
    return errorResponse('Ej auktoriserad', 401)
  }

  try {
    const { id: attemptId } = await params

    console.log('Fetching attempt:', attemptId)

    const attemptData = await getAttemptWithParticipant(attemptId)

    if (!attemptData) {
      console.log('Attempt not found:', attemptId)
      return errorResponse('Försöket hittades inte', 404)
    }

    const { attempt, participant } = attemptData
    console.log('Found attempt for:', participant.firstName, participant.lastName)

    const answers = await getAnswersByAttemptId(attemptId)
    console.log('Found answers:', answers.length)

    // Parse question order safely
    let questionOrder: QuestionOrderItem[] = []
    try {
      const parsed = JSON.parse(attempt.questionOrder || '[]')
      questionOrder = Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.log('Failed to parse questionOrder, using default')
      questionOrder = QUESTIONS.map(q => ({
        id: q.id,
        type: q.type,
      }))
    }

    console.log('Question order count:', questionOrder.length)

    // If no question order saved, use all questions in default order
    if (questionOrder.length === 0) {
      questionOrder = QUESTIONS.map(q => ({
        id: q.id,
        type: q.type,
      }))
    }

    // Build answer results
    const answerResults = questionOrder.map((qOrder) => {
      const question = getQuestionById(qOrder.id)
      const answer = answers.find(a => a.questionId === qOrder.id)

      if (!question) {
        console.log('Question not found:', qOrder.id)
        return null
      }

      // Base result
      const baseResult = {
        questionId: question.id,
        questionText: question.text,
        isCorrect: answer?.isCorrect ?? false,
        timeSpent: answer?.timeSpentSeconds ?? 0,
      }

      if (question.type === 'multiple-choice') {
        // Get the correct option - use shuffledCorrectIndex if available
        let correctOption = 'A'
        if (typeof qOrder.shuffledCorrectIndex === 'number') {
          correctOption = ['A', 'B', 'C', 'D'][qOrder.shuffledCorrectIndex] || 'A'
        } else if (Array.isArray(qOrder.originalOrder)) {
          const correctIndex = qOrder.originalOrder.indexOf(question.correctAnswer)
          correctOption = ['A', 'B', 'C', 'D'][correctIndex >= 0 ? correctIndex : 0]
        }

        // Build display options
        let displayOptions = question.options.map((opt, idx) => ({
          key: ['A', 'B', 'C', 'D'][idx] as 'A' | 'B' | 'C' | 'D',
          text: opt.text,
        }))

        // If we have originalOrder, reorder the options
        if (Array.isArray(qOrder.originalOrder) && qOrder.originalOrder.length === 4) {
          displayOptions = qOrder.originalOrder.map((origKey, idx) => {
            const origOption = question.options.find(o => o.key === origKey)
            return {
              key: ['A', 'B', 'C', 'D'][idx] as 'A' | 'B' | 'C' | 'D',
              text: origOption?.text || '',
            }
          })
        }

        return {
          ...baseResult,
          questionType: 'multiple-choice' as const,
          options: displayOptions,
          selectedOption: answer?.selectedOption || null,
          correctOption,
        }
      } else if (question.type === 'true-false') {
        return {
          ...baseResult,
          questionType: 'true-false' as const,
          selectedOption: answer?.selectedOption || null,
          correctOption: question.correctAnswer,
          writtenAnswer: answer?.writtenAnswer || null,
          explanation: question.explanation,
        }
      } else {
        // Written question
        return {
          ...baseResult,
          questionType: 'written' as const,
          writtenAnswer: answer?.writtenAnswer || null,
          acceptedKeywords: question.acceptedKeywords,
          exampleAnswer: question.exampleAnswer,
        }
      }
    }).filter((r): r is NonNullable<typeof r> => r !== null)

    console.log('Built answer results:', answerResults.length)

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
    // Return more detailed error info in development
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return errorResponse(`Ett fel uppstod: ${errorMessage}`, 500)
  }
}
