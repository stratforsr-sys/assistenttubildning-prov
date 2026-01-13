'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { ScoreSummary } from '@/components/review/ScoreSummary'
import { ResultCard } from '@/components/review/ResultCard'
import { MESSAGES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import type { ExamResult } from '@/types'

interface AttemptDetail extends ExamResult {
  participantName: string
  completedAt: string
  isTimedOut: boolean
}

export default function AttemptDetailPage() {
  const router = useRouter()
  const params = useParams()
  const attemptId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [attempt, setAttempt] = useState<AttemptDetail | null>(null)
  const [error, setError] = useState('')
  
  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await fetch(`/api/admin/attempt/${attemptId}`)
        
        if (res.status === 401) {
          router.replace('/admin-login')
          return
        }
        
        if (res.status === 404) {
          setError('Provresultatet hittades inte')
          setIsLoading(false)
          return
        }
        
        const data = await res.json()
        
        if (data.success) {
          setAttempt(data.data)
        } else {
          setError(data.error || 'Ett fel uppstod')
        }
      } catch (err) {
        console.error('Fetch attempt error:', err)
        setError('Ett fel uppstod vid hämtning')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (attemptId) {
      fetchAttempt()
    }
  }, [attemptId, router])
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-telink-bg flex items-center justify-center">
        <div className="text-telink-text-secondary animate-pulse">
          {MESSAGES.LOADING}
        </div>
      </div>
    )
  }
  
  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-telink-bg flex items-center justify-center p-4">
        <Card variant="glass" className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-status-incorrect/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-status-incorrect" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-telink-text mb-2">
              {error || 'Något gick fel'}
            </h2>
            <Button onClick={() => router.push('/admin-dashboard')} className="mt-4">
              Tillbaka till dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-telink-bg">
      {/* Header */}
      <header className="bg-telink-bg-secondary border-b border-telink-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/admin-dashboard')}
              className="mr-2"
            >
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {MESSAGES.BACK}
            </Button>
            <Image
              src="/logo.png"
              alt="Telink"
              width={80}
              height={24}
              className="h-6 w-auto hidden sm:block"
            />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Participant info */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-telink-text mb-2">
            {attempt.participantName}
          </h1>
          <div className="flex items-center gap-4 text-telink-text-secondary text-sm">
            <span>{formatDate(attempt.completedAt)}</span>
            {attempt.isTimedOut && (
              <span className="px-2 py-1 bg-status-warning/20 text-status-warning rounded-full text-xs">
                Timeout
              </span>
            )}
          </div>
        </div>
        
        {/* Score summary */}
        <div className="mb-8">
          <ScoreSummary
            totalCorrect={attempt.totalCorrect}
            totalQuestions={attempt.totalQuestions}
            totalTimeSeconds={attempt.totalTimeSeconds}
          />
        </div>
        
        {/* Results heading */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-telink-text">
            Svar per fråga
          </h2>
          <span className="text-sm text-telink-text-secondary">
            Klicka för att expandera
          </span>
        </div>
        
        {/* Results list */}
        <div className="space-y-3">
          {attempt.answers.map((result, index) => (
            <ResultCard
              key={result.questionId}
              result={result}
              questionNumber={index + 1}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
