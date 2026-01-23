'use client'

import { cn } from '@/lib/utils'

interface TrueFalseOptionProps {
  isTrue: boolean
  isSelected: boolean
  isDisabled?: boolean
  onClick: () => void
  // For review mode
  showResult?: boolean
  isCorrect?: boolean
  isUserAnswer?: boolean
}

export function TrueFalseOption({
  isTrue,
  isSelected,
  isDisabled = false,
  onClick,
  showResult = false,
  isCorrect,
  isUserAnswer,
}: TrueFalseOptionProps) {
  const getVariantStyles = () => {
    if (showResult) {
      if (isCorrect) {
        return 'border-status-correct bg-status-correct/10'
      }
      if (isUserAnswer && !isCorrect) {
        return 'border-status-incorrect bg-status-incorrect/10'
      }
      return 'border-telink-border opacity-60'
    }

    if (isSelected) {
      return 'border-telink-accent bg-telink-accent-muted ring-1 ring-telink-accent'
    }

    return 'border-telink-border hover:border-telink-accent hover:bg-telink-accent-muted'
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled || showResult}
      className={cn(
        'w-full flex items-center justify-center gap-3 p-5',
        'bg-telink-bg-tertiary/50 border-2 rounded-xl',
        'text-center transition-all duration-200',
        !isDisabled && !showResult && 'cursor-pointer',
        isDisabled && 'cursor-not-allowed opacity-50',
        getVariantStyles()
      )}
    >
      {/* Icon */}
      <span
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full',
          'flex items-center justify-center',
          'text-xl',
          showResult && isCorrect
            ? 'bg-status-correct text-white'
            : showResult && isUserAnswer && !isCorrect
            ? 'bg-status-incorrect text-white'
            : isSelected
            ? 'bg-telink-accent text-telink-bg'
            : 'bg-telink-bg-tertiary text-telink-text-secondary'
        )}
      >
        {isTrue ? '✓' : '✗'}
      </span>

      {/* Text */}
      <span className="font-semibold text-lg text-telink-text">
        {isTrue ? 'Sant' : 'Falskt'}
      </span>

      {/* Result indicators */}
      {showResult && (
        <span className="flex-shrink-0 ml-auto">
          {isCorrect && (
            <svg className="w-6 h-6 text-status-correct" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isUserAnswer && !isCorrect && (
            <svg className="w-6 h-6 text-status-incorrect" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </span>
      )}
    </button>
  )
}
