'use client'

import { ShuffledQuestion, ShuffledMultipleChoiceQuestion, ShuffledTrueFalseQuestion, ShuffledWrittenQuestion } from '@/types'
import { Card, CardContent } from '@/components/ui/Card'
import { AnswerOption } from './AnswerOption'
import { TrueFalseOption } from './TrueFalseOption'
import { WrittenAnswer } from './WrittenAnswer'
import { MotivationInput } from './MotivationInput'

interface QuestionCardProps {
  question: ShuffledQuestion
  questionNumber: number
  selectedOption: string | null
  writtenAnswer?: string
  motivation?: string
  onSelectOption: (option: string) => void
  onWrittenAnswerChange?: (answer: string) => void
  onMotivationChange?: (motivation: string) => void
  isDisabled?: boolean
}

export function QuestionCard({
  question,
  questionNumber,
  selectedOption,
  writtenAnswer = '',
  motivation = '',
  onSelectOption,
  onWrittenAnswerChange,
  onMotivationChange,
  isDisabled = false,
}: QuestionCardProps) {
  const getQuestionTypeBadge = () => {
    switch (question.type) {
      case 'multiple-choice':
        return { text: 'Flerval', color: 'bg-telink-accent/10 text-telink-accent' }
      case 'true-false':
        return { text: 'Sant/Falskt', color: 'bg-purple-500/10 text-purple-400' }
      case 'written':
        return { text: 'Skriftligt svar', color: 'bg-amber-500/10 text-amber-400' }
      default:
        return { text: 'Fråga', color: 'bg-telink-accent/10 text-telink-accent' }
    }
  }

  const badge = getQuestionTypeBadge()

  return (
    <Card variant="glass" className="animate-fade-in-up">
      <CardContent className="p-6 md:p-8">
        {/* Question header with number and type badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-telink-accent/10 text-telink-accent rounded-full text-sm font-medium">
            Fråga {questionNumber}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
            {badge.text}
          </span>
        </div>

        {/* Question text */}
        <h2 className="text-xl md:text-2xl font-bold text-telink-text mb-8 leading-relaxed">
          {question.text}
        </h2>

        {/* Answer section - based on question type */}
        {question.type === 'multiple-choice' && (
          <MultipleChoiceSection
            question={question as ShuffledMultipleChoiceQuestion}
            selectedOption={selectedOption}
            onSelectOption={onSelectOption}
            isDisabled={isDisabled}
          />
        )}

        {question.type === 'true-false' && (
          <TrueFalseSection
            question={question as ShuffledTrueFalseQuestion}
            selectedOption={selectedOption}
            motivation={motivation}
            onSelectOption={onSelectOption}
            onMotivationChange={onMotivationChange}
            isDisabled={isDisabled}
          />
        )}

        {question.type === 'written' && (
          <WrittenSection
            question={question as ShuffledWrittenQuestion}
            writtenAnswer={writtenAnswer}
            onWrittenAnswerChange={onWrittenAnswerChange}
            isDisabled={isDisabled}
          />
        )}
      </CardContent>
    </Card>
  )
}

// Multiple choice section
interface MultipleChoiceSectionProps {
  question: ShuffledMultipleChoiceQuestion
  selectedOption: string | null
  onSelectOption: (option: string) => void
  isDisabled: boolean
}

function MultipleChoiceSection({
  question,
  selectedOption,
  onSelectOption,
  isDisabled,
}: MultipleChoiceSectionProps) {
  return (
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
  )
}

// True/False section
interface TrueFalseSectionProps {
  question: ShuffledTrueFalseQuestion
  selectedOption: string | null
  motivation?: string
  onSelectOption: (option: string) => void
  onMotivationChange?: (motivation: string) => void
  isDisabled: boolean
}

function TrueFalseSection({
  question,
  selectedOption,
  motivation = '',
  onSelectOption,
  onMotivationChange,
  isDisabled,
}: TrueFalseSectionProps) {
  return (
    <div className="space-y-6">
      {/* True/False buttons */}
      <div className="grid grid-cols-2 gap-4">
        <TrueFalseOption
          isTrue={true}
          isSelected={selectedOption === 'true'}
          isDisabled={isDisabled}
          onClick={() => onSelectOption('true')}
        />
        <TrueFalseOption
          isTrue={false}
          isSelected={selectedOption === 'false'}
          isDisabled={isDisabled}
          onClick={() => onSelectOption('false')}
        />
      </div>

      {/* Motivation input */}
      {selectedOption && onMotivationChange && (
        <MotivationInput
          value={motivation}
          onChange={onMotivationChange}
          isDisabled={isDisabled}
        />
      )}
    </div>
  )
}

// Written answer section
interface WrittenSectionProps {
  question: ShuffledWrittenQuestion
  writtenAnswer: string
  onWrittenAnswerChange?: (answer: string) => void
  isDisabled: boolean
}

function WrittenSection({
  question,
  writtenAnswer,
  onWrittenAnswerChange,
  isDisabled,
}: WrittenSectionProps) {
  return (
    <WrittenAnswer
      value={writtenAnswer}
      onChange={onWrittenAnswerChange || (() => {})}
      maxLength={question.maxLength}
      isDisabled={isDisabled}
    />
  )
}
