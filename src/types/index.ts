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
export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D'
  text: string
}

export interface Question {
  id: number
  text: string
  options: QuestionOption[]
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  isFollowUp?: boolean
}

export interface ShuffledQuestion extends Omit<Question, 'correctAnswer'> {
  originalOrder: ('A' | 'B' | 'C' | 'D')[]
  shuffledCorrectIndex: number
}

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
  selectedOption: string
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
  options: QuestionOption[]
  selectedOption: string | null
  correctOption: string
  isCorrect: boolean
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
