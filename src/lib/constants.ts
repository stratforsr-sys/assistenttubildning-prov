// ===========================================
// TELINK EXAM PLATFORM - CONSTANTS
// ===========================================

// Exam configuration
export const EXAM_CONFIG = {
  TIME_LIMIT_MINUTES: parseInt(process.env.EXAM_TIME_LIMIT_MINUTES || '35'),
  WARNING_MINUTES: parseInt(process.env.EXAM_WARNING_MINUTES || '5'),
  TOTAL_QUESTIONS: 30,
  MULTIPLE_CHOICE_QUESTIONS: 23,
  TRUE_FALSE_QUESTIONS: 4,
  WRITTEN_QUESTIONS: 3,
  DEFAULT_CODE: process.env.EXAM_CODE_DEFAULT || 'Telink2026',
} as const

// Time conversions
export const TIME = {
  SECONDS_PER_MINUTE: 60,
  MILLISECONDS_PER_SECOND: 1000,
  get EXAM_TIME_LIMIT_SECONDS() {
    return EXAM_CONFIG.TIME_LIMIT_MINUTES * this.SECONDS_PER_MINUTE
  },
  get WARNING_SECONDS() {
    return EXAM_CONFIG.WARNING_MINUTES * this.SECONDS_PER_MINUTE
  },
} as const

// Admin configuration
export const ADMIN_CONFIG = {
  SESSION_DURATION_HOURS: 24,
  EMAIL: process.env.ADMIN_EMAIL || 'telink@admin.se',
} as const

// UI Messages (Swedish)
export const MESSAGES = {
  // Login
  LOGIN_TITLE: 'Produktutbildning Prov',
  LOGIN_SUBTITLE: 'AI-Assistent',
  EXAM_CODE_LABEL: 'Provkod',
  EXAM_CODE_PLACEHOLDER: 'Ange provkod',
  FIRST_NAME_LABEL: 'Förnamn',
  FIRST_NAME_PLACEHOLDER: 'Ditt förnamn',
  LAST_NAME_LABEL: 'Efternamn',
  LAST_NAME_PLACEHOLDER: 'Ditt efternamn',
  START_EXAM_BUTTON: 'Starta provet',
  
  // Validation errors
  ERROR_INVALID_CODE: 'Ogiltig provkod. Kontrollera och försök igen.',
  ERROR_DUPLICATE_NAME: 'Du har redan genomfört detta prov.',
  ERROR_REQUIRED_FIELDS: 'Alla fält måste fyllas i.',
  ERROR_EXAM_EXPIRED: 'Provkoden har gått ut.',
  
  // Exam
  EXAM_TITLE: 'Produktutbildning Prov',
  QUESTION_OF: 'Fråga {current} av {total}',
  NEXT_QUESTION: 'Nästa fråga',
  SUBMIT_EXAM: 'Lämna in prov',
  TIME_REMAINING: 'Tid kvar',
  TIME_WARNING: '⚠️ Mindre än 5 minuter kvar!',
  
  // Exam rules
  EXAM_RULES_TITLE: 'Viktiga regler innan du börjar',
  EXAM_RULES: [
    'Provet består av 30 frågor och tar max 35 minuter.',
    'Det finns flervalsfrågor, sant/falskt-frågor och korta skriftliga svar.',
    'Du kan INTE gå tillbaka och ändra dina svar.',
    'Provet måste genomföras i helskärmsläge.',
    'Om du lämnar helskärmsläge skickas provet in automatiskt.',
    'När tiden är slut skickas provet in automatiskt.',
  ],
  EXAM_RULES_CONFIRM: 'Jag förstår reglerna och vill starta provet',
  
  // Fullscreen
  FULLSCREEN_REQUIRED: 'Helskärmsläge krävs',
  FULLSCREEN_MESSAGE: 'Klicka på knappen nedan för att aktivera helskärmsläge och starta provet.',
  FULLSCREEN_BUTTON: 'Aktivera helskärm',
  FULLSCREEN_WARNING: 'Du har lämnat helskärmsläge. Provet skickas in om du inte återgår.',
  FULLSCREEN_COUNTDOWN: 'Provet skickas in om {seconds} sekunder...',
  
  // Submit confirmation
  SUBMIT_CONFIRM_TITLE: 'Bekräfta inlämning',
  SUBMIT_CONFIRM_MESSAGE: 'Är du säker på att du vill lämna in provet? Du kan inte ändra dina svar efteråt.',
  SUBMIT_CONFIRM_YES: 'Ja, lämna in',
  SUBMIT_CONFIRM_NO: 'Nej, fortsätt',
  
  // Review
  REVIEW_TITLE: 'Resultat',
  REVIEW_SUBTITLE: 'Genomgång av dina svar',
  YOUR_SCORE: 'Din poäng',
  CORRECT_ANSWERS: 'Rätta svar',
  TIME_SPENT: 'Tid',
  YOUR_ANSWER: 'Ditt svar',
  CORRECT_ANSWER: 'Rätt svar',
  NO_ANSWER: 'Ej besvarat',
  
  // Admin
  ADMIN_LOGIN_TITLE: 'Admin-inloggning',
  ADMIN_EMAIL_LABEL: 'E-post',
  ADMIN_PASSWORD_LABEL: 'Lösenord',
  ADMIN_LOGIN_BUTTON: 'Logga in',
  ADMIN_ERROR_INVALID: 'Felaktig e-post eller lösenord.',
  
  // Dashboard
  DASHBOARD_TITLE: 'Admin Dashboard',
  DASHBOARD_STATS: 'Statistik',
  DASHBOARD_PARTICIPANTS: 'Deltagare',
  DASHBOARD_QUESTIONS: 'Frågeanalys',
  DASHBOARD_CODES: 'Provkoder',
  
  STAT_TOTAL_PARTICIPANTS: 'Totalt deltagare',
  STAT_AVERAGE_SCORE: 'Medelpoäng',
  STAT_MEDIAN_SCORE: 'Median',
  STAT_MIN_MAX: 'Min / Max',
  STAT_AVERAGE_TIME: 'Medeltid',
  
  CHART_SCORE_DISTRIBUTION: 'Resultatfördelning',
  CHART_TIME_VS_SCORE: 'Tid vs Poäng',
  CHART_TREND: 'Trendlinje',
  
  QUESTION_TOO_EASY: 'För lätt (>90%)',
  QUESTION_TOO_HARD: 'För svår (<30%)',
  QUESTION_DIFFICULTY: 'Svårighetsgrad',
  
  // General
  LOADING: 'Laddar...',
  ERROR_GENERIC: 'Ett fel uppstod. Försök igen.',
  BACK: 'Tillbaka',
  LOGOUT: 'Logga ut',
  DELETE: 'Radera',
  DELETE_CONFIRM: 'Är du säker på att du vill radera detta?',
  CREATE: 'Skapa',
  SAVE: 'Spara',
  CANCEL: 'Avbryt',
} as const

// Question difficulty thresholds
export const DIFFICULTY_THRESHOLDS = {
  EASY: 90, // > 90% correct = too easy
  HARD: 30, // < 30% correct = too hard
} as const

// Score distribution ranges (updated for 30 questions)
export const SCORE_RANGES = [
  { min: 0, max: 6, label: '0-6' },
  { min: 7, max: 12, label: '7-12' },
  { min: 13, max: 18, label: '13-18' },
  { min: 19, max: 24, label: '19-24' },
  { min: 25, max: 27, label: '25-27' },
  { min: 28, max: 30, label: '28-30' },
] as const

// Pass thresholds
export const PASS_THRESHOLDS = {
  PASS: 80, // 80% = 24/30 = godkänt
  GOOD: 90, // 90% = 27/30 = mycket bra
  EXCELLENT: 100, // 100% = 30/30 = utmärkt
} as const
