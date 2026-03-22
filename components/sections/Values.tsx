'use client'

import { CompanySection } from '@/lib/types'
import EditableText from '@/components/editable/EditableText'
import { Plus, Trash2 } from 'lucide-react'

interface Props {
  section: CompanySection
  isEditing: boolean
  onUpdate: (updates: Partial<CompanySection>) => void
}

interface ValueItem {
  title: string
  description: string
  emoji?: string
}

const DEFAULT_EMOJIS = ['🚀', '💡', '🤝', '❤️', '🌱', '⚡', '🎯', '🔥', '✨', '🌍']

export default function EditableValues({ section, isEditing, onUpdate }: Props) {
  const content = section.content || {}
  const values: ValueItem[] = Array.isArray(content.values) ? content.values : []

  const updateValue = (index: number, updates: Partial<ValueItem>) => {
    const newValues = values.map((v, i) => (i === index ? { ...v, ...updates } : v))
    onUpdate({ content: { ...content, values: newValues } })
  }

  const addValue = () => {
    const emoji = DEFAULT_EMOJIS[values.length % DEFAULT_EMOJIS.length]
    onUpdate({
      content: { ...content, values: [...values, { title: '', description: '', emoji }] },
    })
  }

  const removeValue = (index: number) => {
    onUpdate({
      content: { ...content, values: values.filter((_: any, i: number) => i !== index) },
    })
  }

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 relative bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.12em] uppercase mb-6"
            style={{ backgroundColor: 'color-mix(in srgb, var(--company-primary) 10%, white)', color: 'var(--company-primary)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--company-primary)' }} />
            What We Stand For
          </div>

          {isEditing ? (
            <EditableText
              value={section.title}
              onChange={(value) => onUpdate({ title: value })}
              placeholder="Section Title"
              className="text-4xl md:text-5xl font-extrabold w-full"
              style={{ color: 'var(--company-primary)' }}
            />
          ) : (
            <h2
              className="text-4xl md:text-5xl font-extrabold mb-4"
              style={{ color: 'var(--company-primary)' }}
            >
              {section.title}
            </h2>
          )}
          {!isEditing && (
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mt-4">
              The principles that guide everything we do
            </p>
          )}
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Number badge */}
              <div
                className="absolute -top-3 -right-3 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white"
                style={{ backgroundColor: 'var(--company-primary)' }}
              >
                {index + 1}
              </div>

              {/* Emoji / Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: 'color-mix(in srgb, var(--company-primary) 10%, white)' }}
              >
                {isEditing ? (
                  <input
                    value={value.emoji || DEFAULT_EMOJIS[index % DEFAULT_EMOJIS.length]}
                    onChange={(e) => updateValue(index, { emoji: e.target.value })}
                    className="w-10 text-center bg-transparent text-2xl focus:outline-none"
                    maxLength={2}
                  />
                ) : (
                  value.emoji || DEFAULT_EMOJIS[index % DEFAULT_EMOJIS.length]
                )}
              </div>

              {isEditing ? (
                <>
                  <input
                    value={value.title}
                    onChange={(e) => updateValue(index, { title: e.target.value })}
                    placeholder="Value title"
                    className="w-full text-xl font-bold mb-3 py-1 border-b-2 border-slate-200 bg-transparent focus:border-blue-400 focus:outline-none"
                  />
                  <textarea
                    value={value.description}
                    onChange={(e) => updateValue(index, { description: e.target.value })}
                    placeholder="What does this value mean to your team?"
                    className="w-full bg-transparent resize-none text-slate-500 min-h-[80px] focus:outline-none text-sm leading-relaxed"
                  />
                  <button
                    onClick={() => removeValue(index)}
                    className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{value.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{value.description}</p>
                </>
              )}
            </div>
          ))}

          {/* Add value button */}
          {isEditing && (
            <button
              onClick={addValue}
              className="p-8 rounded-3xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center min-h-[220px] group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: 'color-mix(in srgb, var(--company-primary) 15%, white)' }}
              >
                <Plus className="w-7 h-7" style={{ color: 'var(--company-primary)' }} />
              </div>
              <span className="font-semibold text-slate-500 group-hover:text-slate-700">Add Value</span>
            </button>
          )}
        </div>

        {/* Empty state */}
        {values.length === 0 && !isEditing && (
          <div className="text-center py-16 bg-slate-50 rounded-2xl">
            <p className="text-slate-400">No values added yet</p>
          </div>
        )}
      </div>
    </section>
  )
}
