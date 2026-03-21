'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateCompanyTheme } from '@/lib/actions'

interface Props {
  companyId: string
  onUpdate?: () => void
}

export default function ThemeCustomizer({ companyId, onUpdate }: Props) {
  const supabase = createClient()

  const [theme, setTheme] = useState<{
    primary_color: string
    secondary_color: string
    font_family: string
  }>({
    primary_color: '#2563eb',
    secondary_color: '#64748b',
    font_family: 'Inter',
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const palettes = [
    { name: 'Ocean', primary: '#2563eb', secondary: '#64748b' },
    { name: 'Forest', primary: '#16a34a', secondary: '#475569' },
    { name: 'Sunset', primary: '#ea580c', secondary: '#57534e' },
    { name: 'Amethyst', primary: '#9333ea', secondary: '#52525b' },
    { name: 'Midnight', primary: '#0f172a', secondary: '#64748b' },
    { name: 'Crimson', primary: '#e11d48', secondary: '#71717a' },
  ]

  const fonts = ['Inter', 'Poppins', 'DM Sans', 'Syne', 'Space Grotesk', 'Outfit']

  useEffect(() => {
    fetchTheme()
  }, [companyId])

  const fetchTheme = async () => {
    const { data, error } = await supabase
      .from('company_themes')
      .select('*')
      .eq('company_id', companyId)
      .single()

    if (data && !error) {
      setTheme({
        primary_color: data.primary_color || '#2563eb',
        secondary_color: data.secondary_color || '#64748b',
        font_family: data.font_family || 'Inter',
      })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const result = await updateCompanyTheme(companyId, {
        primary_color: theme.primary_color,
        secondary_color: theme.secondary_color,
        font_family: theme.font_family,
      })

      if (result.success) {
        setMessage({ type: 'success', text: 'Theme saved successfully!' })
        onUpdate?.()
      } else {
        setMessage({ type: 'error', text: 'Failed to save theme' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Curated Color Palettes */}
      <div className="space-y-3">
        <Label className="text-[#1b1b1f] font-semibold text-base">Color Palette</Label>
        <div className="grid grid-cols-3 gap-3">
          {palettes.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setTheme((prev) => ({ ...prev, primary_color: p.primary, secondary_color: p.secondary }))}
              className={`p-2 rounded-xl border flex flex-col gap-2 items-center transition-all ${
                theme.primary_color === p.primary ? 'border-[#003083] ring-1 ring-[#003083] bg-blue-50/30' : 'border-[#c3c6d5] hover:border-gray-400 bg-white'
              }`}
            >
              <div className="flex w-full h-10 rounded-lg overflow-hidden shadow-sm">
                <div className="w-1/2 h-full" style={{ backgroundColor: p.primary }}></div>
                <div className="w-1/2 h-full" style={{ backgroundColor: p.secondary }}></div>
              </div>
              <span className="text-xs font-semibold text-[#434653]">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Colors */}
      <div className="space-y-4 pt-4 border-t border-[#c3c6d5]/20">
        <Label className="text-[#434653] text-sm font-medium">Custom Exact Colors</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs text-[#757780]">Primary</span>
            <div className="flex gap-2">
              <Input
                type="color"
                value={theme.primary_color}
                onChange={(e) => setTheme((prev) => ({ ...prev, primary_color: e.target.value }))}
                className="w-12 h-10 p-1 cursor-pointer rounded-lg border-[#c3c6d5]"
              />
              <Input
                value={theme.primary_color}
                onChange={(e) => setTheme((prev) => ({ ...prev, primary_color: e.target.value }))}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-xs text-[#757780]">Secondary</span>
            <div className="flex gap-2">
              <Input
                type="color"
                value={theme.secondary_color}
                onChange={(e) => setTheme((prev) => ({ ...prev, secondary_color: e.target.value }))}
                className="w-12 h-10 p-1 cursor-pointer rounded-lg border-[#c3c6d5]"
              />
              <Input
                value={theme.secondary_color}
                onChange={(e) => setTheme((prev) => ({ ...prev, secondary_color: e.target.value }))}
                className="font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Font Family Selection */}
      <div className="space-y-3 pt-6 border-t border-[#c3c6d5]/20">
        <Label className="text-[#1b1b1f] font-semibold text-base">Typography</Label>
        <div className="grid grid-cols-2 gap-3">
          {fonts.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setTheme((prev) => ({ ...prev, font_family: f }))}
              className={`py-3 px-4 rounded-xl border text-sm transition-all focus:outline-none ${
                theme.font_family === f ? 'border-[#003083] bg-[#003083]/5 text-[#003083] font-bold shadow-sm' : 'border-[#c3c6d5] hover:bg-[#f6f2f8] bg-white text-[#434653]'
              }`}
              style={{ fontFamily: f }}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="pt-2">
          <Input
            value={theme.font_family}
            onChange={(e) => setTheme((prev) => ({ ...prev, font_family: e.target.value }))}
            placeholder="Custom font name (e.g. Roboto)"
            className="text-sm font-mono mt-2"
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? 'Saving...' : 'Save Theme'}
      </Button>
    </div>
  )
}
