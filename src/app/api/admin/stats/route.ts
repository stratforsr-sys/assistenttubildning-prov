import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { 
  getExamStats, 
  getQuestionStats, 
  getScoreDistribution,
  getTimeVsScoreData,
  getTrendData 
} from '@/lib/db/queries'
import { successResponse, errorResponse } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    
    const [stats, questionStats, scoreDistribution, timeVsScore, trend] = await Promise.all([
      getExamStats(),
      getQuestionStats(),
      getScoreDistribution(),
      getTimeVsScoreData(),
      getTrendData(),
    ])
    
    // Find top 5 hardest questions
    const hardestQuestions = [...questionStats]
      .sort((a, b) => a.correctPercentage - b.correctPercentage)
      .slice(0, 5)
    
    // Find questions that are too easy or too hard
    const flaggedQuestions = questionStats.filter(
      q => q.difficulty === 'easy' || q.difficulty === 'hard'
    )
    
    return successResponse({
      stats,
      questionStats,
      scoreDistribution,
      timeVsScore,
      trendData: trend,
      hardestQuestions,
      flaggedQuestions,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return errorResponse('Ej behörig', 401)
    }
    console.error('Get stats error:', error)
    return errorResponse('Ett fel uppstod', 500)
  }
}
