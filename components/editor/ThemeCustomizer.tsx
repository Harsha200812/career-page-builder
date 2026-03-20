'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { updateCompanyTheme } from '@/lib/actions'
import { Upload } from 'lucide-react'

interface Props {
  companyId: string
}

export default function ThemeCustomizer({ companyId }: Props) {
  const [theme, setTheme] = useState<{
    primary_color: string
    secondary_color: string
    font_family: string
    banner_url: string | null
    logo_url: string | null
    culture_video_url: string | null
  }>({
    primary_color: '#2563eb',
    secondary_color: '#64748b',
    font_family: 'Inter',
    banner_url: null,
    logo_url: null,
    culture_video_url: null,
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient()

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
        banner_url: data.banner_url,
        logo_url: data.logo_url,
        culture_video_url: data.culture_video_url,
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
        banner_url: theme.banner_url,
        logo_url: theme.logo_url,
        culture_video_url: theme.culture_video_url,
      })

      if (result.success) {
        setMessage({ type: 'success', text: 'Theme saved successfully!' })
      } else {
        setMessage({ type: 'error', text: 'Failed to save theme' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' })
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'banner_url' | 'logo_url' | 'culture_video_url'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${companyId}/${field}.${fileExt}`
    const filePath = `theme-assets/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('careers-assets')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setMessage({ type: 'error', text: `Failed to upload ${field}` })
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('careers-assets')
      .getPublicUrl(filePath)

    setTheme((prev) => ({ ...prev, [field]: publicUrl }))
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

      {/* Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex gap-2">
            <Input
              id="primaryColor"
              type="color"
              value={theme.primary_color}
              onChange={(e) =>
                setTheme((prev) => ({ ...prev, primary_color: e.target.value }))
              }
              className="w-16 h-10 p-1"
            />
            <Input
              value={theme.primary_color}
              onChange={(e) =>
                setTheme((prev) => ({ ...prev, primary_color: e.target.value }))
              }
              placeholder="#2563eb"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryColor">Secondary Color</Label>
          <div className="flex gap-2">
            <Input
              id="secondaryColor"
              type="color"
              value={theme.secondary_color}
              onChange={(e) =>
                setTheme((prev) => ({ ...prev, secondary_color: e.target.value }))
              }
              className="w-16 h-10 p-1"
            />
            <Input
              value={theme.secondary_color}
              onChange={(e) =>
                setTheme((prev) => ({ ...prev, secondary_color: e.target.value }))
              }
              placeholder="#64748b"
            />
          </div>
        </div>
      </div>

      {/* Font */}
      <div className="space-y-2">
        <Label htmlFor="fontFamily">Font Family</Label>
        <Input
          id="fontFamily"
          value={theme.font_family}
          onChange={(e) =>
            setTheme((prev) => ({ ...prev, font_family: e.target.value }))
          }
          placeholder="Inter, Roboto, etc."
        />
      </div>

      {/* File Uploads */}
      <div className="space-y-4">
        <Label>Brand Assets</Label>

        {/* Banner */}
        <Card className="p-4">
          <div className="space-y-2">
            <Label>Banner Image</Label>
            <div className="flex items-center gap-4">
              {theme.banner_url && (
                <img
                  src={theme.banner_url}
                  alt="Banner"
                  className="h-20 w-40 object-cover rounded"
                />
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                <span>Upload Banner</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'banner_url')}
                />
              </label>
            </div>
          </div>
        </Card>

        {/* Logo */}
        <Card className="p-4">
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div className="flex items-center gap-4">
              {theme.logo_url && (
                <img
                  src={theme.logo_url}
                  alt="Logo"
                  className="h-20 w-40 object-contain rounded"
                />
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                <span>Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'logo_url')}
                />
              </label>
            </div>
          </div>
        </Card>

        {/* Culture Video */}
        <Card className="p-4">
          <div className="space-y-2">
            <Label>Culture Video (YouTube/Vimeo URL)</Label>
            <Input
              value={theme.culture_video_url || ''}
              onChange={(e) =>
                setTheme((prev) => ({ ...prev, culture_video_url: e.target.value }))
              }
              placeholder="https://youtube.com/embed/..."
            />
          </div>
        </Card>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? 'Saving...' : 'Save Theme'}
      </Button>
    </div>
  )
}
