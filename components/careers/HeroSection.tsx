'use client'

import Link from 'next/link'

interface Props {
  companyName: string
  tagline?: string
  description?: string
  logoUrl?: string | null
  bannerUrl?: string | null
  onPrimaryColor: string
  onSecondaryColor: string
}

export default function HeroSection({
  companyName,
  tagline = 'Careers',
  description = 'We\'re defining the next generation of professional agility. Join a team where your craft is respected, your boundaries are honored, and your impact is tangible.',
  logoUrl,
  bannerUrl,
  onPrimaryColor,
  onSecondaryColor,
}: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Textured Background Elements */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-5"
          style={{ backgroundColor: onPrimaryColor }}
        ></div>
        <div
          className="absolute bottom-20 -right-20 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: onSecondaryColor }}
        ></div>

        {/* Background image with overlay */}
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-overlay"
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6">
        <div
          className="glass-card p-8 md:p-12 lg:p-20 rounded-[2.5rem] organic-shadow border border-white/40 text-center"
        >
          {/* Logo */}
          {logoUrl && (
            <img
              src={logoUrl}
              alt={`${companyName} logo`}
              className="mx-auto h-20 w-auto mb-6 object-contain"
            />
          )}

          {/* Badge */}
          <span
            className="inline-block px-4 py-1.5 mb-6 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              color: onSecondaryColor,
            }}
          >
            Careers at {companyName}
          </span>

          {/* Headline */}
          <h1
            className="font-headline text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8"
            style={{ color: 'var(--company-primary)' }}
          >
            {tagline && (
              <>
                {tagline.split(' ').map((word, i, arr) => (
                  <span key={i}>
                    {word}
                    {i < arr.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </>
            )}
          </h1>

          {/* Description */}
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ color: 'var(--company-on-surface-variant)' }}
          >
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="#roles"
              className="btn-primary inline-block"
              style={{
                backgroundColor: 'var(--company-primary)',
                color: 'var(--company-on-primary)',
              }}
            >
              View Openings
            </Link>
            <Link
              href="#about"
              className="px-8 py-4 rounded-xl font-semibold transition-all"
              style={{
                backgroundColor: 'var(--company-surface-container-high)',
                color: 'var(--company-on-primary-fixed-variant)',
              }}
            >
              Learn Our Values
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: 'var(--company-primary)' }}
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  )
}
