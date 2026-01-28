// ===========================================
// FIX DATABASE - ADD WRITTEN_ANSWER COLUMN AND UPDATE SELECTED_OPTION
// ===========================================
// Run with: npx tsx scripts/fix-database.ts

import { neon } from '@neondatabase/serverless'

async function fixDatabase() {
  console.log('🚀 Fixing database schema...')

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set')
    process.exit(1)
  }

  try {
    const sql = neon(databaseUrl)

    // Step 1: Check if written_answer column exists
    console.log('📝 Checking for written_answer column...')
    const checkWrittenAnswer = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'answers' AND column_name = 'written_answer'
    `

    if (checkWrittenAnswer.length === 0) {
      console.log('   Adding written_answer column...')
      await sql`ALTER TABLE answers ADD COLUMN written_answer TEXT`
      console.log('   ✓ written_answer column added')
    } else {
      console.log('   ✓ written_answer column already exists')
    }

    // Step 2: Check selected_option column type
    console.log('📝 Checking selected_option column type...')
    const checkSelectedOption = await sql`
      SELECT data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'answers' AND column_name = 'selected_option'
    `

    if (checkSelectedOption.length > 0) {
      const currentType = checkSelectedOption[0]
      console.log(`   Current type: ${currentType.data_type}(${currentType.character_maximum_length})`)

      if (currentType.data_type === 'character' && currentType.character_maximum_length === 1) {
        console.log('   Updating selected_option to varchar(10)...')
        await sql`ALTER TABLE answers ALTER COLUMN selected_option TYPE varchar(10)`
        console.log('   ✓ selected_option column updated to varchar(10)')
      } else {
        console.log('   ✓ selected_option column already correct')
      }
    }

    console.log('')
    console.log('✅ Database schema fixed successfully!')
    console.log('')
    console.log('You can now run the application.')

    process.exit(0)
  } catch (error) {
    console.error('❌ Database fix failed:', error)
    process.exit(1)
  }
}

fixDatabase()
