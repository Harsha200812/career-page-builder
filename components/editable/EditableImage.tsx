'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Upload, Loader2, ImagePlus } from 'lucide-react'

interface Props {
  currentUrl?: string
  onUpload: (url: string) => void
  label?: string
  size?: 'sm' | 'md'
  className?: string
  /** 
   * 'button' renders a styled Button that triggers file picker.
   * 'zone' renders a clickable drop-zone area (used in Life gallery etc.)
   */
  variant?: 'button' | 'zone'
}

export default function EditableImage({
  currentUrl,
  onUpload,
  label = 'Upload Image',
  size = 'md',
  className = '',
  variant = 'button',
}: Props) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('careers-images')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('careers-images')
        .getPublicUrl(fileName)

      onUpload(publicUrl)
    } catch (error: any) {
      console.error('Upload failed:', error)
      alert(`Upload failed: ${error.message}`)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Hidden file input shared by both variants
  const hiddenInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
      aria-label={label}
    />
  )

  if (variant === 'zone') {
    return (
      <div
        onClick={triggerFileInput}
        className={`cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-3 p-6 ${className}`}
      >
        {hiddenInput}
        {uploading ? (
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <ImagePlus className="w-7 h-7 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-600">{label}</span>
          </>
        )}
      </div>
    )
  }

  // Default: button variant
  const buttonSize = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'

  return (
    <>
      {hiddenInput}
      <Button
        type="button"
        variant="outline"
        onClick={triggerFileInput}
        disabled={uploading}
        className={`gap-2 ${buttonSize} ${className}`}
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : currentUrl ? (
          'Change Image'
        ) : (
          <>
            <Upload className="w-4 h-4" />
            {label}
          </>
        )}
      </Button>
    </>
  )
}
