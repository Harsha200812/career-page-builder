'use client'

import { Input } from '@/components/ui/input'

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ColorPicker({ value, onChange, className = '' }: ColorPickerProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer p-1"
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute bottom-0 left-0 right-0 h-8 text-xs text-center bg-white/80 backdrop-blur rounded-b-lg"
        placeholder="#000000"
      />
    </div>
  )
}
