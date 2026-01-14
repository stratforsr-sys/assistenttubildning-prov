// ===========================================
// TELINK EXAM PLATFORM - RUN MIGRATIONS
// ===========================================
// This script runs database migrations
// Usage: tsx scripts/migrate.ts

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'

async function runMigrations() {
  console.log('🚀 Starting database migrations...')

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set')
    process.exit(1)
  }

  try {
    // Create database connection
    const sql = neon(databaseUrl)
    const db = drizzle(sql)

    // Run migrations
    console.log('📦 Running migrations from ./drizzle folder...')
    await migrate(db, { migrationsFolder: './drizzle' })

    console.log('✅ Migrations completed successfully!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Run seed data: tsx scripts/seed.ts')
    console.log('2. Or manually insert exam codes in the database')

    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
