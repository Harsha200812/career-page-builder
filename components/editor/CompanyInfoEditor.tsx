'use client'

import { useState } from 'react'
import { updateCompanyInfo } from '@/lib/actions'
import { Building2 } from 'lucide-react'

interface Props {
  companyId: string
  initialName: string
  initialDescription?: string
  onUpdate?: () => void
}

export default function CompanyInfoEditor({ companyId, initialName, initialDescription, onUpdate }: Props) {
  const [formData, setFormData] = useState({
    name: initialName,
    description: initialDescription || '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const result = await updateCompanyInfo(companyId, formData)
      if (result.success) {
        setMessage({ type: 'success', text: 'Company info saved successfully!' })
        onUpdate?.()
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#1b1b1f] mb-1.5 block">Company Name</span>
          <input
            type="text"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-[#c3c6d5] bg-white focus:outline-none focus:ring-2 focus:ring-[#003083]/20 focus:border-[#003083] transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Acme Corp"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#1b1b1f] mb-1.5 block">Short Description</span>
          <textarea
            className="w-full px-4 py-2.5 rounded-xl border border-[#c3c6d5] bg-white focus:outline-none focus:ring-2 focus:ring-[#003083]/20 focus:border-[#003083] transition-all"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your company's mission and culture..."
            rows={4}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#003083] to-[#0044b4] text-white font-semibold flex justify-center items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Building2 className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Company Info'}
      </button>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
    </form>
  )
}
