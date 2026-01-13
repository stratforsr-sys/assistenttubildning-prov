// ===========================================
// TELINK EXAM PLATFORM - DATABASE CONNECTION
// ===========================================

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Lazy initialization to avoid database connection at build time
let _sql: ReturnType<typeof neon> | null = null
let _db: ReturnType<typeof drizzle> | null = null

function getSQL() {
  if (!_sql) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    _sql = neon(databaseUrl)
  }
  return _sql
}

function getDB() {
  if (!_db) {
    _db = drizzle(getSQL(), { schema })
  }
  return _db
}

// Export getters instead of direct instances
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get: (_, prop) => {
    return getDB()[prop as keyof ReturnType<typeof drizzle>]
  }
})

export const sql = new Proxy((() => {}) as unknown as ReturnType<typeof neon>, {
  get: (_, prop) => {
    return getSQL()[prop as keyof ReturnType<typeof neon>]
  },
  apply: (_, __, args: unknown[]) => {
    return (getSQL() as any)(...args)
  }
})
