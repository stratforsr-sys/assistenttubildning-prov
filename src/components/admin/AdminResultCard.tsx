'use client'

import { useState } from 'react'
import { AnswerResult } from '@/types'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AnswerOption } from '@/components/exam/AnswerOption'
import { cn } from '@/lib/utils'

interface AdminResultCardProps {
  result: AnswerResult
  questionNumber: number
  attemptId: string
  onGradeChange?: (questionId: number, isCorrect: boolean, newTotals: { totalCorrect: number; totalScore: number }) => void
}

export function AdminResultCard({ result, questionNumber, attemptId, onGradeChange }: AdminResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isGrading, setIsGrading] = useState(false)
  const [localIsCorrect, setLocalIsCorrect] = useState(result.isCorrect)

  const questionType = result.questionType || 'multiple-choice'
  const isWrittenOrTrueFalse = questionType === 'written' || questionType === 'true-false'

  const handleGrade = async (isCorrect: boolean) => {
    if (isGrading) return

    setIsGrading(true)
    try {
      const res = await fetch('/api/admin/grade-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          questionId: result.questionId,
          isCorrect,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setLocalIsCorrect(isCorrect)
        if (onGradeChange) {
          onGradeChange(result.questionId, isCorrect, {
            totalCorrect: data.data.totalCorrect,
            totalScore: data.data.totalScore,
          })
        }
      }
    } catch (error) {
      console.error('Grade error:', error)
    } finally {
      setIsGrading(false)
    }
  }

  const renderMultipleChoiceContent = () => (
    <>
      <div className="space-y-3 mb-4">
        {result.options?.map((option) => (
          <AnswerOption
            key={option.key}
            optionKey={option.key}
            text={option.text}
            isSelected={false}
            onClick={() => {}}
            showResult={true}
            isCorrect={option.key === result.correctOption}
            isUserAnswer={option.key === result.selectedOption}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-telink-border text-sm">
        <div>
          <span className="text-telink-text-secondary">Svarat: </span>
          <span className={cn(
            'font-medium',
            localIsCorrect ? 'text-status-correct' : 'text-status-incorrect'
          )}>
            {result.selectedOption || 'Ej besvarat'}
          </span>
        </div>
        {!localIsCorrect && (
          <div>
            <span className="text-telink-text-secondary">Rätt: </span>
            <span className="font-medium text-status-correct">
              {result.correctOption}
            </span>
          </div>
        )}
        <div className="ml-auto text-telink-text-muted">
          Tid: {result.timeSpent}s
        </div>
      </div>
    </>
  )

  const renderTrueFalseContent = () => (
    <>
      <div className="flex gap-4 mb-4">
        <div className={cn(
          'flex-1 p-4 rounded-xl border-2 text-center',
          result.correctOption === 'true'
            ? 'border-status-correct bg-status-correct/10'
            : result.selectedOption === 'true'
            ? 'border-status-incorrect bg-status-incorrect/10'
            : 'border-telink-border'
        )}>
          <span className="text-2xl mb-1 block">✓</span>
          <span className="font-medium">Sant</span>
          {result.selectedOption === 'true' && (
            <div className="text-xs mt-1 text-telink-text-secondary">Deltagarens svar</div>
          )}
        </div>
        <div className={cn(
          'flex-1 p-4 rounded-xl border-2 text-center',
          result.correctOption === 'false'
            ? 'border-status-correct bg-status-correct/10'
            : result.selectedOption === 'false'
            ? 'border-status-incorrect bg-status-incorrect/10'
            : 'border-telink-border'
        )}>
          <span className="text-2xl mb-1 block">✗</span>
          <span className="font-medium">Falskt</span>
          {result.selectedOption === 'false' && (
            <div className="text-xs mt-1 text-telink-text-secondary">Deltagarens svar</div>
          )}
        </div>
      </div>

      {result.writtenAnswer && (
        <div className="mb-4 p-3 rounded-lg bg-telink-bg-tertiary/50 border border-telink-border">
          <div className="text-sm font-medium text-telink-text-secondary mb-1">
            Motivering:
          </div>
          <div className="text-telink-text italic">
            {result.writtenAnswer}
          </div>
        </div>
      )}

      {result.explanation && (
        <div className="p-3 rounded-lg bg-telink-accent/10 border border-telink-accent/30 mb-4">
          <div className="text-sm font-medium text-telink-accent mb-1">
            Förklaring:
          </div>
          <div className="text-telink-text">
            {result.explanation}
          </div>
        </div>
      )}

      {/* Manual grading buttons */}
      <div className="p-3 rounded-lg bg-telink-bg-tertiary border border-telink-border">
        <div className="text-sm font-medium text-telink-text-secondary mb-2">
          Manuell bedömning:
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={localIsCorrect ? 'primary' : 'secondary'}
            onClick={() => handleGrade(true)}
            disabled={isGrading}
            className={cn(
              localIsCorrect && 'bg-status-correct hover:bg-status-correct/90 border-status-correct'
            )}
          >
            {isGrading ? '...' : 'Godkänn'}
          </Button>
          <Button
            size="sm"
            variant={!localIsCorrect ? 'primary' : 'secondary'}
            onClick={() => handleGrade(false)}
            disabled={isGrading}
            className={cn(
              !localIsCorrect && 'bg-status-incorrect hover:bg-status-incorrect/90 border-status-incorrect'
            )}
          >
            {isGrading ? '...' : 'Underkänn'}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-telink-border text-sm mt-4">
        <div>
          <span className="text-telink-text-secondary">Svarat: </span>
          <span className={cn(
            'font-medium',
            localIsCorrect ? 'text-status-correct' : 'text-status-incorrect'
          )}>
            {result.selectedOption === 'true' ? 'Sant' : result.selectedOption === 'false' ? 'Falskt' : 'Ej besvarat'}
          </span>
        </div>
        <div className="ml-auto text-telink-text-muted">
          Tid: {result.timeSpent}s
        </div>
      </div>
    </>
  )

  const renderWrittenContent = () => (
    <>
      <div className="mb-4">
        <div className="text-sm font-medium text-telink-text-secondary mb-2">
          Deltagarens svar:
        </div>
        <div className={cn(
          'p-3 rounded-lg border-2',
          localIsCorrect
            ? 'border-status-correct bg-status-correct/5'
            : result.isPartiallyCorrect
            ? 'border-yellow-500 bg-yellow-500/5'
            : 'border-status-incorrect bg-status-incorrect/5'
        )}>
          <p className="text-telink-text">
            {result.writtenAnswer || 'Ej besvarat'}
          </p>
        </div>
      </div>

      {/* Accepted keywords */}
      {result.acceptedKeywords && result.acceptedKeywords.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-telink-bg-tertiary border border-telink-border">
          <div className="text-sm font-medium text-telink-text-secondary mb-2">
            Nyckelord som ska finnas:
          </div>
          <div className="flex flex-wrap gap-2">
            {result.acceptedKeywords.map((keyword, idx) => (
              <span
                key={idx}
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  result.writtenAnswer?.toLowerCase().includes(keyword.toLowerCase())
                    ? 'bg-status-correct/20 text-status-correct'
                    : 'bg-status-incorrect/20 text-status-incorrect'
                )}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.exampleAnswer && (
        <div className="p-3 rounded-lg bg-telink-accent/10 border border-telink-accent/30 mb-4">
          <div className="text-sm font-medium text-telink-accent mb-1">
            Exempelsvar:
          </div>
          <div className="text-telink-text italic">
            {result.exampleAnswer}
          </div>
        </div>
      )}

      {/* Manual grading buttons */}
      <div className="p-3 rounded-lg bg-telink-bg-tertiary border border-telink-border">
        <div className="text-sm font-medium text-telink-text-secondary mb-2">
          Manuell bedömning:
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={localIsCorrect ? 'primary' : 'secondary'}
            onClick={() => handleGrade(true)}
            disabled={isGrading}
            className={cn(
              localIsCorrect && 'bg-status-correct hover:bg-status-correct/90 border-status-correct'
            )}
          >
            {isGrading ? '...' : 'Godkänn'}
          </Button>
          <Button
            size="sm"
            variant={!localIsCorrect ? 'primary' : 'secondary'}
            onClick={() => handleGrade(false)}
            disabled={isGrading}
            className={cn(
              !localIsCorrect && 'bg-status-incorrect hover:bg-status-incorrect/90 border-status-incorrect'
            )}
          >
            {isGrading ? '...' : 'Underkänn'}
          </Button>
        </div>
      </div>

      <div className="flex items-center pt-4 border-t border-telink-border text-sm mt-4">
        <div className="ml-auto text-telink-text-muted">
          Tid: {result.timeSpent}s
        </div>
      </div>
    </>
  )

  return (
    <Card
      variant="glass"
      className={cn(
        'overflow-hidden transition-all duration-300',
        localIsCorrect ? 'border-status-correct/30' : 'border-status-incorrect/30'
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-telink-bg-tertiary/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              localIsCorrect
                ? 'bg-status-correct/20 text-status-correct'
                : result.isPartiallyCorrect
                ? 'bg-yellow-500/20 text-yellow-600'
                : 'bg-status-incorrect/20 text-status-incorrect'
            )}
          >
            {localIsCorrect ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : result.isPartiallyCorrect ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          <div className="text-left">
            <span className="text-sm text-telink-text-secondary">
              Fråga {questionNumber}
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-telink-bg-tertiary">
                {questionType === 'multiple-choice' ? 'Flerval' : questionType === 'true-false' ? 'Sant/Falskt' : 'Skriftlig'}
              </span>
              {isWrittenOrTrueFalse && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-telink-accent/20 text-telink-accent">
                  Kan bedömas manuellt
                </span>
              )}
            </span>
            <p className="text-telink-text font-medium line-clamp-1 max-w-md">
              {result.questionText}
            </p>
          </div>
        </div>

        <svg
          className={cn(
            'w-5 h-5 text-telink-text-secondary transition-transform duration-300',
            isExpanded && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <CardContent className="pt-0 border-t border-telink-border">
          <h3 className="text-lg font-semibold text-telink-text mb-4">
            {result.questionText}
          </h3>

          {questionType === 'multiple-choice' && renderMultipleChoiceContent()}
          {questionType === 'true-false' && renderTrueFalseContent()}
          {questionType === 'written' && renderWrittenContent()}
        </CardContent>
      )}
    </Card>
  )
}
