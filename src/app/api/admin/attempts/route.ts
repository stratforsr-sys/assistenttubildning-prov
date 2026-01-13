import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getAllAttempts } from '@/lib/db/queries'
import { successResponse, errorResponse } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    
    const attempts = await getAllAttempts()
    
    return successResponse({ attempts })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Ej behörig', 401)
    }
    console.error('Get attempts error:', error)
    return errorResponse('Ett fel uppstod', 500)
  }
}
