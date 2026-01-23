// ===========================================
// TELINK EXAM PLATFORM - UTILITIES
// ===========================================

// ===========================================
// CLASS NAME UTILITY
// ===========================================

type ClassValue = string | number | boolean | undefined | null | ClassValue[]

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter(x => typeof x === 'string' && x.length > 0)
    .join(' ')
}

// ===========================================
// TIME FORMATTING
// ===========================================

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatTimeMinutes(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs}s`
  return `${mins}m ${secs}s`
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ===========================================
// SCORE FORMATTING
// ===========================================

export function formatScore(correct: number, total: number): string {
  return `${correct}/${total}`
}

export function calculatePercentage(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 80) return 'text-status-correct'
  if (percentage >= 50) return 'text-status-warning'
  return 'text-status-incorrect'
}

// ===========================================
// RANDOM SEED GENERATION
// ===========================================

export function generateAttemptSeed(): number {
  return Math.floor(Math.random() * 1000000)
}

// ===========================================
// VALIDATION
// ===========================================

export function isValidExamCode(code: string): boolean {
  return code.length >= 3 && code.length <= 50 && /^[A-Za-z0-9]+$/.test(code)
}

export function isValidName(name: string): boolean {
  const trimmed = name.trim()
  return trimmed.length >= 1 && trimmed.length <= 100
}

// ===========================================
// ERROR HANDLING
// ===========================================

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Ett oväntat fel uppstod'
}

// ===========================================
// API RESPONSE HELPERS
// ===========================================

export function successResponse<T>(data: T, message?: string) {
  return Response.json({
    success: true,
    data,
    message,
  })
}

export function errorResponse(message: string, status: number = 400) {
  return Response.json(
    {
      success: false,
      error: message,
    },
    { status }
  )
}

// ===========================================
// LOCAL STORAGE HELPERS (CLIENT-SIDE)
// ===========================================

export function getExamState(): {
  attemptId: string
  currentIndex: number
  answers: Record<number, string>
  writtenAnswers: Record<number, string>
  motivations: Record<number, string>
  startTime: number
} | null {
  if (typeof window === 'undefined') return null

  const stored = sessionStorage.getItem('examState')
  if (!stored) return null

  try {
    const state = JSON.parse(stored)
    // Add new fields if missing (backward compatibility)
    return {
      ...state,
      writtenAnswers: state.writtenAnswers || {},
      motivations: state.motivations || {},
    }
  } catch {
    return null
  }
}

export function saveExamState(state: {
  attemptId: string
  currentIndex: number
  answers: Record<number, string>
  writtenAnswers: Record<number, string>
  motivations: Record<number, string>
  startTime: number
}): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem('examState', JSON.stringify(state))
}

export function clearExamState(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem('examState')
}

// ===========================================
// FULLSCREEN HELPERS (CLIENT-SIDE)
// ===========================================

export function requestFullscreen(element: HTMLElement): Promise<void> {
  if (element.requestFullscreen) {
    return element.requestFullscreen()
  }
  // @ts-expect-error Safari prefix
  if (element.webkitRequestFullscreen) {
    // @ts-expect-error Safari prefix
    return element.webkitRequestFullscreen()
  }
  return Promise.reject(new Error('Fullscreen not supported'))
}

export function exitFullscreen(): Promise<void> {
  if (document.exitFullscreen) {
    return document.exitFullscreen()
  }
  // @ts-expect-error Safari prefix
  if (document.webkitExitFullscreen) {
    // @ts-expect-error Safari prefix
    return document.webkitExitFullscreen()
  }
  return Promise.reject(new Error('Fullscreen not supported'))
}

export function isFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    // @ts-expect-error Safari prefix
    document.webkitFullscreenElement
  )
}

// ===========================================
// DEBOUNCE
// ===========================================

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
