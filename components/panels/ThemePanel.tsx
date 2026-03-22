'use client'

import { useState, useEffect } from 'react'
import { CompanyTheme } from '@/lib/types'
import { X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  theme: CompanyTheme | null
  onUpdate: (updates: Partial<CompanyTheme>) => void
  onClose: () => void
}

const palettes = [
  { name: 'Ocean', primary: '#2563eb', secondary: '#64748b' },
  { name: 'Forest', primary: '#16a34a', secondary: '#475569' },
  { name: 'Sunset', primary: '#ea580c', secondary: '#57534e' },
  { name: 'Amethyst', primary: '#9333ea', secondary: '#52525b' },
  { name: 'Midnight', primary: '#0f172a', secondary: '#64748b' },
  { name: 'Crimson', primary: '#e11d48', secondary: '#71717a' },
]

export default function ThemePanel({ theme, onUpdate, onClose }: Props) {
  const [colors, setColors] = useState({
    primary: theme?.primary_color || '#2563eb',
    secondary: theme?.secondary_color || '#64748b',
  })

  useEffect(() => {
    if (theme) {
      setColors({
        primary: theme.primary_color,
        secondary: theme.secondary_color,
      })
    }
  }, [theme])

  const applyPalette = (primary: string, secondary: string) => {
    setColors({ primary, secondary })
    onUpdate({ primary_color: primary, secondary_color: secondary })
  }

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-full max-w-5xl z-50 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 p-6 md:p-8 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Theme Colors</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Palettes */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-3 block">
            Quick Palettes
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {palettes.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPalette(p.primary, p.secondary)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  colors.primary === p.primary
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                title={p.name}
              >
                <div className="flex w-full h-8 rounded-lg overflow-hidden mb-2">
                  <div className="w-1/2" style={{ backgroundColor: p.primary }} />
                  <div className="w-1/2" style={{ backgroundColor: p.secondary }} />
                </div>
                <span className="text-xs font-medium text-slate-700">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Primary Color</label>
            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => {
                    setColors({ ...colors, primary: e.target.value })
                    onUpdate({ primary_color: e.target.value })
                  }}
                  className="w-12 h-10 rounded-lg border border-slate-300 cursor-pointer p-1"
                />
              </div>
              <Input
                value={colors.primary}
                onChange={(e) => {
                  setColors({ ...colors, primary: e.target.value })
                  onUpdate({ primary_color: e.target.value })
                }}
                className="font-mono"
                placeholder="#2563eb"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Secondary Color</label>
            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => {
                    setColors({ ...colors, secondary: e.target.value })
                    onUpdate({ secondary_color: e.target.value })
                  }}
                  className="w-12 h-10 rounded-lg border border-slate-300 cursor-pointer p-1"
                />
              </div>
              <Input
                value={colors.secondary}
                onChange={(e) => {
                  setColors({ ...colors, secondary: e.target.value })
                  onUpdate({ secondary_color: e.target.value })
                }}
                className="font-mono"
                placeholder="#64748b"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="pt-4 border-t">
          <label className="text-sm font-semibold text-slate-700 mb-3 block">
            Preview
          </label>
          <div className="flex gap-4">
            <div
              className="w-16 h-16 rounded-xl shadow-md flex items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <span className="text-white font-bold text-sm">Primary</span>
            </div>
            <div
              className="w-16 h-16 rounded-xl shadow-md flex items-center justify-center border"
              style={{ backgroundColor: colors.secondary + '20', borderColor: colors.secondary }}
            >
              <span className="font-bold text-sm" style={{ color: colors.secondary }}>
                Secondary
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t flex justify-end">
        <Button onClick={onClose} className="gap-2">
          <Check className="w-4 h-4" />
          Done
        </Button>
      </div>
    </div>
  )
}
