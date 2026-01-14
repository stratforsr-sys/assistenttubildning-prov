// ===========================================
// TELINK EXAM PLATFORM - SIMPLE SQL MIGRATION
// ===========================================
// This script runs the SQL migration file directly

import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { join } from 'path'

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

    // Read the migration SQL file
    const migrationFile = join(process.cwd(), 'drizzle', '0000_colossal_franklin_richards.sql')
    console.log('📦 Reading migration file:', migrationFile)

    const migrationSQL = readFileSync(migrationFile, 'utf-8')

    // Split by statement-breakpoint and execute each statement
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Executing ${statements.length} SQL statements...`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`   [${i + 1}/${statements.length}] Executing...`)
      await sql(statement)
    }

    console.log('✅ Migrations completed successfully!')
    console.log('')
    console.log('Next step: Run seed data with: npm run db:seed')

    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
