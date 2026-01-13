// ===========================================
// TELINK EXAM PLATFORM - DATABASE SCHEMA
// ===========================================

import { 
  pgTable, 
  uuid, 
  varchar, 
  boolean, 
  timestamp, 
  integer, 
  char,
  text,
  index
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ===========================================
// EXAM CODES TABLE
// ===========================================
export const examCodes = pgTable('exam_codes', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 50 }).unique().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
}, (table) => ({
  codeIdx: index('exam_codes_code_idx').on(table.code),
}))

// ===========================================
// PARTICIPANTS TABLE
// ===========================================
export const participants = pgTable('participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  fullNameNormalized: varchar('full_name_normalized', { length: 200 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  normalizedNameIdx: index('participants_normalized_name_idx').on(table.fullNameNormalized),
}))

// ===========================================
// ATTEMPTS TABLE
// ===========================================
export const attempts = pgTable('attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  participantId: uuid('participant_id').references(() => participants.id).notNull(),
  examCodeId: uuid('exam_code_id').references(() => examCodes.id).notNull(),
  questionOrder: text('question_order'), // JSON string of shuffled question order
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  totalScore: integer('total_score'),
  totalCorrect: integer('total_correct'),
  totalQuestions: integer('total_questions').default(22).notNull(),
  totalTimeSeconds: integer('total_time_seconds'),
  isCompleted: boolean('is_completed').default(false).notNull(),
  isTimedOut: boolean('is_timed_out').default(false).notNull(),
}, (table) => ({
  participantIdx: index('attempts_participant_idx').on(table.participantId),
  completedAtIdx: index('attempts_completed_at_idx').on(table.completedAt),
}))

// ===========================================
// ANSWERS TABLE
// ===========================================
export const answers = pgTable('answers', {
  id: uuid('id').defaultRandom().primaryKey(),
  attemptId: uuid('attempt_id').references(() => attempts.id, { onDelete: 'cascade' }).notNull(),
  questionId: integer('question_id').notNull(),
  selectedOption: char('selected_option', { length: 1 }), // A, B, C, D or null if not answered
  isCorrect: boolean('is_correct'),
  timeSpentSeconds: integer('time_spent_seconds'),
  answeredAt: timestamp('answered_at').defaultNow().notNull(),
}, (table) => ({
  attemptIdx: index('answers_attempt_idx').on(table.attemptId),
  questionIdx: index('answers_question_idx').on(table.questionId),
}))

// ===========================================
// ADMIN SESSIONS TABLE
// ===========================================
export const adminSessions = pgTable('admin_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  token: varchar('token', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
}, (table) => ({
  tokenIdx: index('admin_sessions_token_idx').on(table.token),
}))

// ===========================================
// RELATIONS
// ===========================================
export const examCodesRelations = relations(examCodes, ({ many }) => ({
  attempts: many(attempts),
}))

export const participantsRelations = relations(participants, ({ many }) => ({
  attempts: many(attempts),
}))

export const attemptsRelations = relations(attempts, ({ one, many }) => ({
  participant: one(participants, {
    fields: [attempts.participantId],
    references: [participants.id],
  }),
  examCode: one(examCodes, {
    fields: [attempts.examCodeId],
    references: [examCodes.id],
  }),
  answers: many(answers),
}))

export const answersRelations = relations(answers, ({ one }) => ({
  attempt: one(attempts, {
    fields: [answers.attemptId],
    references: [attempts.id],
  }),
}))

// ===========================================
// TYPE EXPORTS
// ===========================================
export type ExamCode = typeof examCodes.$inferSelect
export type NewExamCode = typeof examCodes.$inferInsert

export type Participant = typeof participants.$inferSelect
export type NewParticipant = typeof participants.$inferInsert

export type Attempt = typeof attempts.$inferSelect
export type NewAttempt = typeof attempts.$inferInsert

export type Answer = typeof answers.$inferSelect
export type NewAnswer = typeof answers.$inferInsert

export type AdminSession = typeof adminSessions.$inferSelect
export type NewAdminSession = typeof adminSessions.$inferInsert
