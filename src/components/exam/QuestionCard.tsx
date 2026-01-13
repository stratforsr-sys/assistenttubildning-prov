'use client'

import { ShuffledQuestion } from '@/types'
import { Card, CardContent } from '@/components/ui/Card'
import { AnswerOption } from './AnswerOption'

interface QuestionCardProps {
  question: ShuffledQuestion
  questionNumber: number
  selectedOption: string | null
  onSelectOption: (option: string) => void
  isDisabled?: boolean
}

export function QuestionCard({
  question,
  questionNumber,
  selectedOption,
  onSelectOption,
  isDisabled = false,
}: QuestionCardProps) {
  return (
    <Card variant="glass" className="animate-fade-in-up">
      <CardContent className="p-6 md:p-8">
        {/* Question number badge */}
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-telink-accent/10 text-telink-accent rounded-full text-sm font-medium">
            Fråga {questionNumber}
          </span>
        </div>
        
        {/* Question text */}
        <h2 className="text-xl md:text-2xl font-bold text-telink-text mb-8 leading-relaxed">
          {question.text}
        </h2>
        
        {/* Answer options */}
        <div className="space-y-3">
          {question.options.map((option) => (
            <AnswerOption
              key={option.key}
              optionKey={option.key}
              text={option.text}
              isSelected={selectedOption === option.key}
              isDisabled={isDisabled}
              onClick={() => onSelectOption(option.key)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
