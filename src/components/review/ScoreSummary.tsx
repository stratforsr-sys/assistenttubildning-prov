'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { formatTimeMinutes, calculatePercentage, cn } from '@/lib/utils'

interface ScoreSummaryProps {
  totalCorrect: number
  totalQuestions: number
  totalTimeSeconds: number
}

export function ScoreSummary({ 
  totalCorrect, 
  totalQuestions, 
  totalTimeSeconds 
}: ScoreSummaryProps) {
  const percentage = calculatePercentage(totalCorrect, totalQuestions)
  
  const getPerformanceLabel = () => {
    if (percentage >= 90) return { text: 'Utmärkt!', color: 'text-status-correct' }
    if (percentage >= 70) return { text: 'Bra jobbat!', color: 'text-telink-accent' }
    if (percentage >= 50) return { text: 'Godkänt', color: 'text-status-warning' }
    return { text: 'Fortsätt öva', color: 'text-status-incorrect' }
  }
  
  const performance = getPerformanceLabel()
  
  return (
    <Card variant="glass" className="overflow-hidden">
      <CardContent className="p-8">
        {/* Main score display */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-4">
            {/* Circular progress background */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-telink-bg-tertiary"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                className="text-telink-accent"
                style={{
                  strokeDasharray: `${2 * Math.PI * 70}`,
                  strokeDashoffset: `${2 * Math.PI * 70 * (1 - percentage / 100)}`,
                  transition: 'stroke-dashoffset 1s ease-out',
                }}
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-telink-text">
                {percentage}%
              </span>
              <span className={cn('text-sm font-medium', performance.color)}>
                {performance.text}
              </span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-telink-text mb-2">
            Din poäng
          </h2>
          <p className="text-telink-text-secondary">
            Du svarade rätt på {totalCorrect} av {totalQuestions} frågor
          </p>
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-telink-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-telink-accent">
              {totalCorrect}/{totalQuestions}
            </p>
            <p className="text-sm text-telink-text-secondary">Rätta svar</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-telink-text">
              {formatTimeMinutes(totalTimeSeconds)}
            </p>
            <p className="text-sm text-telink-text-secondary">Total tid</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-telink-text">
              {Math.round(totalTimeSeconds / totalQuestions)}s
            </p>
            <p className="text-sm text-telink-text-secondary">Per fråga</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
