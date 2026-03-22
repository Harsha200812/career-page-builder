import { notFound } from 'next/navigation'
import EditableCareersLayout from '@/components/layout/EditableCareersLayout'

interface PageProps {
  params: Promise<{ 'company-slug': string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { 'company-slug': slug } = await params
  const supabase = await (await import('@/lib/supabase/server')).createClient()

  const { data: company } = await supabase
    .from('companies')
    .select('name, description')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!company) {
    return { title: 'Page Not Found' }
  }

  return {
    title: `Careers at ${company.name}`,
    description: company.description || `Join our team at ${company.name}`,
    openGraph: {
      title: `Careers at ${company.name}`,
      description: company.description || undefined,
      type: 'website',
    },
  }
}

export default async function CareersPage({ params }: PageProps) {
  const { 'company-slug': slug } = await params
  const supabase = await (await import('@/lib/supabase/server')).createClient()

  // Fetch company
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (companyError || !company) {
    notFound()
  }

  // Check if user is recruiter
  const { data: { user } } = await supabase.auth.getUser()
  let isRecruiter = false
  if (user) {
    const { data: membership } = await supabase
      .from('company_users')
      .select('id')
      .eq('company_id', company.id)
      .eq('user_id', user.id)
      .single()
    isRecruiter = !!membership
  }

  // If not recruiter and company not published, show 404
  if (!isRecruiter && !company.is_published) {
    notFound()
  }

  // Fetch all data
  const { data: theme } = await supabase
    .from('company_themes')
    .select('*')
    .eq('company_id', company.id)
    .single()

  const { data: allSections } = await supabase
    .from('company_sections')
    .select('*')
    .eq('company_id', company.id)
    .order('sort_order', { ascending: true })

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', company.id)
    .eq('is_active', true)
    .order('posted_at', { ascending: false })

  // Get visible sections for public view
  const visibleSections = (allSections || []).filter(s => s.is_visible)

  return (
    <EditableCareersLayout
      company={company}
      theme={theme}
      allSections={allSections || []}
      visibleSections={visibleSections}
      jobs={jobs || []}
      isRecruiter={isRecruiter}
      currentUserId={user?.id}
    />
  )
}
