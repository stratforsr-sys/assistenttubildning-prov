import { NextRequest } from 'next/server'
import { getExamCodeByCode } from '@/lib/db/queries'
import { successResponse, errorResponse } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  code: z.string().min(1).max(50),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = schema.parse(body)
    
    const examCode = await getExamCodeByCode(code)
    
    if (!examCode) {
      return successResponse({
        valid: false,
      })
    }
    
    // Check if expired
    if (examCode.expiresAt && new Date(examCode.expiresAt) < new Date()) {
      return successResponse({
        valid: false,
        expired: true,
      })
    }
    
    return successResponse({
      valid: true,
      examCodeId: examCode.id,
      examName: examCode.name,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse('Ogiltig förfrågan', 400)
    }
    console.error('Validate code error:', error)
    return errorResponse('Ett fel uppstod', 500)
  }
}
