'use client'

import Image from 'next/image'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Timer } from '@/components/ui/Timer'

interface ExamHeaderProps {
  currentQuestion: number
  totalQuestions: number
  remainingSeconds: number
  onTimeUp: () => void
  onWarning?: () => void
}

export function ExamHeader({
  currentQuestion,
  totalQuestions,
  remainingSeconds,
  onTimeUp,
  onWarning,
}: ExamHeaderProps) {
  return (
    <header className="bg-telink-bg-secondary/80 backdrop-blur-md border-b border-telink-border sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Top row: Logo and Timer */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Telink"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-telink-text-secondary text-sm hidden sm:inline">
              Produktutbildning Prov
            </span>
          </div>
          
          <Timer
            initialSeconds={remainingSeconds}
            onTimeUp={onTimeUp}
            onWarning={onWarning}
          />
        </div>
        
        {/* Progress bar */}
        <ProgressBar 
          current={currentQuestion} 
          total={totalQuestions}
        />
      </div>
    </header>
  )
}
