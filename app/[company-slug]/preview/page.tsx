import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye } from 'lucide-react'
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
    .single()

  if (!company) return { title: 'Preview Not Found' }

  return {
    title: `[Preview] Careers at ${company.name}`,
    description: company.description || `Preview of ${company.name}'s careers page`,
  }
}

export default async function PreviewPage({ params }: PageProps) {
  const { 'company-slug': slug } = await params
  const supabase = await (await import('@/lib/supabase/server')).createClient()

  // Auth guard — only recruiters can see preview
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch company
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (companyError || !company) {
    notFound()
  }

  // Verify user is a member of this company
  const { data: membership } = await supabase
    .from('company_users')
    .select('id')
    .eq('company_id', company.id)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    redirect('/')
  }

  // Fetch theme
  const { data: theme } = await supabase
    .from('company_themes')
    .select('*')
    .eq('company_id', company.id)
    .single()

  // Fetch all sections (preview shows all sections regardless of visibility)
  const { data: allSections } = await supabase
    .from('company_sections')
    .select('*')
    .eq('company_id', company.id)
    .order('sort_order', { ascending: true })

  // Fetch active jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', company.id)
    .eq('is_active', true)
    .order('posted_at', { ascending: false })

  const visibleSections = (allSections || []).filter(s => s.is_visible)

  return (
    <div className="relative">
      {/* Preview Banner */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-xl shadow-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: Back to Editor */}
          <Link
            href={`/${slug}/careers`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back to Editor</span>
          </Link>

          {/* Center: Preview Label */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
            <span className="text-white text-sm font-semibold tracking-wide">Preview Mode</span>
            <span className="hidden sm:inline text-slate-400 text-xs">— Exactly how candidates see your page</span>
          </div>

          {/* Right: View Live / Status */}
          <div className="flex items-center gap-3">
            {company.is_published ? (
              <Link
                href={`/${slug}/careers`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-colors shadow-md shadow-emerald-900/20"
              >
                <Eye className="w-3.5 h-3.5" />
                View Live
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-700 text-slate-300 text-xs font-semibold">
                Not Published Yet
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for the fixed banner height */}
      <div className="h-12" />

      {/* The careers page — rendered in public (candidate) mode, no toolbar */}
      <EditableCareersLayout
        company={company}
        theme={theme}
        allSections={allSections || []}
        visibleSections={visibleSections}
        jobs={jobs || []}
        isRecruiter={false}
        currentUserId={user.id}
      />
    </div>
  )
}
