'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface MotivationInputProps {
  value: string
  onChange: (value: string) => void
  isDisabled?: boolean
  placeholder?: string
  // For review mode
  showResult?: boolean
  isCorrect?: boolean
  isPartiallyCorrect?: boolean
  explanation?: string
}

export function MotivationInput({
  value,
  onChange,
  isDisabled = false,
  placeholder = 'Motivera ditt svar... (1-2 meningar)',
  showResult = false,
  isCorrect,
  isPartiallyCorrect,
  explanation,
}: MotivationInputProps) {
  const maxLength = 200
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
    if (!showResult) return 'border-telink-border/50 focus:border-telink-accent focus:ring-1 focus:ring-telink-accent'

    if (isCorrect) {
      return 'border-status-correct bg-status-correct/5'
    }
    if (isPartiallyCorrect) {
      return 'border-yellow-500 bg-yellow-500/5'
    }
    return 'border-status-incorrect bg-status-incorrect/5'
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-telink-text-secondary">
        Motivering (valfritt men rekommenderas):
      </label>

      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          disabled={isDisabled || showResult}
          placeholder={placeholder}
          rows={2}
          className={cn(
            'w-full p-3 rounded-lg',
            'bg-telink-bg-tertiary/30 border',
            'text-telink-text text-sm placeholder:text-telink-text-secondary/50',
            'resize-none transition-all duration-200',
            'focus:outline-none',
            isDisabled && 'cursor-not-allowed opacity-50',
            getResultStyles()
          )}
        />

        {/* Character counter */}
        {!showResult && (
          <div className={cn(
            'absolute bottom-2 right-2 text-xs',
            charCount > maxLength * 0.9 ? 'text-status-incorrect' : 'text-telink-text-secondary'
          )}>
            {charCount} / {maxLength}
          </div>
        )}
      </div>

      {/* Result feedback for motivation */}
      {showResult && explanation && (
        <div className="p-3 rounded-lg bg-telink-bg-tertiary/50 border border-telink-border">
          <div className="text-sm font-medium text-telink-text-secondary mb-1">
            Förklaring:
          </div>
          <div className="text-telink-text text-sm">
            {explanation}
          </div>
        </div>
      )}
    </div>
  )
}
