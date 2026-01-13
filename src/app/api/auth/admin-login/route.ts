import { NextRequest } from 'next/server'
import { verifyAdminCredentials, createSession } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = schema.parse(body)
    
    const isValid = await verifyAdminCredentials(email, password)
    
    if (!isValid) {
      return errorResponse('Felaktig e-post eller lösenord', 401)
    }
    
    await createSession(email)
    
    return successResponse({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse('Ogiltig förfrågan', 400)
    }
    console.error('Admin login error:', error)
    return errorResponse('Ett fel uppstod', 500)
  }
}
