'use client'

import { CompanySection } from '@/lib/types'
import EditableText from '@/components/editable/EditableText'
import { Plus, Trash2 } from 'lucide-react'

interface Props {
  section: CompanySection
  isEditing: boolean
  onUpdate: (updates: Partial<CompanySection>) => void
}

interface BenefitItem {
  title: string
  description: string
  emoji?: string
}

const DEFAULT_BENEFIT_EMOJIS = ['🏥', '📚', '🏡', '💰', '🏃', '🍔', '✈️', '🎮', '📱', '🌿']

export default function EditableBenefits({ section, isEditing, onUpdate }: Props) {
  const content = section.content || {}
  const benefits: BenefitItem[] = Array.isArray(content.benefits) ? content.benefits : []

  const updateBenefit = (index: number, updates: Partial<BenefitItem>) => {
    const newBenefits = benefits.map((b, i) => (i === index ? { ...b, ...updates } : b))
    onUpdate({ content: { ...content, benefits: newBenefits } })
  }

  const addBenefit = () => {
    const emoji = DEFAULT_BENEFIT_EMOJIS[benefits.length % DEFAULT_BENEFIT_EMOJIS.length]
    onUpdate({
      content: { ...content, benefits: [...benefits, { title: '', description: '', emoji }] },
    })
  }

  const removeBenefit = (index: number) => {
    onUpdate({
      content: { ...content, benefits: benefits.filter((_: any, i: number) => i !== index) },
    })
  }

  return (
    <section
      className="py-24 md:py-32 px-6 md:px-12 relative"
      style={{
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--company-primary) 4%, white) 0%, white 50%, color-mix(in srgb, var(--company-primary) 3%, white) 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.12em] uppercase mb-6"
            style={{ backgroundColor: 'color-mix(in srgb, var(--company-primary) 10%, white)', color: 'var(--company-primary)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--company-primary)' }} />
            Why You&apos;ll Love It Here
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
            <>
              <h2
                className="text-4xl md:text-5xl font-extrabold mb-4"
                style={{ color: 'var(--company-primary)' }}
              >
                {section.title}
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                We take care of our team with world-class benefits and perks
              </p>
            </>
          )}
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                {/* Emoji icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--company-primary) 10%, white)' }}
                >
                  {isEditing ? (
                    <input
                      value={benefit.emoji || DEFAULT_BENEFIT_EMOJIS[index % DEFAULT_BENEFIT_EMOJIS.length]}
                      onChange={(e) => updateBenefit(index, { emoji: e.target.value })}
                      className="w-8 text-center bg-transparent text-xl focus:outline-none"
                      maxLength={2}
                    />
                  ) : (
                    benefit.emoji || DEFAULT_BENEFIT_EMOJIS[index % DEFAULT_BENEFIT_EMOJIS.length]
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <>
                      <input
                        value={benefit.title}
                        onChange={(e) => updateBenefit(index, { title: e.target.value })}
                        placeholder="Benefit title"
                        className="w-full font-bold text-base mb-2 py-0.5 border-b-2 border-slate-200 bg-transparent focus:border-blue-400 focus:outline-none"
                      />
                      <textarea
                        value={benefit.description}
                        onChange={(e) => updateBenefit(index, { description: e.target.value })}
                        placeholder="Brief description"
                        className="w-full bg-transparent resize-none text-slate-500 text-sm min-h-[60px] focus:outline-none leading-relaxed"
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="font-bold text-base text-slate-900 mb-1">{benefit.title}</h3>
                      <p className="text-slate-500 leading-relaxed text-sm">{benefit.description}</p>
                    </>
                  )}
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={() => removeBenefit(index)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          {/* Add benefit button */}
          {isEditing && (
            <button
              onClick={addBenefit}
              className="p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-center min-h-[120px] group"
            >
              <div className="text-center">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--company-primary) 15%, white)' }}
                >
                  <Plus className="w-5 h-5" style={{ color: 'var(--company-primary)' }} />
                </div>
                <span className="text-sm font-semibold text-slate-500">Add Benefit</span>
              </div>
            </button>
          )}
        </div>

        {/* Empty state */}
        {benefits.length === 0 && !isEditing && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-400">No benefits listed yet</p>
          </div>
        )}
      </div>
    </section>
  )
}
