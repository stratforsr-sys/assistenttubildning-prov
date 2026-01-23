'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface WrittenAnswerProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  isDisabled?: boolean
  placeholder?: string
  // For review mode
  showResult?: boolean
  isCorrect?: boolean
  isPartiallyCorrect?: boolean
  exampleAnswer?: string
}

export function WrittenAnswer({
  value,
  onChange,
  maxLength = 300,
  isDisabled = false,
  placeholder = 'Skriv ditt svar här... (1-2 meningar)',
  showResult = false,
  isCorrect,
  isPartiallyCorrect,
  exampleAnswer,
}: WrittenAnswerProps) {
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    setCharCount(value.length)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (newValue.length <= maxLength) {
      onChange(newValue)
    }
  }

  const getResultStyles = () => {
    if (!showResult) return 'border-telink-border focus:border-telink-accent focus:ring-1 focus:ring-telink-accent'

    if (isCorrect) {
      return 'border-status-correct bg-status-correct/5'
    }
    if (isPartiallyCorrect) {
      return 'border-yellow-500 bg-yellow-500/5'
    }
    return 'border-status-incorrect bg-status-incorrect/5'
  }

  const getCharCountColor = () => {
    const ratio = charCount / maxLength
    if (ratio > 0.9) return 'text-status-incorrect'
    if (ratio > 0.7) return 'text-yellow-500'
    return 'text-telink-text-secondary'
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          disabled={isDisabled || showResult}
          placeholder={placeholder}
          rows={4}
          className={cn(
            'w-full p-4 rounded-xl',
            'bg-telink-bg-tertiary/50 border-2',
            'text-telink-text placeholder:text-telink-text-secondary/50',
            'resize-none transition-all duration-200',
            'focus:outline-none',
            isDisabled && 'cursor-not-allowed opacity-50',
            getResultStyles()
          )}
        />

        {/* Character counter */}
        {!showResult && (
          <div className={cn(
            'absolute bottom-3 right-3 text-sm',
            getCharCountColor()
          )}>
            {charCount} / {maxLength}
          </div>
        )}
      </div>

      {/* Result feedback */}
      {showResult && (
        <div className="space-y-2">
          {/* Status indicator */}
          <div className={cn(
            'flex items-center gap-2 p-3 rounded-lg',
            isCorrect
              ? 'bg-status-correct/10 text-status-correct'
              : isPartiallyCorrect
              ? 'bg-yellow-500/10 text-yellow-600'
              : 'bg-status-incorrect/10 text-status-incorrect'
          )}>
            {isCorrect ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Rätt! Ditt svar innehåller rätt nyckelord.</span>
              </>
            ) : isPartiallyCorrect ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">Delvis rätt. Några nyckelord saknas.</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="font-medium">Fel. Viktiga nyckelord saknas.</span>
              </>
            )}
          </div>

          {/* Example answer */}
          {exampleAnswer && (
            <div className="p-3 rounded-lg bg-telink-bg-tertiary/50 border border-telink-border">
              <div className="text-sm font-medium text-telink-text-secondary mb-1">
                Exempelsvar:
              </div>
              <div className="text-telink-text italic">
                {exampleAnswer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
