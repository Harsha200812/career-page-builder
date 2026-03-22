'use client'

import { CompanySection } from '@/lib/types'
import EditableText from '@/components/editable/EditableText'
import EditableImage from '@/components/editable/EditableImage'

interface Props {
  section: CompanySection
  isEditing: boolean
  onUpdate: (updates: Partial<CompanySection>) => void
}

export default function EditableLife({ section, isEditing, onUpdate }: Props) {
  const content = section.content || {}
  const images: string[] = Array.isArray(content.images) ? content.images : []

  const addImage = (url: string) => {
    onUpdate({ content: { ...content, images: [...images, url] } })
  }

  const removeImage = (index: number) => {
    onUpdate({
      content: { ...content, images: images.filter((_: string, i: number) => i !== index) },
    })
  }

  return (
    <section
      className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, color-mix(in srgb, var(--company-primary) 4%, white) 100%)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.12em] uppercase mb-6"
            style={{ backgroundColor: 'color-mix(in srgb, var(--company-primary) 10%, white)', color: 'var(--company-primary)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--company-primary)' }} />
            Culture & Life
          </div>

          {isEditing ? (
            <>
              <EditableText
                value={section.title}
                onChange={(value) => onUpdate({ title: value })}
                placeholder="Section Title"
                className="text-4xl md:text-5xl font-extrabold mb-4 w-full"
                style={{ color: 'var(--company-primary)' }}
              />
              <EditableText
                value={content.description || ''}
                onChange={(value) => onUpdate({ content: { ...content, description: value } })}
                placeholder="Describe your culture in a sentence or two..."
                as="textarea"
                className="w-full max-w-2xl mx-auto p-4 bg-white border-2 border-slate-200 rounded-2xl min-h-[80px] text-lg text-center"
              />
            </>
          ) : (
            <>
              <h2
                className="text-4xl md:text-5xl font-extrabold mb-4"
                style={{ color: 'var(--company-primary)' }}
              >
                {section.title || 'Life at Our Company'}
              </h2>
              {content.description && (
                <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                  {content.description}
                </p>
              )}
            </>
          )}
        </div>

        {/* Masonry-style Gallery */}
        {(images.length > 0 || isEditing) && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {images.map((url: string, index: number) => (
              <div
                key={index}
                className={`relative group overflow-hidden rounded-2xl ${
                  index === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : 'aspect-square'
                }`}
              >
                <img
                  src={url}
                  alt={`${section.title} ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isEditing && (
                  <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => removeImage(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold shadow-lg"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isEditing && (
              <EditableImage
                onUpload={addImage}
                label="Add Photo"
                variant="zone"
                className="aspect-square"
              />
            )}
          </div>
        )}

        {/* Empty state */}
        {images.length === 0 && !isEditing && (
          <div className="text-center py-16 rounded-2xl bg-slate-50">
            <p className="text-slate-400">No photos added yet</p>
          </div>
        )}

        {/* Edit hint */}
        {isEditing && images.length === 0 && (
          <p className="text-center text-sm text-slate-400 mt-4">
            Click the dashed box to upload photos
          </p>
        )}
      </div>
    </section>
  )
}
