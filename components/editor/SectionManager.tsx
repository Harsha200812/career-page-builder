'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
  createSection,
  deleteSection,
  reorderSections,
  updateSection,
} from '@/lib/actions'
import { GripVertical, Plus, Trash2, Edit2 } from 'lucide-react'

interface Props {
  companyId: string
}

type SectionType = 'about' | 'life' | 'values' | 'benefits' | 'custom'

interface SectionFormData {
  type: SectionType
  title: string
  content: Record<string, any>
}

const DEFAULT_SECTIONS: SectionFormData[] = [
  {
    type: 'about',
    title: 'About Us',
    content: { text: '' },
  },
  {
    type: 'life',
    title: 'Life at Company',
    content: { description: '', images: [] },
  },
]

export default function SectionManager({ companyId }: Props) {
  const [sections, setSections] = useState<
    Array<{
      id: string
      type: SectionType
      title: string
      content: Record<string, any>
      sort_order: number
      is_visible: boolean
    }>
  >([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<SectionFormData>({
    type: 'about',
    title: '',
    content: {},
  })

  const supabase = createClient()

  useEffect(() => {
    fetchSections()
  }, [companyId])

  const fetchSections = async () => {
    const { data, error } = await supabase
      .from('company_sections')
      .select('*')
      .eq('company_id', companyId)
      .order('sort_order', { ascending: true })

    if (data && !error) {
      setSections(data as any)
    }
    setLoading(false)
  }

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingId) {
        await updateSection(companyId, editingId, {
          type: formData.type,
          title: formData.title,
          content: formData.content,
        })
      } else {
        await createSection(companyId, {
          type: formData.type,
          title: formData.title,
          content: formData.content,
          sort_order: sections.length,
          is_visible: true,
        })
      }

      setEditingId(null)
      setFormData({ type: 'about', title: '', content: {} })
      await fetchSections()
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this section?')) return

    try {
      await deleteSection(companyId, id)
      await fetchSections()
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    }
  }

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const newSections = [...sections]
    const [moved] = newSections.splice(fromIndex, 1)
    newSections.splice(toIndex, 0, moved)

    setSections(newSections)

    // Update sort_order in database using server action
    const sectionIds = newSections.map((s) => s.id)
    try {
      await reorderSections(companyId, sectionIds)
    } catch (error: any) {
      alert(`Error reordering: ${error.message}`)
      await fetchSections() // Revert
    }
  }

  const handleAddDefault = async () => {
    if (!confirm('Add default sections (About Us, Life at Company)?')) return

    try {
      for (const def of DEFAULT_SECTIONS) {
        await createSection(companyId, {
          type: def.type,
          title: def.title,
          content: def.content,
          sort_order: sections.length,
          is_visible: true,
        })
      }
      await fetchSections()
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading sections...</div>
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Section Form */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">
          {editingId ? 'Edit Section' : 'Add New Section'}
        </h3>
        <form onSubmit={handleSaveSection} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Section Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as SectionType,
                  }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="about">About</option>
                <option value="life">Life at Company</option>
                <option value="values">Values</option>
                <option value="benefits">Benefits</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g., About Us"
                required
              />
            </div>
          </div>

          {formData.type === 'about' && (
            <div className="space-y-2">
              <Label htmlFor="aboutText">Content</Label>
              <Textarea
                id="aboutText"
                value={formData.content.text || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, text: e.target.value },
                  }))
                }
                placeholder="Write about your company..."
                rows={6}
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add Section'}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null)
                  setFormData({ type: 'about', title: '', content: {} })
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Quick Add Defaults */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {sections.length} section{sections.length !== 1 ? 's' : ''}
        </p>
        <Button variant="outline" size="sm" onClick={handleAddDefault}>
          <Plus className="h-4 w-4 mr-1" />
          Add Default Sections
        </Button>
      </div>

      {/* Sections List */}
      <div className="space-y-2">
        {sections.map((section, index) => (
          <Card key={section.id} className="p-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="cursor-grab text-gray-400 hover:text-gray-600"
                onClick={() => {
                  if (sections.length > 1) {
                    const newIndex = index === 0 ? sections.length - 1 : 0
                    handleReorder(index, newIndex)
                  }
                }}
              >
                <GripVertical className="h-5 w-5" />
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{section.title}</span>
                  <span className="text-xs text-gray-500 capitalize">
                    ({section.type})
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {Object.keys(section.content).length} fields
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={section.is_visible}
                    onChange={async (e) => {
                      try {
                        await updateSection(companyId, section.id, {
                          is_visible: e.target.checked,
                        })
                        await fetchSections()
                      } catch (error: any) {
                        alert(`Error: ${error.message}`)
                      }
                    }}
                  />
                  Visible
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingId(section.id)
                    setFormData({
                      type: section.type,
                      title: section.title,
                      content: section.content,
                    })
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(section.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
            No sections yet. Add one above or use &quot;Add Default Sections&quot;.
          </div>
        )}
      </div>
    </div>
  )
}
