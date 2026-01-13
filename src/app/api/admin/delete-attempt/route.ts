import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { deleteAttempt } from '@/lib/db/queries'
import { successResponse, errorResponse } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  attemptId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const { attemptId } = schema.parse(body)
    
    await deleteAttempt(attemptId)
    
    return successResponse({ deleted: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Ej behörig', 401)
    }
    if (error instanceof z.ZodError) {
      return errorResponse('Ogiltig förfrågan', 400)
    }
    console.error('Delete attempt error:', error)
    return errorResponse('Ett fel uppstod', 500)
  }
}
