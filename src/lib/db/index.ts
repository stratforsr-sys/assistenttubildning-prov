// ===========================================
// TELINK EXAM PLATFORM - DATABASE CONNECTION
// ===========================================

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Create database connection on demand (serverless-friendly)
function createConnection() {
  // Try multiple possible env var names (Vercel/Neon integration uses different names)
  const databaseUrl = process.env.DATABASE_URL
    || process.env.NEON_DATABASE_URL
    || process.env.POSTGRES_URL
    || process.env.NEON_POSTGRES_URL

  if (!databaseUrl) {
    const availableEnvVars = Object.keys(process.env).filter(k =>
      k.includes('DATABASE') || k.includes('NEON') || k.includes('POSTGRES')
    )
    console.error('DATABASE_URL not found. Available related env vars:', availableEnvVars)
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const sql = neon(databaseUrl)
  const db = drizzle(sql, { schema })

  return { sql, db }
}

// Export a getter function that creates connection on each request
// This is the recommended pattern for serverless environments
export function getDb() {
  return createConnection().db
}

export function getSql() {
  return createConnection().sql
}

// For backward compatibility - lazy initialized
let _connection: ReturnType<typeof createConnection> | null = null

function getConnection() {
  if (!_connection) {
    _connection = createConnection()
  }
  return _connection
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get: (_, prop) => {
    return getConnection().db[prop as keyof ReturnType<typeof drizzle>]
  }
})

export const sql = new Proxy((() => {}) as unknown as ReturnType<typeof neon>, {
  get: (_, prop) => {
    return getConnection().sql[prop as keyof ReturnType<typeof neon>]
  },
  apply: (_, __, args: unknown[]) => {
    return (getConnection().sql as any)(...args)
  }
})
