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
    .eq('is_published', true)
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

  // Fetch company data
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation companyName={company.name} slug={slug} />

      {/* Hero Section */}
      <HeroSection
        companyName={company.name}
        tagline={`Careers at ${company.name}`}
        description={company.description || ''}
        logoUrl={logoUrl}
        bannerUrl={bannerUrl}
        onPrimaryColor={primaryColor}
        onSecondaryColor={secondaryColor}
      />

      {/* About Section - either from sections or company description */}
      {sections?.find(s => s.type === 'about') ? (
        sections.filter(s => s.type === 'about').map(section => (
          <ContentSection key={section.id} section={section} />
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

      {/* Other sections (values, benefits, custom) */}
      {sections?.filter(s => !['about', 'life'].includes(s.type)).map(section => (
        <ContentSection key={section.id} section={section} />
      ))}

      {/* Job Listings */}
      <section id="roles" className="py-20 md:py-32 px-4 md:px-12 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span
            className="inline-block px-4 py-1.5 mb-4 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              backgroundColor: 'var(--company-secondary) + 30',
              color: 'var(--company-secondary)',
            }}
          >
            Open Positions
          </span>

          <h2
            className="font-headline text-3xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--company-primary)' }}
          >
            Join Our Team
          </h2>

          <p className="max-w-2xl mx-auto text-muted-foreground">
            Find your next opportunity and help us build the future.
          </p>
        </div>

        {/* Filters + Job List */}
        <JobFilters initialJobs={jobs || []} />
      </section>

      {/* Footer */}
      <Footer companyName={company.name} />
    </div>
  )
}
