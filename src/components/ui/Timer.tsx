'use client'

import { useEffect, useState, useCallback } from 'react'
import { cn, formatTime } from '@/lib/utils'
import { TIME } from '@/lib/constants'

interface TimerProps {
  initialSeconds: number
  onTimeUp: () => void
  onWarning?: () => void
  isPaused?: boolean
  className?: string
}

export function Timer({ 
  initialSeconds, 
  onTimeUp, 
  onWarning,
  isPaused = false,
  className 
}: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [hasWarned, setHasWarned] = useState(false)
  
  const isWarning = seconds <= TIME.WARNING_SECONDS && seconds > 0
  
  useEffect(() => {
    if (isPaused) return
    
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isPaused, onTimeUp])
  
  useEffect(() => {
    if (isWarning && !hasWarned && onWarning) {
      setHasWarned(true)
      onWarning()
    }
  }, [isWarning, hasWarned, onWarning])
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg 
        className={cn(
          'w-5 h-5',
          isWarning ? 'text-status-warning animate-pulse' : 'text-telink-text-secondary'
        )}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <span 
        className={cn(
          'font-mono text-lg font-bold',
          isWarning ? 'text-status-warning animate-pulse' : 'text-telink-text'
        )}
      >
        {formatTime(seconds)}
      </span>
      {isWarning && (
        <span className="text-sm text-status-warning ml-2 animate-pulse">
          ⚠️ Mindre än 5 min kvar!
        </span>
      )}
    </div>
  )
}
