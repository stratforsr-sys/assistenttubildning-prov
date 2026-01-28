'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { requestFullscreen, exitFullscreen, isFullscreen } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { MESSAGES } from '@/lib/constants'

interface FullscreenLockProps {
  children: React.ReactNode
  onExitAttempt: () => void
  warningSeconds?: number
}

export function FullscreenLock({
  children,
  onExitAttempt,
  warningSeconds = 10
}: FullscreenLockProps) {
  const [isInFullscreen, setIsInFullscreen] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(warningSeconds)
  const [showRulesModal, setShowRulesModal] = useState(true)
  const [rulesAccepted, setRulesAccepted] = useState(false)
  const [hasExited, setHasExited] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  // Handle fullscreen change
  const handleFullscreenChange = useCallback(() => {
    if (hasExited) return

    const fullscreen = isFullscreen()
    setIsInFullscreen(fullscreen)

    if (!fullscreen && rulesAccepted && !hasExited) {
      // User exited fullscreen - show warning
      setShowWarning(true)
      setCountdown(warningSeconds)

      // Clear any existing countdown
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }

      // Start countdown
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current!)
            countdownRef.current = null
            setHasExited(true)
            onExitAttempt()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      // User re-entered fullscreen
      setShowWarning(false)
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
        countdownRef.current = null
      }
    }
  }, [rulesAccepted, warningSeconds, onExitAttempt, hasExited])

  // Handle visibility change (tab switch)
  const handleVisibilityChange = useCallback(() => {
    if (hasExited) return

    if (document.hidden && rulesAccepted && !hasExited) {
      // User switched tab - show warning
      setShowWarning(true)
      setCountdown(warningSeconds)

      // Clear any existing countdown
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }

      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current!)
            countdownRef.current = null
            setHasExited(true)
            onExitAttempt()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (!document.hidden) {
      // Only clear warning if back in fullscreen
      if (isFullscreen()) {
        setShowWarning(false)
        if (countdownRef.current) {
          clearInterval(countdownRef.current)
          countdownRef.current = null
        }
      }
    }
  }, [rulesAccepted, warningSeconds, onExitAttempt, hasExited])
  
  // Setup event listeners
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }
  }, [handleFullscreenChange, handleVisibilityChange])
  
  // Block keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block common exit shortcuts
      if (
        e.key === 'Escape' ||
        (e.ctrlKey && e.key === 'w') ||
        (e.ctrlKey && e.key === 't') ||
        (e.altKey && e.key === 'Tab') ||
        (e.metaKey && e.key === 'Tab')
      ) {
        e.preventDefault()
      }
    }
    
    if (rulesAccepted) {
      document.addEventListener('keydown', handleKeyDown)
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [rulesAccepted])
  
  // Enter fullscreen
  const enterFullscreen = async () => {
    if (containerRef.current) {
      try {
        await requestFullscreen(containerRef.current)
        setIsInFullscreen(true)
      } catch (error) {
        console.error('Failed to enter fullscreen:', error)
      }
    }
  }
  
  // Handle rules acceptance
  const handleAcceptRules = async () => {
    setRulesAccepted(true)
    setShowRulesModal(false)
    await enterFullscreen()
  }
  
  // Return to fullscreen
  const returnToFullscreen = async () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }
    setShowWarning(false)
    await enterFullscreen()
  }
  
  return (
    <div ref={containerRef} className="min-h-screen bg-telink-bg">
      {/* Rules Modal */}
      <Modal
        isOpen={showRulesModal}
        onClose={() => {}}
        title={MESSAGES.EXAM_RULES_TITLE}
        showCloseButton={false}
      >
        <div className="space-y-4 mb-6">
          <ul className="space-y-3">
            {MESSAGES.EXAM_RULES.map((rule, index) => (
              <li key={index} className="flex items-start gap-3 text-telink-text-secondary">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-telink-accent/20 text-telink-accent flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button onClick={handleAcceptRules} className="w-full">
          {MESSAGES.EXAM_RULES_CONFIRM}
        </Button>
      </Modal>
      
      {/* Fullscreen prompt */}
      {!showRulesModal && !isInFullscreen && !showWarning && (
        <div className="fixed inset-0 bg-telink-bg flex items-center justify-center p-4 z-50">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-telink-accent/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-telink-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-telink-text mb-2">
              {MESSAGES.FULLSCREEN_REQUIRED}
            </h2>
            <p className="text-telink-text-secondary mb-6">
              {MESSAGES.FULLSCREEN_MESSAGE}
            </p>
            <Button onClick={enterFullscreen}>
              {MESSAGES.FULLSCREEN_BUTTON}
            </Button>
          </div>
        </div>
      )}
      
      {/* Warning overlay */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-status-warning/20 flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-status-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {MESSAGES.FULLSCREEN_WARNING}
            </h2>
            <p className="text-4xl font-bold text-status-warning mb-6 font-mono">
              {countdown}
            </p>
            <p className="text-white/70 mb-6">
              {MESSAGES.FULLSCREEN_COUNTDOWN.replace('{seconds}', countdown.toString())}
            </p>
            <Button onClick={returnToFullscreen}>
              Återgå till provet
            </Button>
          </div>
        </div>
      )}
      
      {/* Main content */}
      {rulesAccepted && isInFullscreen && !showWarning && children}
    </div>
  )
}
