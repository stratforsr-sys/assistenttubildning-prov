'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { formatDate, formatTimeMinutes, cn } from '@/lib/utils'
import { ParticipantAttempt, AnswerResult } from '@/types'

interface ParticipantTableProps {
  attempts: ParticipantAttempt[]
  onView: (attemptId: string) => void
  onDelete: (attemptId: string) => void
}

interface ExpandedAttempt {
  id: string
  answers: AnswerResult[]
  isLoading: boolean
  error: string | null
}

export function ParticipantTable({ attempts, onView, onDelete }: ParticipantTableProps) {
  const [sortKey, setSortKey] = useState<'date' | 'score' | 'time'>('date')
  const [sortAsc, setSortAsc] = useState(false)
  const [expandedAttempts, setExpandedAttempts] = useState<Record<string, ExpandedAttempt>>({})

  const sortedAttempts = [...attempts].sort((a, b) => {
    let comparison = 0
    switch (sortKey) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case 'score':
        comparison = a.score - b.score
        break
      case 'time':
        comparison = a.timeSeconds - b.timeSeconds
        break
    }
    return sortAsc ? comparison : -comparison
  })

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  const toggleExpand = async (attemptId: string) => {
    // If already expanded, collapse
    if (expandedAttempts[attemptId]) {
      const newExpanded = { ...expandedAttempts }
      delete newExpanded[attemptId]
      setExpandedAttempts(newExpanded)
      return
    }

    // Set loading state
    setExpandedAttempts(prev => ({
      ...prev,
      [attemptId]: { id: attemptId, answers: [], isLoading: true, error: null }
    }))

    try {
      const res = await fetch(`/api/admin/attempt/${attemptId}`)
      const data = await res.json()

      if (data.success) {
        setExpandedAttempts(prev => ({
          ...prev,
          [attemptId]: { id: attemptId, answers: data.data.answers, isLoading: false, error: null }
        }))
      } else {
        setExpandedAttempts(prev => ({
          ...prev,
          [attemptId]: { id: attemptId, answers: [], isLoading: false, error: data.error || 'Kunde inte hämta svar' }
        }))
      }
    } catch (error) {
      console.error('Fetch answers error:', error)
      setExpandedAttempts(prev => ({
        ...prev,
        [attemptId]: { id: attemptId, answers: [], isLoading: false, error: 'Ett fel uppstod vid hämtning av svar' }
      }))
    }
  }

  const SortIcon = ({ active, asc }: { active: boolean; asc: boolean }) => (
    <span className={cn('ml-1', active ? 'text-telink-accent' : 'text-telink-text-muted')}>
      {active ? (asc ? '↑' : '↓') : '↕'}
    </span>
  )

  if (attempts.length === 0) {
    return (
      <div className="text-center py-12 text-telink-text-secondary">
        Inga deltagare ännu
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-telink-border">
            <th className="text-left text-sm font-semibold text-telink-text-secondary py-3 px-4">
              Namn
            </th>
            <th
              className="text-left text-sm font-semibold text-telink-text-secondary py-3 px-4 cursor-pointer hover:text-telink-text"
              onClick={() => handleSort('date')}
            >
              Datum
              <SortIcon active={sortKey === 'date'} asc={sortAsc} />
            </th>
            <th
              className="text-left text-sm font-semibold text-telink-text-secondary py-3 px-4 cursor-pointer hover:text-telink-text"
              onClick={() => handleSort('score')}
            >
              Poäng
              <SortIcon active={sortKey === 'score'} asc={sortAsc} />
            </th>
            <th
              className="text-left text-sm font-semibold text-telink-text-secondary py-3 px-4 cursor-pointer hover:text-telink-text"
              onClick={() => handleSort('time')}
            >
              Tid
              <SortIcon active={sortKey === 'time'} asc={sortAsc} />
            </th>
            <th className="text-right text-sm font-semibold text-telink-text-secondary py-3 px-4">
              Åtgärder
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedAttempts.map((attempt) => {
            const expanded = expandedAttempts[attempt.id]
            const isExpanded = !!expanded

            return (
              <>
                <tr
                  key={attempt.id}
                  className={cn(
                    "border-b border-telink-border/50 hover:bg-telink-bg-tertiary/30 transition-colors cursor-pointer",
                    isExpanded && "bg-telink-bg-tertiary/20"
                  )}
                  onClick={() => toggleExpand(attempt.id)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <svg
                        className={cn(
                          "w-4 h-4 text-telink-text-secondary transition-transform",
                          isExpanded && "rotate-90"
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="font-medium text-telink-text">
                        {attempt.participantName}
                      </span>
                      {attempt.isTimedOut && (
                        <span className="ml-2 text-xs bg-status-warning/20 text-status-warning px-2 py-0.5 rounded-full">
                          Timeout
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-telink-text-secondary">
                    {formatDate(attempt.date)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      'font-semibold',
                      attempt.score >= 80 ? 'text-status-correct' :
                        attempt.score >= 50 ? 'text-status-warning' :
                          'text-status-incorrect'
                    )}>
                      {attempt.totalCorrect}/{attempt.totalQuestions}
                    </span>
                    <span className="text-telink-text-muted ml-2">
                      ({attempt.score}%)
                    </span>
                  </td>
                  <td className="py-4 px-4 text-telink-text-secondary">
                    {formatTimeMinutes(attempt.timeSeconds)}
                  </td>
                  <td className="py-4 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(attempt.id)}
                    >
                      Detaljer
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-status-incorrect hover:text-status-incorrect hover:bg-status-incorrect/10"
                      onClick={() => onDelete(attempt.id)}
                    >
                      Radera
                    </Button>
                  </td>
                </tr>

                {/* Expanded row with answers */}
                {isExpanded && (
                  <tr key={`${attempt.id}-expanded`}>
                    <td colSpan={5} className="bg-telink-bg-tertiary/30 px-4 py-4">
                      {expanded.isLoading ? (
                        <div className="text-center py-8 text-telink-text-secondary animate-pulse">
                          Laddar svar...
                        </div>
                      ) : expanded.error ? (
                        <div className="text-center py-8 text-status-incorrect">
                          {expanded.error}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-telink-text mb-4">
                            Svar från {attempt.participantName}
                          </h4>
                          {expanded.answers.map((answer, idx) => (
                            <div
                              key={answer.questionId}
                              className={cn(
                                "p-4 rounded-lg border",
                                answer.isCorrect
                                  ? "border-status-correct/30 bg-status-correct/5"
                                  : "border-status-incorrect/30 bg-status-incorrect/5"
                              )}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-telink-text-secondary">
                                      Fråga {idx + 1}
                                    </span>
                                    <span className={cn(
                                      "text-xs px-2 py-0.5 rounded-full",
                                      answer.questionType === 'multiple-choice'
                                        ? "bg-blue-500/20 text-blue-400"
                                        : answer.questionType === 'true-false'
                                          ? "bg-purple-500/20 text-purple-400"
                                          : "bg-orange-500/20 text-orange-400"
                                    )}>
                                      {answer.questionType === 'multiple-choice' ? 'Flerval' :
                                        answer.questionType === 'true-false' ? 'Sant/Falskt' : 'Skriftlig'}
                                    </span>
                                    <span className={cn(
                                      "text-xs px-2 py-0.5 rounded-full font-medium",
                                      answer.isCorrect
                                        ? "bg-status-correct/20 text-status-correct"
                                        : "bg-status-incorrect/20 text-status-incorrect"
                                    )}>
                                      {answer.isCorrect ? 'Rätt' : 'Fel'}
                                    </span>
                                  </div>
                                  <p className="text-telink-text font-medium mb-2">
                                    {answer.questionText}
                                  </p>

                                  {/* Show answer based on question type */}
                                  {answer.questionType === 'multiple-choice' && (
                                    <div className="text-sm space-y-1">
                                      <div>
                                        <span className="text-telink-text-secondary">Svarat: </span>
                                        <span className={cn(
                                          "font-medium",
                                          answer.isCorrect ? "text-status-correct" : "text-status-incorrect"
                                        )}>
                                          {answer.selectedOption || 'Ej besvarat'}
                                        </span>
                                      </div>
                                      {!answer.isCorrect && answer.correctOption && (
                                        <div>
                                          <span className="text-telink-text-secondary">Rätt svar: </span>
                                          <span className="font-medium text-status-correct">
                                            {answer.correctOption}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {answer.questionType === 'true-false' && (
                                    <div className="text-sm space-y-1">
                                      <div>
                                        <span className="text-telink-text-secondary">Svarat: </span>
                                        <span className={cn(
                                          "font-medium",
                                          answer.isCorrect ? "text-status-correct" : "text-status-incorrect"
                                        )}>
                                          {answer.selectedOption === 'true' ? 'Sant' :
                                            answer.selectedOption === 'false' ? 'Falskt' : 'Ej besvarat'}
                                        </span>
                                      </div>
                                      {!answer.isCorrect && answer.correctOption && (
                                        <div>
                                          <span className="text-telink-text-secondary">Rätt svar: </span>
                                          <span className="font-medium text-status-correct">
                                            {answer.correctOption === 'true' ? 'Sant' : 'Falskt'}
                                          </span>
                                        </div>
                                      )}
                                      {answer.writtenAnswer && (
                                        <div className="mt-2 p-2 bg-telink-bg-tertiary rounded">
                                          <span className="text-telink-text-secondary">Motivering: </span>
                                          <span className="text-telink-text italic">{answer.writtenAnswer}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {answer.questionType === 'written' && (
                                    <div className="text-sm space-y-2">
                                      <div className="p-2 bg-telink-bg-tertiary rounded">
                                        <span className="text-telink-text-secondary">Svar: </span>
                                        <span className="text-telink-text">
                                          {answer.writtenAnswer || 'Ej besvarat'}
                                        </span>
                                      </div>
                                      {answer.exampleAnswer && (
                                        <div className="p-2 bg-telink-accent/10 rounded">
                                          <span className="text-telink-accent text-xs font-medium">Exempelsvar: </span>
                                          <span className="text-telink-text text-xs italic">{answer.exampleAnswer}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
