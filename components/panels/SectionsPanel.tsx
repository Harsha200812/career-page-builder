'use client'

import { useState } from 'react'
import { CompanySection } from '@/lib/types'
import { X, Plus, GripVertical, Eye, EyeOff, ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  sections: CompanySection[]
  onUpdate: (id: string, updates: Partial<CompanySection>) => void
  onCreate: (type: CompanySection['type']) => void
  onDelete: (id: string) => void
  onReorder: (from: number, to: number) => void
  onToggleVisibility: (id: string, visible: boolean) => void
  onClose: () => void
}

const sectionTypes = [
  { type: 'about' as const, label: 'About', description: 'Company story and mission' },
  { type: 'life' as const, label: 'Life', description: 'Culture and workplace photos' },
  { type: 'values' as const, label: 'Values', description: 'Core company values' },
  { type: 'benefits' as const, label: 'Benefits', description: 'Perks and benefits' },
  { type: 'custom' as const, label: 'Custom', description: 'Any custom content' },
]

export default function SectionsPanel({
  sections,
  onUpdate,
  onCreate,
  onDelete,
  onReorder,
  onToggleVisibility,
  onClose,
}: Props) {
  const [creatingType, setCreatingType] = useState<CompanySection['type'] | null>(null)

  const handleCreate = (type: CompanySection['type']) => {
    onCreate(type)
    setCreatingType(null)
  }

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-full max-w-4xl z-50 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 p-6 md:p-8 max-h-[70vh] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Page Sections</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="group bg-white border rounded-xl p-4 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              {/* Drag handle */}
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onReorder(index, index - 1)}
                  disabled={index === 0}
                  className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onReorder(index, index + 1)}
                  disabled={index === sections.length - 1}
                  className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Title */}
              <div className="flex-1">
                <input
                  value={section.title}
                  onChange={(e) => onUpdate(section.id, { title: e.target.value })}
                  className="w-full font-semibold p-1 border-b border-transparent hover:border-slate-200 bg-transparent"
                />
                <span className="text-xs text-slate-500 uppercase tracking-wider">
                  {section.type}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleVisibility(section.id, section.is_visible)}
                  className={`p-2 rounded-lg ${
                    section.is_visible
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                  title={section.is_visible ? 'Hide' : 'Show'}
                >
                  {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(section.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Section Button */}
      <div className="pt-4 border-t mt-4">
        {!creatingType ? (
          <Button
            onClick={() => setCreatingType('about')}
            variant="outline"
            className="w-full py-6 border-dashed"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Section
          </Button>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {sectionTypes.map(({ type, label, description }) => (
              <button
                key={type}
                onClick={() => handleCreate(type)}
                className="p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-all"
              >
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs text-slate-500 mt-1">{description}</div>
              </button>
            ))}
            <button
              onClick={() => setCreatingType(null)}
              className="p-3 border rounded-lg hover:bg-slate-50 text-slate-600 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
