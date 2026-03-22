'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Company, CompanyTheme, CompanySection, Job } from '@/lib/types'
import CareersNavigation from '@/components/sections/Navigation'
import EditableHero from '@/components/sections/Hero'
import EditableAbout from '@/components/sections/About'
import EditableLife from '@/components/sections/Life'
import EditableValues from '@/components/sections/Values'
import EditableBenefits from '@/components/sections/Benefits'
import EditableCustom from '@/components/sections/Custom'
import EditableFooter from '@/components/sections/Footer'
import EditableJobs from '@/components/sections/Jobs'
import EditToolbar from '@/components/toolbar/EditToolbar'
import ThemePanel from '@/components/panels/ThemePanel'
import SectionsPanel from '@/components/panels/SectionsPanel'
import CompanyPanel from '@/components/panels/CompanyPanel'
import JobsPanel from '@/components/panels/JobsPanel'
import { cn } from '@/lib/utils'

interface Props {
  company: Company
  theme: CompanyTheme | null
  allSections: CompanySection[]
  visibleSections: CompanySection[]
  jobs: Job[]
  isRecruiter: boolean
  currentUserId?: string
}

export default function EditableCareersLayout({
  company,
  theme,
  allSections,
  visibleSections,
  jobs: initialJobs,
  isRecruiter,
  currentUserId,
}: Props) {
  const [isEditMode, setIsEditMode] = useState(isRecruiter)
  const [sections, setSections] = useState<CompanySection[]>(isRecruiter ? allSections : visibleSections)
  const [currentTheme, setCurrentTheme] = useState<CompanyTheme | null>(theme)
  const [currentCompany, setCurrentCompany] = useState(company)
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [activePanel, setActivePanel] = useState<'theme' | 'sections' | 'company' | 'jobs' | null>(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setSections(isRecruiter ? allSections : visibleSections)
  }, [isRecruiter, allSections, visibleSections])

  useEffect(() => {
    if (theme) setCurrentTheme(theme)
  }, [theme])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const saveWithFeedback = async (saveFn: () => Promise<void>) => {
    if (saving) return
    setSaving(true)
    try {
      await saveFn()
      setLastSaved(new Date())
      setIsDirty(false)
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save changes. Please check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const updateTheme = async (updates: Partial<CompanyTheme>) => {
    setIsDirty(true)
    const newTheme = { ...currentTheme!, ...updates }
    setCurrentTheme(newTheme)
    await saveWithFeedback(async () => {
      const { error } = await supabase
        .from('company_themes')
        .upsert({ company_id: company.id, ...updates }, { onConflict: 'company_id' })
      if (error) throw error
    })
  }

  const updateSection = async (sectionId: string, updates: Partial<CompanySection>) => {
    setIsDirty(true)
    setSections(sections.map(s => s.id === sectionId ? { ...s, ...updates } : s))
    await saveWithFeedback(async () => {
      const { error } = await supabase
        .from('company_sections')
        .update(updates)
        .eq('id', sectionId)
        .eq('company_id', company.id)
      if (error) throw error
    })
  }

  const createSection = async (type: CompanySection['type']) => {
    setIsDirty(true)
    const maxOrder = sections.reduce((max, s) => Math.max(max, s.sort_order), -1)
    const defaultTitles: Record<CompanySection['type'], string> = {
      about: 'About Us',
      life: 'Life at Company',
      values: 'Our Values',
      benefits: 'Benefits & Perks',
      custom: 'Custom Section',
    }
    const { data, error } = await supabase
      .from('company_sections')
      .insert({
        company_id: company.id,
        type,
        title: defaultTitles[type],
        content: getDefaultContent(type),
        sort_order: maxOrder + 1,
        is_visible: true,
      })
      .select()
      .single()
    if (error) throw error
    setSections([...sections, data])
  }

  const deleteSection = async (sectionId: string) => {
    if (!confirm('Delete this section?')) return
    setIsDirty(true)
    setSections(sections.filter(s => s.id !== sectionId))
    await saveWithFeedback(async () => {
      const { error } = await supabase
        .from('company_sections')
        .delete()
        .eq('id', sectionId)
        .eq('company_id', company.id)
      if (error) throw error
    })
  }

  const reorderSections = async (fromIndex: number, toIndex: number) => {
    const newSections = [...sections]
    const [moved] = newSections.splice(fromIndex, 1)
    newSections.splice(toIndex, 0, moved)
    const updates = newSections.map((s, idx) =>
      supabase.from('company_sections').update({ sort_order: idx }).eq('id', s.id).eq('company_id', company.id)
    )
    await Promise.all(updates)
    setSections(newSections)
    setIsDirty(true)
  }

  const toggleVisibility = async (sectionId: string, isVisible: boolean) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, is_visible: !isVisible } : s))
    setIsDirty(true)
    await saveWithFeedback(async () => {
      const { error } = await supabase
        .from('company_sections')
        .update({ is_visible: !isVisible })
        .eq('id', sectionId)
        .eq('company_id', company.id)
      if (error) throw error
    })
  }

  const togglePublish = async () => {
    const newState = !currentCompany.is_published
    setCurrentCompany({ ...currentCompany, is_published: newState })
    setIsDirty(true)
    await saveWithFeedback(async () => {
      const { error } = await supabase
        .from('companies')
        .update({ is_published: newState })
        .eq('id', company.id)
      if (error) throw error
    })
  }

  const primaryColor = currentTheme?.primary_color || '#2563eb'
  const secondaryColor = currentTheme?.secondary_color || '#64748b'
  const displaySections = isEditMode ? sections : sections.filter(s => s.is_visible)

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        '--company-primary': primaryColor,
        '--company-secondary': secondaryColor,
      } as React.CSSProperties}
    >
      {/* Recruiter Edit Toolbar */}
      {isRecruiter && (
        <EditToolbar
          isEditMode={isEditMode}
          onToggleEdit={() => setIsEditMode(!isEditMode)}
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          companyName={currentCompany.name}
          companySlug={company.slug}
          isPublished={currentCompany.is_published}
          onPublishToggle={togglePublish}
          saving={saving}
          lastSaved={lastSaved}
          isDirty={isDirty}
          onLogout={handleLogout}
        />
      )}

      {/* Panels */}
      {isEditMode && activePanel === 'theme' && (
        <ThemePanel theme={currentTheme} onUpdate={updateTheme} onClose={() => setActivePanel(null)} />
      )}
      {isEditMode && activePanel === 'sections' && (
        <SectionsPanel
          sections={sections}
          onUpdate={updateSection}
          onCreate={createSection}
          onDelete={deleteSection}
          onReorder={reorderSections}
          onToggleVisibility={toggleVisibility}
          onClose={() => setActivePanel(null)}
        />
      )}
      {isEditMode && activePanel === 'company' && (
        <CompanyPanel
          companyId={company.id}
          initialName={currentCompany.name}
          initialDescription={currentCompany.description || ''}
          onUpdate={(name, description) => {
            setCurrentCompany({ ...currentCompany, name, description })
          }}
          onClose={() => setActivePanel(null)}
        />
      )}
      {isEditMode && activePanel === 'jobs' && (
        <JobsPanel
          companyId={company.id}
          initialJobs={jobs}
          onJobsChange={setJobs}
          onClose={() => setActivePanel(null)}
        />
      )}

      {/* Main Content */}
      <main>
        {/* Navigation */}
        <CareersNavigation
          companyName={currentCompany.name}
          logoUrl={currentTheme?.logo_url}
          primaryColor={primaryColor}
          isEditMode={isRecruiter && isEditMode}
          isRecruiter={isRecruiter}
          onLogout={handleLogout}
        />

        {/* Hero */}
        <EditableHero
          company={currentCompany}
          theme={currentTheme}
          isEditing={isEditMode}
          onUpdate={updateTheme}
          jobCount={jobs.filter(j => j.is_active).length}
        />

        {/* Dynamic Sections */}
        {displaySections.map((section, idx) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: Math.min(idx * 0.1, 0.3) }}
          >
            <SectionWrapper
              section={section}
              isEditing={isEditMode}
              onUpdate={updateSection}
              onDelete={deleteSection}
              onToggleVisibility={toggleVisibility}
              canReorder={isEditMode && sections.length > 1}
              companyName={currentCompany.name}
            />
          </motion.div>
        ))}

        {/* Culture Video */}
        {currentTheme?.culture_video_url && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="py-20 px-6 md:px-12 max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-5xl font-bold mb-4"
                style={{ color: primaryColor }}
              >
                Inside {currentCompany.name}
              </h2>
            </div>
            <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <iframe
                src={currentTheme.culture_video_url.replace('/watch?v=', '/embed/').replace('youtu.be/', 'youtube.com/embed/')}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Company Culture"
              />
            </div>
          </motion.section>
        )}

        {/* Jobs Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <EditableJobs jobs={jobs} isEditing={isEditMode} companyId={company.id} />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <EditableFooter
            companyName={currentCompany.name}
            data={sections.find(s => s.type === 'custom' && s.title === 'Footer')?.content}
            isEditing={isEditMode}
            onUpdate={(updates) => {
              const footer = sections.find(s => s.type === 'custom' && s.title === 'Footer')
              if (footer) updateSection(footer.id, updates)
            }}
          />
        </motion.div>
      </main>
    </div>
  )
}

function SectionWrapper({
  section, isEditing, onUpdate, onDelete, onToggleVisibility, canReorder, companyName,
}: {
  section: CompanySection
  isEditing: boolean
  onUpdate: (id: string, updates: Partial<CompanySection>) => void
  onDelete: (id: string) => void
  onToggleVisibility: (id: string, visible: boolean) => void
  canReorder: boolean
  companyName: string
}) {
  const sectionId = section.type === 'about' ? 'about'
    : section.type === 'life' ? 'life'
    : section.type === 'values' ? 'values'
    : section.type === 'benefits' ? 'benefits'
    : undefined

  const renderSection = () => {
    const commonProps = {
      section,
      companyName,
      isEditing,
      onUpdate: (updates: Partial<CompanySection>) => onUpdate(section.id, updates),
    }
    switch (section.type) {
      case 'about': return <EditableAbout {...commonProps} />
      case 'life': return <EditableLife {...commonProps} />
      case 'values': return <EditableValues {...commonProps} />
      case 'benefits': return <EditableBenefits {...commonProps} />
      case 'custom':
        if (section.title === 'Footer') return null
        return <EditableCustom {...commonProps} />
      default: return null
    }
  }

  if (!isEditing) {
    return <div id={sectionId}>{renderSection()}</div>
  }

  return (
    <div
      id={sectionId}
      className="relative group border-2 border-dashed border-transparent hover:border-blue-200 rounded-2xl transition-all my-2 mx-2"
    >
      {/* Floating Edit Controls */}
      <div className="absolute -left-14 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => onToggleVisibility(section.id, section.is_visible)}
          className={`w-9 h-9 rounded-lg shadow-md flex items-center justify-center text-sm ${
            section.is_visible ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-50 text-slate-400 border border-slate-200'
          }`}
          title={section.is_visible ? 'Hide section' : 'Show section'}
        >
          {section.is_visible ? '👁' : '🙈'}
        </button>
        <button
          onClick={() => onDelete(section.id)}
          className="w-9 h-9 bg-red-50 text-red-500 rounded-lg shadow-md border border-red-200 hover:bg-red-100 flex items-center justify-center"
          title="Delete section"
        >
          🗑
        </button>
      </div>

      {/* Section badge */}
      <div className="relative">
        <div
          className="absolute -top-3 left-6 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10"
          style={{ backgroundColor: 'var(--company-primary)' }}
        >
          {section.type}
        </div>
        {renderSection()}
      </div>
    </div>
  )
}

function getDefaultContent(type: CompanySection['type']) {
  switch (type) {
    case 'about': return { text: '', image_url: '' }
    case 'life': return { description: '', images: [] }
    case 'values': return { values: [{ title: '', description: '' }] }
    case 'benefits': return { benefits: [{ title: '', description: '' }] }
    case 'custom': return { text: '' }
    default: return {}
  }
}
