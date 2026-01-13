'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { QuestionStats } from '@/types'
import { MESSAGES } from '@/lib/constants'

interface QuestionAnalysisProps {
  stats: QuestionStats[]
}

export function QuestionAnalysis({ stats }: QuestionAnalysisProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  
  // Calculate top 5 hardest questions
  const hardestQuestions = [...stats]
    .sort((a, b) => a.correctPercentage - b.correctPercentage)
    .slice(0, 5)
  
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-status-warning/20 text-status-warning">{MESSAGES.QUESTION_TOO_EASY}</span>
      case 'hard':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-status-incorrect/20 text-status-incorrect">{MESSAGES.QUESTION_TOO_HARD}</span>
      default:
        return null
    }
  }
  
  if (!stats || stats.length === 0) {
    return (
      <Card variant="glass">
        <CardContent className="py-12 text-center text-telink-text-secondary">
          Ingen frågestatistik tillgänglig än
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Top 5 hardest questions */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Topp 5 svåraste frågor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {hardestQuestions.map((q, idx) => (
            <div 
              key={q.questionId}
              className="flex items-center gap-4 p-3 bg-telink-bg-tertiary/50 rounded-xl"
            >
              <span className="w-8 h-8 rounded-lg bg-status-incorrect/20 text-status-incorrect flex items-center justify-center font-bold text-sm">
                {idx + 1}
              </span>
              <div className="flex-grow min-w-0">
                <p className="text-sm text-telink-text truncate">
                  Fråga {q.questionId}: {q.questionText}
                </p>
              </div>
              <span className="flex-shrink-0 font-semibold text-status-incorrect">
                {q.correctPercentage}%
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* All questions */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Alla frågor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {stats.map((q) => (
            <div key={q.questionId} className="border border-telink-border rounded-xl overflow-hidden">
              {/* Question header */}
              <button
                onClick={() => setExpandedQuestion(
                  expandedQuestion === q.questionId ? null : q.questionId
                )}
                className="w-full p-4 flex items-center justify-between hover:bg-telink-bg-tertiary/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex-shrink-0 text-sm text-telink-text-secondary">
                    #{q.questionId}
                  </span>
                  <p className="text-telink-text truncate text-left">
                    {q.questionText}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {getDifficultyBadge(q.difficulty)}
                  <span className={cn(
                    'font-semibold min-w-[3rem] text-right',
                    q.correctPercentage >= 70 ? 'text-status-correct' :
                    q.correctPercentage >= 40 ? 'text-status-warning' :
                    'text-status-incorrect'
                  )}>
                    {q.correctPercentage}%
                  </span>
                  <svg 
                    className={cn(
                      'w-5 h-5 text-telink-text-secondary transition-transform',
                      expandedQuestion === q.questionId && 'rotate-180'
                    )}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {/* Expanded details */}
              {expandedQuestion === q.questionId && (
                <div className="px-4 pb-4 border-t border-telink-border">
                  <h4 className="text-sm font-semibold text-telink-text-secondary mt-4 mb-3">
                    Svarsfördelning
                  </h4>
                  <div className="space-y-2">
                    {q.optionDistribution.map((opt) => (
                      <div key={opt.option} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-telink-bg-tertiary flex items-center justify-center text-sm font-medium text-telink-text-secondary">
                          {opt.option}
                        </span>
                        <div className="flex-grow h-2 bg-telink-bg-tertiary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-telink-accent rounded-full transition-all"
                            style={{ width: `${opt.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-telink-text-secondary min-w-[4rem] text-right">
                          {opt.count} ({opt.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                  {q.mostCommonWrongAnswer && (
                    <p className="text-sm text-telink-text-muted mt-4">
                      Vanligaste felaktiga svar: <span className="text-status-incorrect font-medium">{q.mostCommonWrongAnswer}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
