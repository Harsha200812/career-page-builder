import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('❌ Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
  console.error('Please add it to .env.local')
  process.exit(1)
}

if (!supabaseServiceRoleKey) {
  console.error('❌ Missing environment variable: SUPABASE_SERVICE_ROLE_KEY')
  console.error('This is required to seed the database (bypasses RLS).')
  console.error('Get it from your Supabase project Settings > API > Service Role Key')
  console.error('Add it to .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('🌱 Starting database seed...')

  // Create demo company - Azure Meridian
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .insert({
      slug: 'azure-meridian',
      name: 'Azure Meridian',
      description: `We're defining the next generation of professional agility. Join a team where your craft is respected, your boundaries are honored, and your impact is tangible.

At Azure Meridian, we believe in the power of fluid professionals – individuals who thrive in dynamic environments and bring their whole selves to work. Our culture is built on trust, autonomy, and a shared commitment to excellence.`,
      is_published: true,
    })
    .select()
    .single()

  if (companyError) {
    console.error('Error creating company:', companyError)
    return
  }

  console.log('✅ Created company:', company.name)

  // Create company theme with Azure Meridian design colors
  const { error: themeError } = await supabase.from('company_themes').insert({
    company_id: company.id,
    primary_color: '#003083', // Deep blue
    secondary_color: '#00677d', // Teal
    font_family: 'Inter',
  })

  if (themeError) {
    console.error('Error creating theme:', themeError)
  } else {
    console.log('✅ Created company theme')
  }

  // Create sections from the design
  const sections = [
    {
      company_id: company.id,
      type: 'about',
      title: 'Our Story',
      content: {
        text: `Building the Future of Work

We are a team of passionate innovators, creators, and problem-solvers. Since 2019, we've been on a mission to redefine how professionals work, collaborate, and grow.

Our culture is built on three pillars:
• **Respect** for your craft and time
• **Autonomy** to do your best work
• **Impact** that matters to the world

We welcome diverse perspectives and believe that the best ideas come from inclusive teams working towards a common goal.`,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80'
      },
      sort_order: 0,
      is_visible: true,
    },
    {
      company_id: company.id,
      type: 'life',
      title: 'Life at Azure Meridian',
      content: {
        description: 'A glimpse into our vibrant workplace culture',
        images: [
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
          'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
          'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
          'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
        ],
      },
      sort_order: 1,
      is_visible: true,
    },
    {
      company_id: company.id,
      type: 'values',
      title: 'Our Values',
      content: {
        values: [
          {
            title: 'Professional Agility',
            description: 'We adapt quickly to change and embrace new challenges as opportunities to grow.',
          },
          {
            title: 'Deep Respect',
            description: 'We honor each other\'s time, expertise, and boundaries.',
          },
          {
            title: 'Tangible Impact',
            description: 'Our work creates real value for customers and communities.',
          },
          {
            title: 'Inclusive Excellence',
            description: 'Diverse teams build better products. Period.',
          },
        ],
      },
      sort_order: 2,
      is_visible: true,
    },
  ]

  const { error: sectionsError } = await supabase.from('company_sections').insert(sections)

  if (sectionsError) {
    console.error('Error creating sections:', sectionsError)
  } else {
    console.log('✅ Created default sections')
  }

  // Sample jobs - varied for filtering demo
  const sampleJobs = [
    {
      company_id: company.id,
      title: 'Senior Frontend Engineer',
      location: 'San Francisco, CA',
      department: 'Engineering',
      work_policy: 'Hybrid' as const,
      employment_type: 'Full-time',
      experience_level: 'Senior',
      job_type: 'Permanent',
      salary_range: '$140k - $180k',
      slug: 'senior-frontend-engineer',
      is_active: true,
    },
    {
      company_id: company.id,
      title: 'Backend Developer',
      location: 'Remote',
      department: 'Engineering',
      work_policy: 'Remote' as const,
      employment_type: 'Full-time',
      experience_level: 'Mid',
      job_type: 'Permanent',
      salary_range: '$120k - $150k',
      slug: 'backend-developer',
      is_active: true,
    },
    {
      company_id: company.id,
      title: 'Product Designer',
      location: 'New York, NY',
      department: 'Design',
      work_policy: 'Hybrid' as const,
      employment_type: 'Full-time',
      experience_level: 'Mid',
      job_type: 'Permanent',
      salary_range: '$100k - $130k',
      slug: 'product-designer',
      is_active: true,
    },
    {
      company_id: company.id,
      title: 'DevOps Engineer',
      location: 'Remote',
      department: 'Engineering',
      work_policy: 'Remote' as const,
      employment_type: 'Full-time',
      experience_level: 'Senior',
      job_type: 'Contract',
      salary_range: '$150k - $180k',
      slug: 'devops-engineer',
      is_active: true,
    },
    {
      company_id: company.id,
      title: 'Marketing Specialist',
      location: 'Austin, TX',
      department: 'Marketing',
      work_policy: 'On-site' as const,
      employment_type: 'Full-time',
      experience_level: 'Entry',
      job_type: 'Permanent',
      salary_range: '$60k - $75k',
      slug: 'marketing-specialist',
      is_active: true,
    },
    {
      company_id: company.id,
      title: 'Full Stack Developer',
      location: 'Remote',
      department: 'Engineering',
      work_policy: 'Remote' as const,
      employment_type: 'Full-time',
      experience_level: 'Mid',
      job_type: 'Permanent',
      salary_range: '$110k - $140k',
      slug: 'fullstack-developer',
      is_active: true,
    },
    {
      company_id: company.id,
      title: 'UX Researcher',
      location: 'New York, NY',
      department: 'Design',
      work_policy: 'Hybrid' as const,
      employment_type: 'Full-time',
      experience_level: 'Mid',
      job_type: 'Permanent',
      salary_range: '$95k - $120k',
      slug: 'ux-researcher',
      is_active: true,
    },
    {
      company_id: company.id,
      title: 'Data Analyst',
      location: 'San Francisco, CA',
      department: 'Data',
      work_policy: 'On-site' as const,
      employment_type: 'Full-time',
      experience_level: 'Entry',
      job_type: 'Permanent',
      salary_range: '$70k - $90k',
      slug: 'data-analyst',
      is_active: true,
    },
    {
      company_id: company.id,
      title: 'Engineering Manager',
      location: 'Remote',
      department: 'Engineering',
      work_policy: 'Remote' as const,
      employment_type: 'Full-time',
      experience_level: 'Senior',
      job_type: 'Permanent',
      salary_range: '$160k - $200k',
      slug: 'engineering-manager',
      is_active: true,
    },
    {
      company_id: company.id,
      title: 'Content Strategist',
      location: 'Austin, TX',
      department: 'Marketing',
      work_policy: 'Hybrid' as const,
      employment_type: 'Full-time',
      experience_level: 'Mid',
      job_type: 'Permanent',
      salary_range: '$80k - $100k',
      slug: 'content-strategist',
      is_active: true,
    },
  ]

  const { error: jobsError } = await supabase.from('jobs').insert(sampleJobs)

  if (jobsError) {
    console.error('Error creating jobs:', jobsError)
  } else {
    console.log(`✅ Created ${sampleJobs.length} sample jobs`)
  }

  console.log('\n🎉 Database seed completed!')
  console.log(`\nDemo company page: http://localhost:3000/azure-meridian/careers`)
  console.log(`\nTo test locally:`)
  console.log(`1. Ensure .env.local has your Supabase credentials`)
  console.log(`2. Run: npm run dev`)
  console.log(`3. Open: http://localhost:3000/azure-meridian/careers`)
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error)
  process.exit(1)
})
