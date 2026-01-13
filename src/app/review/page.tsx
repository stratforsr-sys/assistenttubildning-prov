'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ScoreSummary } from '@/components/review/ScoreSummary'
import { ResultCard } from '@/components/review/ResultCard'
import { Button } from '@/components/ui/Button'
import { ExamResult } from '@/types'
import { MESSAGES } from '@/lib/constants'

export default function ReviewPage() {
  const router = useRouter()
  const [result, setResult] = useState<ExamResult | null>(null)
  
  useEffect(() => {
    const resultData = sessionStorage.getItem('examResult')
    
    if (!resultData) {
      router.replace('/participant-login')
      return
    }
    
    setResult(JSON.parse(resultData))
  }, [router])
  
  const handleBackToStart = () => {
    sessionStorage.removeItem('examResult')
    router.push('/participant-login')
  }
  
  if (!result) {
    return (
      <div className="min-h-screen bg-telink-bg flex items-center justify-center">
        <div className="text-telink-text-secondary animate-pulse">
          {MESSAGES.LOADING}
        </div>
      </div>
    )
  }
  
  return (
    <main className="min-h-screen bg-telink-bg">
      {/* Header */}
      <header className="bg-telink-bg-secondary/80 backdrop-blur-md border-b border-telink-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Telink"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-telink-text-secondary text-sm hidden sm:inline">
              {MESSAGES.REVIEW_TITLE}
            </span>
          </div>
          
          <Button variant="secondary" size="sm" onClick={handleBackToStart}>
            {MESSAGES.BACK}
          </Button>
        </div>
      </header>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Score Summary */}
        <div className="mb-8 animate-fade-in-up">
          <ScoreSummary
            totalCorrect={result.totalCorrect}
            totalQuestions={result.totalQuestions}
            totalTimeSeconds={result.totalTimeSeconds}
          />
        </div>
        
        {/* Section title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-telink-text">
            {MESSAGES.REVIEW_SUBTITLE}
          </h2>
          <p className="text-telink-text-secondary text-sm mt-1">
            Klicka på en fråga för att expandera och se detaljer
          </p>
        </div>
        
        {/* Results list */}
        <div className="space-y-3">
          {result.answers.map((answer, index) => (
            <div 
              key={answer.questionId} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ResultCard
                result={answer}
                questionNumber={index + 1}
              />
            </div>
          ))}
        </div>
        
        {/* Bottom action */}
        <div className="mt-8 text-center">
          <Button onClick={handleBackToStart} size="lg">
            Tillbaka till start
          </Button>
        </div>
      </div>
    </main>
  )
}
