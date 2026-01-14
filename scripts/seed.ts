// ===========================================
// TELINK EXAM PLATFORM - SEED DATABASE
// ===========================================
// This script seeds the database with initial data
// Usage: tsx scripts/seed.ts

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../src/lib/db/schema'

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set')
    process.exit(1)
  }

  try {
    // Create database connection
    const sql = neon(databaseUrl)
    const db = drizzle(sql, { schema })

    // Insert default exam code
    console.log('📝 Inserting default exam code...')

    const [examCode] = await db
      .insert(schema.examCodes)
      .values({
        code: 'TELINK2026',
        name: 'AI-Assistent Produktutbildning 2026',
        isActive: true,
      })
      .onConflictDoNothing()
      .returning()

    if (examCode) {
      console.log(`✅ Created exam code: ${examCode.code}`)
    } else {
      console.log('ℹ️  Exam code already exists')
    }

    console.log('')
    console.log('✅ Database seeded successfully!')
    console.log('')
    console.log('You can now:')
    console.log('1. Login to admin panel: /admin-login')
    console.log('2. Create more exam codes in the admin dashboard')
    console.log('3. Share exam code "TELINK2026" with participants')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedDatabase()
