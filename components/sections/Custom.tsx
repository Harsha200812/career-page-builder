'use client'

import { CompanySection } from '@/lib/types'
import EditableText from '@/components/editable/EditableText'

interface Props {
  section: CompanySection
  isEditing: boolean
  onUpdate: (updates: Partial<CompanySection>) => void
}

export default function EditableCustom({ section, isEditing, onUpdate }: Props) {
  const content = section.content || {}

  return (
    <section className="py-16 md:py-20 px-6 md:px-12 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100">
        {isEditing ? (
          <div className="space-y-4">
            <EditableText
              value={section.title}
              onChange={(value) => onUpdate({ title: value })}
              placeholder="Section Title"
              className="text-2xl font-bold w-full"
              style={{ color: 'var(--company-primary)' }}
            />
            <EditableText
              value={content.text || ''}
              onChange={(value) => onUpdate({ content: { ...content, text: value } })}
              placeholder="Enter section content..."
              as="textarea"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl min-h-[150px]"
            />
          </div>
        ) : (
          <>
            {section.title && (
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--company-primary)' }}>
                {section.title}
              </h2>
            )}
            <div className="prose max-w-none">
              {content.text ? (
                <div className="whitespace-pre-line">{content.text}</div>
              ) : (
                <p className="text-slate-500 italic">No content yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
