import { notFound } from 'next/navigation'
import EditableCareersLayout from '@/components/layout/EditableCareersLayout'
import { CompanySection, CompanyTheme } from '@/lib/types'

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

  // Fetch live active jobs, since jobs are still independently managed if desired,
  // or they can be part of the snapshot. Actually, jobs are fetched from relational DB.
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', company.id)
    .eq('is_active', true)
    .order('posted_at', { ascending: false })

  // Determine which data to pass to layout
  let themeData: CompanyTheme | null = null;
  let allSectionsData: CompanySection[] = [];
  let hasUnpublishedChanges = false;

  if (isRecruiter) {
    // For recruiters, load the live relational data
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
      
    themeData = theme;
    allSectionsData = allSections || [];

    // Check if live data differs from published snapshot
    if (company.is_published && company.published_data) {
      // Create omit-based comparisons to ignore transient fields like updated_at if necessary
      // For now, doing a basic string compare of the core fields helps catch differences.
      const snapshotTheme = company.published_data.theme;
      const snapshotSections = company.published_data.sections;
      if (
        JSON.stringify(snapshotTheme) !== JSON.stringify(themeData) ||
        JSON.stringify(snapshotSections) !== JSON.stringify(allSectionsData)
      ) {
        hasUnpublishedChanges = true;
      }
    }
  } else {
    // For public visitors, load from the published snapshot if it exists
    if (company.published_data) {
      themeData = company.published_data.theme || null;
      allSectionsData = company.published_data.sections || [];
    }
  }

  // Get visible sections for public view
  const visibleSections = allSectionsData.filter(s => s.is_visible)

  return (
    <EditableCareersLayout
      company={company}
      theme={themeData}
      allSections={allSectionsData}
      visibleSections={visibleSections}
      jobs={jobs || []}
      isRecruiter={isRecruiter}
      currentUserId={user?.id}
      hasUnpublishedChanges={hasUnpublishedChanges}
    />
  )
}
