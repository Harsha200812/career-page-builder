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
  updateSection,
  updateCompanyTheme
} from '@/lib/actions'
import { ChevronDown, ChevronUp, Image as ImageIcon, CheckCircle2, Upload } from 'lucide-react'

interface Props {
  companyId: string
  onUpdate?: () => void
}

const STANDARD_SECTIONS = [
  { type: 'about', badge: 'ABOUT', defaultTitle: 'About Us', defaultContent: { text: '', image_url: '' } },
  { type: 'life', badge: 'LIFE', defaultTitle: 'Life at Company', defaultContent: { description: '', images: [] } },
  { type: 'values', badge: 'VALUES', defaultTitle: 'Our Values', defaultContent: { text: '' } },
  { type: 'benefits', badge: 'BENEFITS', defaultTitle: 'Perks & Benefits', defaultContent: { text: '' } },
  { type: 'custom', badge: 'FOOTER', defaultTitle: 'Footer', defaultContent: { description: '', email: '', linkedin: '', twitter: '' } },
]

export default function SectionManager({ companyId, onUpdate }: Props) {
  const [sections, setSections] = useState<any[]>([])
  const [theme, setTheme] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [companyId])

  const fetchData = async () => {
    const [sectionsRes, themeRes] = await Promise.all([
      supabase.from('company_sections').select('*').eq('company_id', companyId).order('sort_order', { ascending: true }),
      supabase.from('company_themes').select('*').eq('company_id', companyId).single()
    ])

    if (sectionsRes.data) setSections(sectionsRes.data)
    if (themeRes.data) setTheme(themeRes.data)
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading sections...</div>
  }

  return (
    <div className="space-y-4">
      {theme && (
        <HeroEditorCard 
          theme={theme} 
          companyId={companyId} 
          onUpdate={() => { fetchData(); onUpdate?.(); }} 
        />
      )}
      
      {STANDARD_SECTIONS.map((def, index) => {
        // Find existing section in DB
        const existingSection = sections.find(s => 
          s.type === def.type && (def.type !== 'custom' || s.title === 'Footer')
        )

        const sectionData = existingSection || {
          id: null,
          type: def.type,
          title: def.defaultTitle,
          content: def.defaultContent,
          is_visible: false,
          sort_order: index + 1 // Provide a default sort order
        }

        return (
          <SectionEditorCard
            key={`${def.type}-${def.defaultTitle}`}
            section={sectionData}
            badge={def.badge}
            companyId={companyId}
            onUpdate={() => {
              fetchData()
              onUpdate?.()
            }}
          />
        )
      })}
    </div>
  )
}

function SectionEditorCard({ section, badge, companyId, onUpdate }: { section: any, badge: string, companyId: string, onUpdate: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    title: section.title,
    content: section.content || {},
    is_visible: section.is_visible
  })
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const supabase = createClient()

  const handleSave = async () => {
    setSaving(true)
    setSaveSuccess(false)
    try {
      if (section.id) {
        // Update existing
        await updateSection(companyId, section.id, {
          title: formData.title,
          content: formData.content,
          is_visible: formData.is_visible
        })
      } else {
        // Create new
        await createSection(companyId, {
          type: section.type,
          title: formData.title,
          content: formData.content,
          is_visible: formData.is_visible,
          sort_order: section.sort_order || 0
        })
      }
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
      onUpdate()
    } catch (error: any) {
      alert(`Failed to save: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    // If section ID is missing (new section not saved yet), we generate a dummy id based on timestamp
    const sectionIdStr = section.id || `pending_${Date.now()}`
    const fileExt = file.name.split('.').pop()
    const fileName = `${companyId}/sections/${sectionIdStr}_${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('careers-assets')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      alert('Failed to upload image')
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('careers-assets')
      .getPublicUrl(fileName)

    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, [fieldName]: publicUrl }
    }))
  }

  const handleGalleryAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const sectionIdStr = section.id || `pending_${Date.now()}`
    const fileExt = file.name.split('.').pop()
    const fileName = `${companyId}/sections/${sectionIdStr}_gallery_${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('careers-assets')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      alert('Failed to upload image')
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('careers-assets')
      .getPublicUrl(fileName)

    const existingImages = formData.content.images || []
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, images: [...existingImages, publicUrl] }
    }))
  }

  const handleGalleryRemove = (indexToRemove: number) => {
    const existingImages = formData.content.images || []
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, images: existingImages.filter((_: any, i: number) => i !== indexToRemove) }
    }))
  }

  return (
    <Card className="bg-white shadow-sm border border-[#c3c6d5]/30 overflow-hidden transition-all duration-300">
      {/* Header (Always visible) */}
      <div 
        className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-[#fbf8fe] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${formData.is_visible ? 'bg-green-500' : 'bg-gray-300'}`} />
          <div>
            <h4 className="font-semibold text-[#1b1b1f]">{formData.title}</h4>
            <span className="text-xs text-[#757780] uppercase tracking-wider">{badge}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronUp className="w-5 h-5 text-[#434653]" /> : <ChevronDown className="w-5 h-5 text-[#434653]" />}
        </div>
      </div>

      {/* Expanded Body */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-[#c3c6d5]/15 bg-white">
          <div className="space-y-4">
            
            {(section.type !== 'custom' || section.title !== 'Footer') && (
              <div className="flex justify-between items-center bg-[#f0edf2]/50 p-3 rounded-xl">
                <span className="text-sm font-medium text-[#434653]">Show on Public Page</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.is_visible}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003083]"></div>
                </label>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[#1b1b1f] font-medium">Section Title</Label>
              <Input 
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-white"
              />
            </div>

            {/* Type-specific Fields */}
            {(section.type === 'about' || section.type === 'values' || section.type === 'benefits') && (
              <div className="space-y-2">
                <Label className="text-[#1b1b1f] font-medium">Text Content</Label>
                <Textarea 
                  value={formData.content.text || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: { ...prev.content, text: e.target.value } }))}
                  rows={4}
                  className="bg-white"
                />
              </div>
            )}

            {section.type === 'about' && (
              <div className="space-y-2">
                <Label className="text-[#1b1b1f] font-medium">Section Image</Label>
                <div className="flex items-center gap-4">
                  {formData.content.image_url ? (
                    <img src={formData.content.image_url} alt="Section Thumbnail" className="w-16 h-16 object-cover rounded-xl border border-[#c3c6d5]" />
                  ) : (
                    <div className="w-16 h-16 bg-[#f0edf2] rounded-xl border border-[#c3c6d5] flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-6 h-6 text-[#757780]" />
                    </div>
                  )}
                  <label className="px-4 py-2 bg-white border border-[#c3c6d5] rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer shadow-sm flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Image
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image_url')} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {section.type === 'life' && (
              <>
                <div className="space-y-2">
                  <Label className="text-[#1b1b1f] font-medium">Description</Label>
                  <Textarea 
                    value={formData.content.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: { ...prev.content, description: e.target.value } }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#1b1b1f] font-medium flex justify-between">
                    Image Gallery
                    <label className="text-[#003083] cursor-pointer hover:underline text-xs flex items-center gap-1">
                      <Upload className="w-3 h-3" /> Add Image
                      <input type="file" accept="image/*" onChange={handleGalleryAdd} className="hidden" />
                    </label>
                  </Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {(formData.content.images || []).map((url: string, idx: number) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video border border-[#c3c6d5]">
                        <img src={url} alt="Gallery item" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => handleGalleryRemove(idx)}
                          className="absolute inset-0 bg-red-500/80 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    {(formData.content.images || []).length === 0 && (
                      <div className="col-span-3 text-sm text-[#757780] py-4 text-center border-2 border-dashed border-[#c3c6d5] rounded-xl">
                        No images added to gallery yet.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {section.type === 'custom' && section.title === 'Footer' && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Footer Short Description</Label>
                  <Textarea 
                    value={formData.content.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: { ...prev.content, description: e.target.value } }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input 
                    value={formData.content.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: { ...prev.content, email: e.target.value } }))}
                    placeholder="e.g. careers@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input 
                    value={formData.content.linkedin || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: { ...prev.content, linkedin: e.target.value } }))}
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Twitter/X URL</Label>
                  <Input 
                    value={formData.content.twitter || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: { ...prev.content, twitter: e.target.value } }))}
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-gradient-to-r from-[#003083] to-[#0044b4] hover:opacity-90 min-w-[120px]"
              >
                {saving ? 'Saving...' : saveSuccess ? (
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Saved</span>
                ) : section.id ? 'Update Section' : 'Create Section'}
              </Button>
            </div>

          </div>
        </div>
      )}
    </Card>
  )
}

function HeroEditorCard({ theme, companyId, onUpdate }: { theme: any, companyId: string, onUpdate: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    hero_title: theme.hero_title || '',
    hero_subtitle: theme.hero_subtitle || '',
    banner_url: theme.banner_url || '',
    logo_url: theme.logo_url || '',
    culture_video_url: theme.culture_video_url || ''
  })
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const supabase = createClient()

  const handleSave = async () => {
    setSaving(true)
    setSaveSuccess(false)
    try {
      await updateCompanyTheme(companyId, formData)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
      onUpdate()
    } catch (error: any) {
      alert(`Failed to save: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'banner_url' | 'logo_url') => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${companyId}/theme/${field}_${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('careers-assets')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      alert('Failed to upload image')
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('careers-assets')
      .getPublicUrl(fileName)

    setFormData(prev => ({ ...prev, [field]: publicUrl }))
  }

  return (
    <Card className="bg-white shadow-sm border border-[#c3c6d5]/30 overflow-hidden transition-all duration-300 relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#003083] to-[#0044b4]" />
      <div 
        className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-[#fbf8fe] transition-colors pl-6"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h4 className="font-semibold text-[#1b1b1f]">Hero & Media</h4>
          <span className="text-xs text-[#757780] uppercase tracking-wider">Top Section</span>
        </div>
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronUp className="w-5 h-5 text-[#434653]" /> : <ChevronDown className="w-5 h-5 text-[#434653]" />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-[#c3c6d5]/15 bg-white pl-6">
          <div className="space-y-4">
            
            <div className="space-y-4">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="text-[#1b1b1f] font-medium">Company Logo</Label>
                <div className="flex items-center gap-4">
                  {formData.logo_url ? (
                    <img src={formData.logo_url} alt="Logo" className="w-16 h-16 object-contain rounded-md border border-[#c3c6d5] p-1" />
                  ) : (
                    <div className="w-16 h-16 bg-[#f0edf2] rounded-md border border-[#c3c6d5] flex items-center justify-center">
                      <span className="text-xs text-[#757780]">No Logo</span>
                    </div>
                  )}
                  <label className="px-4 py-2 bg-white border border-[#c3c6d5] rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer shadow-sm flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo_url')} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Banner Upload */}
              <div className="space-y-2">
                <Label className="text-[#1b1b1f] font-medium">Hero Background Banner</Label>
                <div className="flex items-center gap-4">
                  {formData.banner_url ? (
                    <img src={formData.banner_url} alt="Banner" className="w-32 h-16 object-cover rounded-md border border-[#c3c6d5]" />
                  ) : (
                    <div className="w-32 h-16 bg-[#f0edf2] rounded-md border border-[#c3c6d5] flex items-center justify-center">
                      <span className="text-xs text-[#757780]">No Banner</span>
                    </div>
                  )}
                  <label className="px-4 py-2 bg-white border border-[#c3c6d5] rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer shadow-sm flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Banner
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner_url')} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#c3c6d5]/15">
              <Label className="text-[#1b1b1f] font-medium">Hero Title</Label>
              <Input 
                value={formData.hero_title}
                onChange={(e) => setFormData(prev => ({ ...prev, hero_title: e.target.value }))}
                placeholder="e.g. Careers at Acme"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#1b1b1f] font-medium">Hero Subtitle</Label>
              <Textarea 
                value={formData.hero_subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                placeholder="e.g. Shaping the future"
                rows={2}
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-[#c3c6d5]/15">
              <Label className="text-[#1b1b1f] font-medium">Culture Video Snippet (YouTube/Vimeo Embed URL)</Label>
              <Input 
                value={formData.culture_video_url}
                onChange={(e) => setFormData(prev => ({ ...prev, culture_video_url: e.target.value }))}
                placeholder="e.g. https://www.youtube.com/embed/..."
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-gradient-to-r from-[#003083] to-[#0044b4] hover:opacity-90 min-w-[120px]"
              >
                {saving ? 'Saving...' : saveSuccess ? (
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Saved</span>
                ) : 'Save Hero & Media'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
