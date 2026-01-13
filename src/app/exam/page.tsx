'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FullscreenLock } from '@/components/exam/FullscreenLock'
import { ExamHeader } from '@/components/exam/ExamHeader'
import { QuestionCard } from '@/components/exam/QuestionCard'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/Modal'
import { getExamState, saveExamState, clearExamState } from '@/lib/utils'
import { MESSAGES } from '@/lib/constants'
import { ShuffledQuestion } from '@/types'

interface ExamState {
  attemptId: string
  currentIndex: number
  answers: Record<number, string>
  startTime: number
}

export default function ExamPage() {
  const router = useRouter()
  const [examState, setExamState] = useState<ExamState | null>(null)
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([])
  const [timeLimit, setTimeLimit] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const hasInitialized = useRef(false)
  
  // Initialize exam state from session storage
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true
    
    const state = getExamState()
    const questionsData = sessionStorage.getItem('examQuestions')
    const timeLimitData = sessionStorage.getItem('examTimeLimit')
    
    if (!state || !questionsData || !timeLimitData) {
      router.replace('/participant-login')
      return
    }
    
    setExamState(state)
    setQuestions(JSON.parse(questionsData))
    setTimeLimit(parseInt(timeLimitData))
    setSelectedOption(state.answers[state.currentIndex] || null)
    setQuestionStartTime(Date.now())
  }, [router])
  
  // Calculate remaining time
  const getRemainingSeconds = useCallback(() => {
    if (!examState) return 0
    const elapsed = Math.floor((Date.now() - examState.startTime) / 1000)
    return Math.max(0, timeLimit - elapsed)
  }, [examState, timeLimit])
  
  // Save answer to server
  const saveAnswer = useCallback(async (questionIndex: number, option: string) => {
    if (!examState) return
    
    const question = questions[questionIndex]
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    
    try {
      await fetch('/api/participant/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: examState.attemptId,
          questionId: question.id,
          selectedOption: option,
          timeSpent,
        }),
      })
    } catch (error) {
      console.error('Save answer error:', error)
    }
  }, [examState, questions, questionStartTime])
  
  // Complete exam
  const completeExam = useCallback(async (isTimedOut: boolean = false) => {
    if (!examState || isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      const totalTimeSeconds = Math.floor((Date.now() - examState.startTime) / 1000)
      
      const response = await fetch('/api/participant/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: examState.attemptId,
          isTimedOut,
          totalTimeSeconds,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Store result for review page
        sessionStorage.setItem('examResult', JSON.stringify(data.data))
        clearExamState()
        sessionStorage.removeItem('examQuestions')
        sessionStorage.removeItem('examTimeLimit')
        
        router.replace('/review')
      }
    } catch (error) {
      console.error('Complete exam error:', error)
      setIsSubmitting(false)
    }
  }, [examState, isSubmitting, router])
  
  // Handle time up
  const handleTimeUp = useCallback(() => {
    completeExam(true)
  }, [completeExam])
  
  // Handle exit attempt (fullscreen exit or tab switch)
  const handleExitAttempt = useCallback(() => {
    completeExam(true)
  }, [completeExam])
  
  // Handle option selection
  const handleSelectOption = (option: string) => {
    if (!examState) return
    
    setSelectedOption(option)
    
    // Update local state
    const newAnswers = { ...examState.answers, [examState.currentIndex]: option }
    const newState = { ...examState, answers: newAnswers }
    setExamState(newState)
    saveExamState(newState)
    
    // Save to server
    saveAnswer(examState.currentIndex, option)
  }
  
  // Handle next question
  const handleNextQuestion = () => {
    if (!examState || !selectedOption) return
    
    const isLastQuestion = examState.currentIndex === questions.length - 1
    
    if (isLastQuestion) {
      setShowConfirmModal(true)
    } else {
      // Move to next question
      const newState = {
        ...examState,
        currentIndex: examState.currentIndex + 1,
      }
      setExamState(newState)
      saveExamState(newState)
      setSelectedOption(newState.answers[newState.currentIndex] || null)
      setQuestionStartTime(Date.now())
    }
  }
  
  // Handle submit confirmation
  const handleConfirmSubmit = () => {
    setShowConfirmModal(false)
    completeExam(false)
  }
  
  // Loading state
  if (!examState || questions.length === 0) {
    return (
      <div className="min-h-screen bg-telink-bg flex items-center justify-center">
        <div className="text-telink-text-secondary animate-pulse">
          {MESSAGES.LOADING}
        </div>
      </div>
    )
  }
  
  const currentQuestion = questions[examState.currentIndex]
  const isLastQuestion = examState.currentIndex === questions.length - 1
  
  return (
    <FullscreenLock onExitAttempt={handleExitAttempt}>
      <div className="min-h-screen bg-telink-bg flex flex-col">
        {/* Header with progress and timer */}
        <ExamHeader
          currentQuestion={examState.currentIndex + 1}
          totalQuestions={questions.length}
          remainingSeconds={getRemainingSeconds()}
          onTimeUp={handleTimeUp}
        />
        
        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-3xl">
            {/* Question */}
            <QuestionCard
              question={currentQuestion}
              questionNumber={examState.currentIndex + 1}
              selectedOption={selectedOption}
              onSelectOption={handleSelectOption}
              isDisabled={isSubmitting}
            />
            
            {/* Navigation */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleNextQuestion}
                disabled={!selectedOption || isSubmitting}
                size="lg"
                isLoading={isSubmitting}
              >
                {isLastQuestion ? MESSAGES.SUBMIT_EXAM : MESSAGES.NEXT_QUESTION}
                {!isLastQuestion && (
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </main>
        
        {/* Confirm submit modal */}
        <ConfirmModal
          isOpen={showConfirmModal}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
          title={MESSAGES.SUBMIT_CONFIRM_TITLE}
          message={MESSAGES.SUBMIT_CONFIRM_MESSAGE}
          confirmText={MESSAGES.SUBMIT_CONFIRM_YES}
          cancelText={MESSAGES.SUBMIT_CONFIRM_NO}
          isLoading={isSubmitting}
        />
      </div>
    </FullscreenLock>
  )
}
