'use client'

import { useState } from 'react'
import { AnswerResult } from '@/types'
import { Card, CardContent } from '@/components/ui/Card'
import { AnswerOption } from '@/components/exam/AnswerOption'
import { cn } from '@/lib/utils'

interface ResultCardProps {
  result: AnswerResult
  questionNumber: number
}

export function ResultCard({ result, questionNumber }: ResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const questionType = result.questionType || 'multiple-choice'

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

      {/* Summary */}
      <div className="flex items-center gap-4 pt-4 border-t border-telink-border text-sm">
        <div>
          <span className="text-telink-text-secondary">Ditt svar: </span>
          <span className={cn(
            'font-medium',
            result.isCorrect ? 'text-status-correct' : 'text-status-incorrect'
          )}>
            {result.selectedOption || 'Ej besvarat'}
          </span>
        </div>
        {!result.isCorrect && (
          <div>
            <span className="text-telink-text-secondary">Rätt svar: </span>
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
      {/* True/False options */}
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
            <div className="text-xs mt-1 text-telink-text-secondary">Ditt svar</div>
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
            <div className="text-xs mt-1 text-telink-text-secondary">Ditt svar</div>
          )}
        </div>
      </div>

      {/* User's motivation if provided */}
      {result.writtenAnswer && (
        <div className="mb-4 p-3 rounded-lg bg-telink-bg-tertiary/50 border border-telink-border">
          <div className="text-sm font-medium text-telink-text-secondary mb-1">
            Din motivering:
          </div>
          <div className="text-telink-text italic">
            {result.writtenAnswer}
          </div>
        </div>
      )}

      {/* Explanation */}
      {result.explanation && (
        <div className="p-3 rounded-lg bg-telink-accent/10 border border-telink-accent/30">
          <div className="text-sm font-medium text-telink-accent mb-1">
            Förklaring:
          </div>
          <div className="text-telink-text">
            {result.explanation}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 pt-4 border-t border-telink-border text-sm mt-4">
        <div>
          <span className="text-telink-text-secondary">Ditt svar: </span>
          <span className={cn(
            'font-medium',
            result.isCorrect ? 'text-status-correct' : 'text-status-incorrect'
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
      {/* User's answer */}
      <div className="mb-4">
        <div className="text-sm font-medium text-telink-text-secondary mb-2">
          Ditt svar:
        </div>
        <div className={cn(
          'p-3 rounded-lg border-2',
          result.isCorrect
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

      {/* Status indicator */}
      <div className={cn(
        'flex items-center gap-2 p-3 rounded-lg mb-4',
        result.isCorrect
          ? 'bg-status-correct/10 text-status-correct'
          : result.isPartiallyCorrect
          ? 'bg-yellow-500/10 text-yellow-600'
          : 'bg-status-incorrect/10 text-status-incorrect'
      )}>
        {result.isCorrect ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Rätt! Ditt svar innehåller rätt nyckelord.</span>
          </>
        ) : result.isPartiallyCorrect ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">Delvis rätt. Några nyckelord saknas.</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-medium">Fel. Viktiga nyckelord saknas.</span>
          </>
        )}
      </div>

      {/* Example answer */}
      {result.exampleAnswer && (
        <div className="p-3 rounded-lg bg-telink-accent/10 border border-telink-accent/30">
          <div className="text-sm font-medium text-telink-accent mb-1">
            Exempelsvar:
          </div>
          <div className="text-telink-text italic">
            {result.exampleAnswer}
          </div>
        </div>
      )}

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
        result.isCorrect ? 'border-status-correct/30' : 'border-status-incorrect/30'
      )}
    >
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-telink-bg-tertiary/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              result.isCorrect
                ? 'bg-status-correct/20 text-status-correct'
                : result.isPartiallyCorrect
                ? 'bg-yellow-500/20 text-yellow-600'
                : 'bg-status-incorrect/20 text-status-incorrect'
            )}
          >
            {result.isCorrect ? (
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

          {/* Question info */}
          <div className="text-left">
            <span className="text-sm text-telink-text-secondary">
              Fråga {questionNumber}
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-telink-bg-tertiary">
                {questionType === 'multiple-choice' ? 'Flerval' : questionType === 'true-false' ? 'Sant/Falskt' : 'Skriftlig'}
              </span>
            </span>
            <p className="text-telink-text font-medium line-clamp-1 max-w-md">
              {result.questionText}
            </p>
          </div>
        </div>

        {/* Expand indicator */}
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

      {/* Expanded content */}
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
