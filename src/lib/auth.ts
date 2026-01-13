// ===========================================
// TELINK EXAM PLATFORM - AUTH HELPERS
// ===========================================

import { SignJWT, jwtVerify } from 'jose'
import { compare } from 'bcryptjs'
import { cookies } from 'next/headers'
import { 
  createAdminSession, 
  getAdminSessionByToken, 
  deleteAdminSession 
} from './db/queries'
import { ADMIN_CONFIG } from './constants'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
)

const COOKIE_NAME = 'admin_session'

// ===========================================
// PASSWORD VERIFICATION
// ===========================================

export async function verifyAdminCredentials(
  email: string, 
  password: string
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || ADMIN_CONFIG.EMAIL
  const passwordHash = process.env.ADMIN_PASSWORD_HASH
  
  if (!passwordHash) {
    console.error('ADMIN_PASSWORD_HASH not set')
    return false
  }
  
  // Check email
  if (email.toLowerCase() !== adminEmail.toLowerCase()) {
    return false
  }
  
  // Check password
  return compare(password, passwordHash)
}

// ===========================================
// JWT TOKEN MANAGEMENT
// ===========================================

export async function createToken(payload: { email: string }): Promise<string> {
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + ADMIN_CONFIG.SESSION_DURATION_HOURS)
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(JWT_SECRET)
  
  // Store session in database
  await createAdminSession({
    token,
    expiresAt,
  })
  
  return token
}

export async function verifyToken(token: string): Promise<{ email: string } | null> {
  try {
    // Verify JWT
    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    // Check if session exists in database
    const session = await getAdminSessionByToken(token)
    if (!session) {
      return null
    }
    
    return { email: payload.email as string }
  } catch {
    return null
  }
}

// ===========================================
// SESSION MANAGEMENT
// ===========================================

export async function createSession(email: string): Promise<void> {
  const token = await createToken({ email })
  
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_CONFIG.SESSION_DURATION_HOURS * 60 * 60,
    path: '/',
  })
}

export async function getSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  
  if (!token) {
    return null
  }
  
  return verifyToken(token)
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  
  if (token) {
    await deleteAdminSession(token)
  }
  
  cookieStore.delete(COOKIE_NAME)
}

// ===========================================
// MIDDLEWARE HELPER
// ===========================================

export async function requireAdmin(): Promise<{ email: string }> {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  return session
}
