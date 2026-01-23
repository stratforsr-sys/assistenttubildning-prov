// ===========================================
// TELINK EXAM PLATFORM - TYPE DEFINITIONS
// ===========================================

// Database types
export interface ExamCode {
  id: string
  code: string
  name: string
  isActive: boolean
  createdAt: Date
  expiresAt: Date | null
}

export interface Participant {
  id: string
  firstName: string
  lastName: string
  fullNameNormalized: string
  createdAt: Date
}

export interface Attempt {
  id: string
  participantId: string
  examCodeId: string
  startedAt: Date
  completedAt: Date | null
  totalScore: number | null
  totalCorrect: number | null
  totalQuestions: number
  totalTimeSeconds: number | null
  isCompleted: boolean
  isTimedOut: boolean
}

export interface Answer {
  id: string
  attemptId: string
  questionId: number
  selectedOption: string | null
  isCorrect: boolean | null
  timeSpentSeconds: number | null
  answeredAt: Date
}

// Question types
export type QuestionType = 'multiple-choice' | 'true-false' | 'written'

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D'
  text: string
}

export interface TrueFalseOption {
  key: 'true' | 'false'
  text: string
}

// Base question interface
export interface BaseQuestion {
  id: number
  text: string
  type: QuestionType
  isFollowUp?: boolean
}

// Multiple choice question (A, B, C, D)
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice'
  options: QuestionOption[]
  correctAnswer: 'A' | 'B' | 'C' | 'D'
}

// True/False question with motivation
export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false'
  correctAnswer: 'true' | 'false'
  acceptedKeywords: string[] // Keywords that should appear in motivation
  explanation: string // Shown after exam
}

// Written answer question (short text)
export interface WrittenQuestion extends BaseQuestion {
  type: 'written'
  acceptedKeywords: string[] // Keywords that should appear in answer
  exampleAnswer: string // Shown after exam
  maxLength?: number // Max characters (default 200)
}

// Union type for all questions
export type Question = MultipleChoiceQuestion | TrueFalseQuestion | WrittenQuestion

// Legacy interface for backward compatibility
export interface LegacyQuestion {
  id: number
  text: string
  options: QuestionOption[]
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  isFollowUp?: boolean
}

// Shuffled question for exam (multiple choice)
export interface ShuffledMultipleChoiceQuestion {
  id: number
  text: string
  type: 'multiple-choice'
  options: QuestionOption[]
  originalOrder: ('A' | 'B' | 'C' | 'D')[]
  shuffledCorrectIndex: number
  isFollowUp?: boolean
}

// Shuffled true/false question
export interface ShuffledTrueFalseQuestion {
  id: number
  text: string
  type: 'true-false'
  isFollowUp?: boolean
}

// Shuffled written question
export interface ShuffledWrittenQuestion {
  id: number
  text: string
  type: 'written'
  maxLength?: number
  isFollowUp?: boolean
}

// Union type for shuffled questions
export type ShuffledQuestion = ShuffledMultipleChoiceQuestion | ShuffledTrueFalseQuestion | ShuffledWrittenQuestion

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ValidateCodeResponse {
  valid: boolean
  examCodeId?: string
  examName?: string
}

export interface StartExamResponse {
  attemptId: string
  questions: ShuffledQuestion[]
  timeLimit: number
}

export interface SubmitAnswerRequest {
  attemptId: string
  questionId: number
  selectedOption: string // For multiple-choice: 'A'/'B'/'C'/'D', for true-false: 'true'/'false'
  writtenAnswer?: string // For written and true-false motivation
  timeSpent: number
}

export interface CompleteExamRequest {
  attemptId: string
  isTimedOut?: boolean
}

export interface ExamResult {
  attemptId: string
  totalScore: number
  totalCorrect: number
  totalQuestions: number
  totalTimeSeconds: number
  percentage: number
  answers: AnswerResult[]
}

export interface AnswerResult {
  questionId: number
  questionText: string
  questionType: QuestionType
  options?: QuestionOption[] // For multiple-choice
  selectedOption: string | null
  writtenAnswer?: string | null // For written and true-false motivation
  correctOption?: string // For multiple-choice and true-false
  acceptedKeywords?: string[] // For written questions
  exampleAnswer?: string // For written questions
  explanation?: string // For true-false questions
  isCorrect: boolean
  isPartiallyCorrect?: boolean // For written answers with some keywords
  timeSpent: number
}

// Admin types
export interface AdminStats {
  totalParticipants: number
  averageScore: number
  medianScore: number
  minScore: number
  maxScore: number
  averageTime: number
  completionRate: number
}

export interface ParticipantAttempt {
  id: string
  participantName: string
  date: Date
  score: number
  totalCorrect: number
  totalQuestions: number
  timeSeconds: number
  isTimedOut: boolean
}

export interface QuestionStats {
  questionId: number
  questionText: string
  correctPercentage: number
  optionDistribution: {
    option: string
    count: number
    percentage: number
  }[]
  difficulty: 'easy' | 'medium' | 'hard'
  mostCommonWrongAnswer: string | null
}

export interface ScoreDistribution {
  range: string
  count: number
}

export interface TimeVsScoreData {
  time: number
  score: number
  name: string
}

export interface TrendData {
  date: string
  averageScore: number
  count: number
}

// Session types
export interface AdminSession {
  id: string
  email: string
  expiresAt: Date
}

// Form types
export interface ParticipantLoginForm {
  examCode: string
  firstName: string
  lastName: string
}

export interface AdminLoginForm {
  email: string
  password: string
}

// Exam state types
export interface ExamState {
  attemptId: string
  currentQuestionIndex: number
  questions: ShuffledQuestion[]
  answers: Map<number, string>
  startTime: number
  timeLimit: number
  isFullscreen: boolean
}

export interface TimerState {
  remainingSeconds: number
  isWarning: boolean
  isPaused: boolean
}
