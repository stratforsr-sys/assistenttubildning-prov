'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  current: number
  total: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ current, total, className, showLabel = true }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100)
  
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-telink-text-secondary">
            Fråga {current} av {total}
          </span>
          <span className="text-sm font-medium text-telink-accent">
            {percentage}%
          </span>
        </div>
      )}
      <div className="h-2 bg-telink-bg-tertiary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-telink-accent to-emerald-400 rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${percentage}%`,
            boxShadow: '0 0 10px rgba(61, 214, 140, 0.5)',
          }}
        />
      </div>
    </div>
  )
}
