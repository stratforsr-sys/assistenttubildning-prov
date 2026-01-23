import { NextRequest } from 'next/server'
import {
  getExamCodeByCode,
  checkDuplicateAttempt,
  createParticipant,
  createAttempt,
  findParticipantByName
} from '@/lib/db/queries'
import { getShuffledQuestions } from '@/lib/questions'
import { successResponse, errorResponse, generateAttemptSeed } from '@/lib/utils'
import { TIME } from '@/lib/constants'
import { z } from 'zod'
import type { ShuffledQuestion } from '@/types'

const schema = z.object({
  examCode: z.string().min(1).max(50),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { examCode, firstName, lastName } = schema.parse(body)

    // Validate exam code
    const examCodeRecord = await getExamCodeByCode(examCode)
    if (!examCodeRecord) {
      return errorResponse('Ogiltig provkod', 400)
    }

    // Check for expired code
    if (examCodeRecord.expiresAt && new Date(examCodeRecord.expiresAt) < new Date()) {
      return errorResponse('Provkoden har gått ut', 400)
    }

    // Check for duplicate attempt
    const isDuplicate = await checkDuplicateAttempt(firstName, lastName, examCodeRecord.id)
    if (isDuplicate) {
      return errorResponse('Du har redan genomfört detta prov', 400)
    }

    // Create or get participant
    let participant = await findParticipantByName(firstName, lastName)
    if (!participant) {
      participant = await createParticipant({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      })
    }

    // Generate seed for question shuffling
    const seed = generateAttemptSeed()
    const shuffledQuestions = getShuffledQuestions(seed)

    // Create attempt - store question order with type information
    const attempt = await createAttempt({
      participantId: participant.id,
      examCodeId: examCodeRecord.id,
      questionOrder: JSON.stringify(shuffledQuestions.map(q => {
        if (q.type === 'multiple-choice') {
          return {
            id: q.id,
            type: q.type,
            originalOrder: q.originalOrder,
            shuffledCorrectIndex: q.shuffledCorrectIndex,
          }
        } else {
          // true-false and written questions don't have shuffled options
          return {
            id: q.id,
            type: q.type,
          }
        }
      })),
    })

    // Return questions to client with appropriate data based on type
    return successResponse({
      attemptId: attempt.id,
      questions: shuffledQuestions.map((q: ShuffledQuestion) => {
        if (q.type === 'multiple-choice') {
          return {
            id: q.id,
            text: q.text,
            type: q.type,
            options: q.options,
          }
        } else if (q.type === 'true-false') {
          return {
            id: q.id,
            text: q.text,
            type: q.type,
          }
        } else {
          // written
          return {
            id: q.id,
            text: q.text,
            type: q.type,
            maxLength: q.maxLength,
          }
        }
      }),
      timeLimit: TIME.EXAM_TIME_LIMIT_SECONDS,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse('Alla fält måste fyllas i korrekt', 400)
    }
    console.error('Start exam error:', error)
    return errorResponse('Ett fel uppstod vid start av provet', 500)
  }
}
