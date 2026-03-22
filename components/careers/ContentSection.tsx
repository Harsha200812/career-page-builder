'use client'

import { CompanySection } from '@/lib/types'
import AboutSection from './AboutSection'
import LifeSection from './LifeSection'

interface Props {
  section: CompanySection
  companyName?: string
}

export default function ContentSection({ section, companyName = 'Company' }: Props) {
  const { type, title, content } = section

  switch (type) {
    case 'about':
      return (
        <AboutSection
          title={title}
          content={content.text || 'No content provided.'}
          imageUrl={content.image_url || undefined}
          companyName={companyName}
        />
      )

    case 'life':
      return (
        <LifeSection
          companyName={companyName}
          images={Array.isArray(content.images) ? content.images.map((url: string) => ({ url, alt: title })) : []}
          title={title}
          description={content.description}
        />
      )

    case 'values':
      return (
        <section className="py-20 md:py-32 px-4 md:px-12 max-w-7xl mx-auto">
          <h2
            className="font-headline text-3xl md:text-5xl font-bold text-center mb-12"
            style={{ color: 'var(--company-primary)' }}
          >
            {title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {content.values?.map?.((value: any, idx: number) => (
              <div
                key={idx}
                className="p-6 rounded-2xl"
                style={{ backgroundColor: 'var(--company-surface-container)' }}
              >
                <h3 className="font-bold text-lg mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            )) || (
              <p className="text-muted-foreground">{content.text}</p>
            )}
          </div>
        </section>
      )

    default:
      return (
        <section className="py-12">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="prose max-w-none">
            {typeof content === 'object' && content.text && (
              <p className="whitespace-pre-line">{content.text}</p>
            )}
          </div>
        </section>
      )
  }
}
