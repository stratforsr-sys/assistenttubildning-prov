import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getAllExamCodes, createExamCode, updateExamCodeStatus } from '@/lib/db/queries'
import { successResponse, errorResponse } from '@/lib/utils'
import { z } from 'zod'

// GET - List all exam codes
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    
    const examCodes = await getAllExamCodes()
    
    return successResponse({ examCodes })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Ej behörig', 401)
    }
    console.error('Get exam codes error:', error)
    return errorResponse('Ett fel uppstod', 500)
  }
}

const createSchema = z.object({
  code: z.string().min(3).max(50).regex(/^[A-Za-z0-9]+$/, 'Endast bokstäver och siffror tillåtna'),
  name: z.string().min(1).max(100),
  expiresAt: z.string().datetime().optional().nullable(),
})

// POST - Create new exam code
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const { code, name, expiresAt } = createSchema.parse(body)
    
    const examCode = await createExamCode({
      code,
      name,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    })
    
    return successResponse({ examCode })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Ej behörig', 401)
    }
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0]?.message || 'Ogiltig förfrågan', 400)
    }
    // Check for duplicate code error
    if (error instanceof Error && error.message.includes('unique')) {
      return errorResponse('Provkoden finns redan', 400)
    }
    console.error('Create exam code error:', error)
    return errorResponse('Ett fel uppstod', 500)
  }
}

const updateSchema = z.object({
  id: z.string().uuid(),
  isActive: z.boolean(),
})

// PATCH - Update exam code status
export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const { id, isActive } = updateSchema.parse(body)
    
    const examCode = await updateExamCodeStatus(id, isActive)
    
    return successResponse({ examCode })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Ej behörig', 401)
    }
    if (error instanceof z.ZodError) {
      return errorResponse('Ogiltig förfrågan', 400)
    }
    console.error('Update exam code error:', error)
    return errorResponse('Ett fel uppstod', 500)
  }
}
