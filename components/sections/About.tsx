'use client'

import { CompanySection } from '@/lib/types'
import EditableText from '@/components/editable/EditableText'
import EditableImage from '@/components/editable/EditableImage'

interface Props {
  section: CompanySection
  isEditing: boolean
  onUpdate: (updates: Partial<CompanySection>) => void
}

export default function EditableAbout({ section, isEditing, onUpdate }: Props) {
  const content = section.content || {}
  const imageUrl = content.image_url || ''

  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12 overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, var(--company-primary) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image column */}
          <div className="relative order-2 md:order-1">
            {imageUrl ? (
              <div className="group relative">
                {/* Decorative accent behind image */}
                <div
                  className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl opacity-20"
                  style={{ backgroundColor: 'var(--company-primary)' }}
                />
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src={imageUrl}
                    alt={section.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl backdrop-blur-[2px]">
                    <EditableImage
                      currentUrl={imageUrl}
                      onUpload={(url) => onUpdate({ content: { ...content, image_url: url } })}
                      label="Replace Image"
                    />
                  </div>
                )}
              </div>
            ) : (
              isEditing ? (
                <EditableImage
                  onUpload={(url) => onUpdate({ content: { ...content, image_url: url } })}
                  label="Upload Section Image"
                  variant="zone"
                  className="aspect-[4/3]"
                />
              ) : (
                <div className="aspect-[4/3] w-full rounded-3xl bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">No image set</span>
                </div>
              )
            )}
          </div>

          {/* Content column */}
          <div className="order-1 md:order-2">
            {/* Section label */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.12em] uppercase mb-6"
              style={{ backgroundColor: 'color-mix(in srgb, var(--company-primary) 10%, white)', color: 'var(--company-primary)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--company-primary)' }} />
              Our Story
            </div>

            {isEditing ? (
              <>
                <EditableText
                  value={section.title}
                  onChange={(value) => onUpdate({ title: value })}
                  placeholder="Section Title"
                  className="text-4xl md:text-5xl font-extrabold mb-6 w-full leading-tight"
                  style={{ color: 'var(--company-primary)' }}
                />
                <EditableText
                  value={content.text || ''}
                  onChange={(value) => onUpdate({ content: { ...content, text: value } })}
                  placeholder="Tell your company story here — your mission, history, and what makes you unique..."
                  as="textarea"
                  className="w-full p-5 bg-white border-2 border-slate-200 rounded-2xl min-h-[200px] text-lg leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-600"
                />
              </>
            ) : (
              <>
                <h2
                  className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
                  style={{ color: 'var(--company-primary)' }}
                >
                  {section.title}
                </h2>
                <div className="text-lg leading-[1.9] text-slate-500 whitespace-pre-line">
                  {content.text || 'No content yet.'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
