'use client'

interface Props {
  title?: string
  content: string
  imageUrl?: string
  companyName: string
}

export default function AboutSection({
  title = 'Our Story',
  content,
  imageUrl,
  companyName,
}: Props) {
  return (
    <section id="about" className="py-20 md:py-32 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        {/* Left side - Image with organic blob */}
        <div className="relative">
          {imageUrl && (
            <>
              {/* Organic blob accent */}
              <div
                className="asymmetric-blob absolute inset-0 -rotate-6 scale-110 opacity-30"
                style={{ backgroundColor: 'var(--company-secondary)' }}
              ></div>

              {/* Main image */}
              <img
                src={imageUrl}
                alt={`${companyName} team`}
                className="relative z-10 w-full rounded-[2rem] organic-shadow aspect-[4/5] object-cover"
              />
            </>
          )}

          {/* Badge/Award */}
          <div
            className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full organic-shadow flex items-center justify-center p-4 z-20"
            style={{ backgroundColor: 'var(--company-surface-container-lowest)' }}
          >
            <div className="text-center">
              <p
                className="font-headline font-bold text-sm"
                style={{ color: 'var(--company-primary)' }}
              >
                Winner
              </p>
              <p className="text-xs text-muted-foreground">Design Culture 2024</p>
            </div>
          </div>
        </div>

        {/* Right side - Text content */}
        <div className="space-y-8">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              backgroundColor: 'var(--company-secondary) + 30',
              color: 'var(--company-secondary)',
            }}
          >
            {title}
          </span>

          <h2
            className="font-headline text-3xl md:text-5xl font-bold leading-tight"
            style={{ color: 'var(--company-primary)' }}
          >
            Building the Future of Work
          </h2>

          <div className="space-y-4 text-base md:text-lg" style={{ color: 'var(--company-on-surface)' }}>
            {content.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Stats or highlights */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--company-primary)' }}>150+</p>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--company-primary)' }}>12</p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--company-primary)' }}>4.9</p>
              <p className="text-sm text-muted-foreground">Glassdoor Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
