'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  companyId: string
  initialName: string
  initialDescription?: string
  onUpdate: (name: string, description: string) => void
  onClose: () => void
}

export default function CompanyPanel({
  companyId,
  initialName,
  initialDescription,
  onUpdate,
  onClose,
}: Props) {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription || '')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('companies')
        .update({ name, description })
        .eq('id', companyId)
      if (error) throw error
      onUpdate(name, description)
      onClose()
    } catch (error: any) {
      alert(`Failed to save: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-full max-w-2xl z-50 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 p-6 md:p-8 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold">Company Information</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">Company Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter company name"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">Short Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief company description (appears in hero and footer)"
            rows={4}
          />
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-1">Tips</h4>
          <p className="text-sm text-blue-800">
            The company name appears throughout the page (header, hero, footer). Keep it concise and recognizable.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
