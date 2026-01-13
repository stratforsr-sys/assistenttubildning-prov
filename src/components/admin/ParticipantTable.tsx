'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { formatDate, formatTimeMinutes, cn } from '@/lib/utils'
import { ParticipantAttempt } from '@/types'

interface ParticipantTableProps {
  attempts: ParticipantAttempt[]
  onView: (attemptId: string) => void
  onDelete: (attemptId: string) => void
}

export function ParticipantTable({ attempts, onView, onDelete }: ParticipantTableProps) {
  const [sortKey, setSortKey] = useState<'date' | 'score' | 'time'>('date')
  const [sortAsc, setSortAsc] = useState(false)
  
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
          {sortedAttempts.map((attempt) => (
            <tr 
              key={attempt.id} 
              className="border-b border-telink-border/50 hover:bg-telink-bg-tertiary/30 transition-colors"
            >
              <td className="py-4 px-4">
                <span className="font-medium text-telink-text">
                  {attempt.participantName}
                </span>
                {attempt.isTimedOut && (
                  <span className="ml-2 text-xs bg-status-warning/20 text-status-warning px-2 py-0.5 rounded-full">
                    Timeout
                  </span>
                )}
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
              <td className="py-4 px-4 text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onView(attempt.id)}
                >
                  Visa
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
          ))}
        </tbody>
      </table>
    </div>
  )
}
