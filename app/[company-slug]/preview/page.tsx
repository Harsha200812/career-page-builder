import { notFound } from 'next/navigation'
import Navigation from '@/components/careers/Navigation'
import HeroSection from '@/components/careers/HeroSection'
import AboutSection from '@/components/careers/AboutSection'
import LifeSection from '@/components/careers/LifeSection'
import JobCard from '@/components/careers/JobCard'
import JobFilters from '@/components/careers/JobFilters'
import Footer from '@/components/careers/Footer'
import ContentSection from '@/components/careers/ContentSection'

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

  if (!company) {
    return {
      title: 'Careers Page Not Found',
    }
  }

  return {
    title: `Careers at ${company.name}`,
    description: company.description || `Explore career opportunities at ${company.name}`,
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    notFound()
  }

  // Fetch company data
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (companyError || !company) {
    notFound()
  }

  // Fetch theme
  const { data: theme } = await supabase
    .from('company_themes')
    .select('*')
    .eq('company_id', company.id)
    .single()

  // Fetch visible sections
  const { data: sections } = await supabase
    .from('company_sections')
    .select('*')
    .eq('company_id', company.id)
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })

  // Fetch active jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', company.id)
    .eq('is_active', true)
    .order('posted_at', { ascending: false })

  // Theme colors
  const primaryColor = theme?.primary_color || '#2563eb'
  const secondaryColor = theme?.secondary_color || '#64748b'
  const logoUrl = theme?.logo_url
  const bannerUrl = theme?.banner_url

  return (
    <div className="min-h-screen bg-background relative" style={{
      '--company-primary': primaryColor,
      '--company-secondary': secondaryColor,
    } as React.CSSProperties}>
      {/* Preview Banner */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1b1b1f] text-[#fbf8fe] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-medium text-sm animate-in slide-in-from-top-4">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0044b4] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#003083]"></span>
        </span>
        Recruiter Preview Mode
      </div>

      {/* Navigation */}
      <Navigation companyName={company.name} slug={slug} />

      {/* Hero Section */}
      <HeroSection
        companyName={company.name}
        tagline={theme?.hero_title || `Careers at ${company.name}`}
        description={theme?.hero_subtitle || company.description || ''}
        logoUrl={logoUrl}
        bannerUrl={bannerUrl}
        onPrimaryColor={primaryColor}
        onSecondaryColor={secondaryColor}
      />

      {/* About Section - either from sections or company description */}
      {sections?.find(s => s.type === 'about') ? (
        sections.filter(s => s.type === 'about').map(section => (
          <ContentSection key={section.id} section={section} companyName={company.name} />
        ))
      ) : (
        company.description && (
          <AboutSection
            title="Our Story"
            content={company.description}
            imageUrl={undefined}
            companyName={company.name}
          />
        )
      )}

      {/* Life/Culture Section */}
      {sections?.find(s => s.type === 'life') && (
        <LifeSection
          companyName={company.name}
          title="Life at Company"
          description="A glimpse into our workplace culture"
          images={
            (sections.find(s => s.type === 'life')?.content.images as string[])?.map(url => ({ url, alt: company.name })) || []
          }
        />
      )}

      {/* Culture Video */}
      {theme?.culture_video_url && (
        <section className="py-20 px-6 md:px-12 max-w-[1000px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--company-on-surface)' }}>
              Inside {company.name}
            </h2>
          </div>
          <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-black/5 bg-black/5">
            <iframe 
              src={theme.culture_video_url} 
              className="w-full h-full border-none" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              title="Culture Video"
            />
          </div>
        </section>
      )}

      {/* Other sections (values, benefits, custom) */}
      {sections?.filter(s => 
        !['about', 'life'].includes(s.type) && 
        !(s.type === 'custom' && s.title === 'Footer')
      ).map(section => (
        <ContentSection key={section.id} section={section} companyName={company.name} />
      ))}

      {/* Job Listings h2 and filters */}
      <section id="roles" className="py-20 md:py-32 px-6 md:px-12 max-w-[1000px] mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <span
            className="inline-block px-4 py-1.5 mb-4 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              color: 'var(--company-secondary)',
            }}
          >
            Open Positions
          </span>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-4" style={{ color: 'var(--company-on-surface)' }}>
            Open Roles
          </h2>
          <p className="max-w-2xl mx-auto text-lg" style={{ color: 'var(--company-on-surface-variant)' }}>
            Find your next opportunity and help us build the future.
          </p>
        </div>

        {/* Filters + Job List */}
        <JobFilters initialJobs={jobs || []} />
      </section>

      {/* Footer */}
      <Footer 
        companyName={company.name} 
        data={sections?.find(s => s.type === 'custom' && s.title === 'Footer')?.content} 
      />
    </div>
  )
}
