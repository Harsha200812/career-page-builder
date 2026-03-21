import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createRecruiter() {
  try {
    console.log('🔧 Creating recruiter user...')

    // Step 1: Create user with admin API
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
      email: 'recruiter@test.com',
      password: 'Password123!',
      email_confirm: true,
    })

    if (createError) {
      throw createError
    }

    const userId = user.user.id
    console.log(`✅ Created user: ${userId}`)

    // Step 2: Get company ID for 'azure-meridian'
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, slug')
      .eq('slug', 'azure-meridian')
      .single()

    if (companyError || !company) {
      throw new Error(`Company 'azure-meridian' not found: ${companyError?.message}`)
    }

    const companyId = company.id
    console.log(`✅ Found company: ${companyId} (slug: ${company.slug})`)

    // Step 3: Insert into company_users as recruiter
    const { error: insertError } = await supabase.from('company_users').insert({
      company_id: companyId,
      user_id: userId,
      role: 'recruiter',
    })

    if (insertError) {
      throw insertError
    }

    console.log(`✅ Assigned recruiter role to user for company ${companyId}`)
    console.log('\n🎉 Recruiter created successfully!')
    console.log('📧 Email: recruiter@test.com')
    console.log('🔐 Password: Password123!')
  } catch (error) {
    console.error('❌ Failed to create recruiter:', error)
    process.exit(1)
  }
}

createRecruiter()
