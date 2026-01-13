'use client'

import { useState } from 'react'
import { AnswerResult } from '@/types'
import { Card, CardContent } from '@/components/ui/Card'
import { AnswerOption } from '@/components/exam/AnswerOption'
import { cn } from '@/lib/utils'

interface ResultCardProps {
  result: AnswerResult
  questionNumber: number
}

export function ResultCard({ result, questionNumber }: ResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <Card 
      variant="glass" 
      className={cn(
        'overflow-hidden transition-all duration-300',
        result.isCorrect ? 'border-status-correct/30' : 'border-status-incorrect/30'
      )}
    >
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-telink-bg-tertiary/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div 
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              result.isCorrect 
                ? 'bg-status-correct/20 text-status-correct' 
                : 'bg-status-incorrect/20 text-status-incorrect'
            )}
          >
            {result.isCorrect ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          
          {/* Question info */}
          <div className="text-left">
            <span className="text-sm text-telink-text-secondary">
              Fråga {questionNumber}
            </span>
            <p className="text-telink-text font-medium line-clamp-1 max-w-md">
              {result.questionText}
            </p>
          </div>
        </div>
        
        {/* Expand indicator */}
        <svg 
          className={cn(
            'w-5 h-5 text-telink-text-secondary transition-transform duration-300',
            isExpanded && 'rotate-180'
          )} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Expanded content */}
      {isExpanded && (
        <CardContent className="pt-0 border-t border-telink-border">
          <h3 className="text-lg font-semibold text-telink-text mb-4">
            {result.questionText}
          </h3>
          
          <div className="space-y-3 mb-4">
            {result.options.map((option) => (
              <AnswerOption
                key={option.key}
                optionKey={option.key}
                text={option.text}
                isSelected={false}
                onClick={() => {}}
                showResult={true}
                isCorrect={option.key === result.correctOption}
                isUserAnswer={option.key === result.selectedOption}
              />
            ))}
          </div>
          
          {/* Summary */}
          <div className="flex items-center gap-4 pt-4 border-t border-telink-border text-sm">
            <div>
              <span className="text-telink-text-secondary">Ditt svar: </span>
              <span className={cn(
                'font-medium',
                result.isCorrect ? 'text-status-correct' : 'text-status-incorrect'
              )}>
                {result.selectedOption || 'Ej besvarat'}
              </span>
            </div>
            {!result.isCorrect && (
              <div>
                <span className="text-telink-text-secondary">Rätt svar: </span>
                <span className="font-medium text-status-correct">
                  {result.correctOption}
                </span>
              </div>
            )}
            <div className="ml-auto text-telink-text-muted">
              Tid: {result.timeSpent}s
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
