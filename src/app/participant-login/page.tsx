'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { MESSAGES } from '@/lib/constants'
import { saveExamState } from '@/lib/utils'

export default function ParticipantLoginPage() {
  const router = useRouter()
  const [examCode, setExamCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate
    if (!examCode.trim() || !firstName.trim() || !lastName.trim()) {
      setError(MESSAGES.ERROR_REQUIRED_FIELDS)
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/participant/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examCode: examCode.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      })
      
      const data = await response.json()
      
      if (!data.success) {
        setError(data.error || MESSAGES.ERROR_GENERIC)
        return
      }
      
      // Save exam state to session storage
      saveExamState({
        attemptId: data.data.attemptId,
        currentIndex: 0,
        answers: {},
        startTime: Date.now(),
      })
      
      // Store questions in session storage
      sessionStorage.setItem('examQuestions', JSON.stringify(data.data.questions))
      sessionStorage.setItem('examTimeLimit', String(data.data.timeLimit))
      
      // Navigate to exam
      router.push('/exam')
    } catch (err) {
      console.error('Login error:', err)
      setError(MESSAGES.ERROR_GENERIC)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <main className="min-h-screen bg-telink-bg flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-telink-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-telink-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <Image
            src="/logo.png"
            alt="Telink"
            width={160}
            height={48}
            className="mx-auto mb-6"
            priority
          />
          <h1 className="text-3xl font-bold text-telink-text mb-2">
            {MESSAGES.LOGIN_TITLE}
          </h1>
          <p className="text-telink-text-secondary">
            {MESSAGES.LOGIN_SUBTITLE}
          </p>
        </div>
        
        {/* Login Card */}
        <Card variant="glass" className="animate-fade-in-up">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Exam Code */}
              <Input
                label={MESSAGES.EXAM_CODE_LABEL}
                placeholder={MESSAGES.EXAM_CODE_PLACEHOLDER}
                value={examCode}
                onChange={(e) => setExamCode(e.target.value.toUpperCase())}
                autoComplete="off"
                autoFocus
              />
              
              {/* First Name */}
              <Input
                label={MESSAGES.FIRST_NAME_LABEL}
                placeholder={MESSAGES.FIRST_NAME_PLACEHOLDER}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
              />
              
              {/* Last Name */}
              <Input
                label={MESSAGES.LAST_NAME_LABEL}
                placeholder={MESSAGES.LAST_NAME_PLACEHOLDER}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
              
              {/* Error message */}
              {error && (
                <div className="p-4 bg-status-incorrect/10 border border-status-incorrect/30 rounded-xl text-status-incorrect text-sm">
                  {error}
                </div>
              )}
              
              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                isLoading={isLoading}
              >
                {MESSAGES.START_EXAM_BUTTON}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Admin link */}
        <div className="text-center mt-6">
          <a 
            href="/admin-login" 
            className="text-sm text-telink-text-muted hover:text-telink-text-secondary transition-colors"
          >
            Administratör?
          </a>
        </div>
      </div>
    </main>
  )
}
