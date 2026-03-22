'use client'

import { Company, CompanyTheme } from '@/lib/types'
import { motion } from 'framer-motion'
import EditableText from '@/components/editable/EditableText'
import EditableImage from '@/components/editable/EditableImage'
import { Briefcase, ArrowRight, Upload } from 'lucide-react'

interface Props {
  company: Company
  theme: CompanyTheme | null
  isEditing: boolean
  onUpdate: (updates: Partial<CompanyTheme>) => void
  jobCount?: number
}

export default function EditableHero({ company, theme, isEditing, onUpdate, jobCount = 0 }: Props) {
  const primaryColor = theme?.primary_color || '#2563eb'
  const secondaryColor = theme?.secondary_color || '#64748b'

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
      {/* Modern Abstract Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-20"
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-10"
          style={{ backgroundColor: secondaryColor }}
        />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full pt-32">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-12 items-center">
          
          {/* Left Column: Typography & CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left pt-12 lg:pt-0"
          >
            {/* Logo container */}
            <div className="mb-8">
              {isEditing ? (
                <div className="group relative inline-block">
                  {theme?.logo_url ? (
                    <div className="h-16 lg:h-20 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-4 border border-slate-100 relative z-10 flex items-center justify-center">
                      <img src={theme.logo_url} alt={company.name} className="h-full w-auto object-contain" />
                    </div>
                  ) : (
                    <div className="h-16 lg:h-20 px-8 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-sm text-slate-400">
                      No Logo Uploaded
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl z-20 backdrop-blur-sm">
                    <EditableImage
                      currentUrl={theme?.logo_url || ''}
                      onUpload={(url) => onUpdate({ logo_url: url })}
                      label="Upload Logo"
                      size="sm"
                    />
                  </div>
                </div>
              ) : (
                theme?.logo_url && (
                  <div className="h-16 lg:h-20 inline-block bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-4 border border-slate-100">
                    <img src={theme.logo_url} alt={`${company.name} logo`} className="h-full w-auto object-contain" />
                  </div>
                )
              )}
            </div>

            {/* Hiring Badge */}
            <div className="mb-6">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-[0.2em] uppercase shadow-sm border"
                style={{
                  backgroundColor: `${primaryColor}10`,
                  color: primaryColor,
                  borderColor: `${primaryColor}20`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                We're Hiring
              </span>
            </div>

            {/* Headline */}
            <div className="mb-6 w-full">
              {isEditing ? (
                <EditableText
                  value={theme?.hero_title || `Build the future with ${company.name}`}
                  onChange={(value) => onUpdate({ hero_title: value })}
                  placeholder="Enter a compelling headline..."
                  as="textarea"
                  rows={2}
                  className="w-full text-center lg:text-left bg-transparent border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-4 text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight resize-none"
                  style={{ color: '#0f172a' }}
                />
              ) : (
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-slate-900">
                  {theme?.hero_title || `Build the future with ${company.name}`}
                </h1>
              )}
            </div>

            {/* Subtitle */}
            <div className="mb-10 w-full max-w-xl">
              {isEditing ? (
                <EditableText
                  value={theme?.hero_subtitle || company.description || ''}
                  onChange={(value) => onUpdate({ hero_subtitle: value })}
                  placeholder="Add a compelling tagline..."
                  as="textarea"
                  className="w-full text-center lg:text-left bg-transparent border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-4 text-lg md:text-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-lg md:text-xl leading-relaxed text-slate-600">
                  {theme?.hero_subtitle || company.description || 'Join our team and build something extraordinary together.'}
                </p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
              <a
                href="#openings"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white overflow-hidden transition-all hover:scale-105 shadow-lg shadow-slate-200"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10">Explore Open Roles</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>
              {jobCount > 0 && !isEditing && (
                <div className="flex items-center justify-center px-6 py-4 rounded-2xl border-2 border-slate-100 bg-white shadow-sm text-slate-700 font-semibold gap-2">
                  <Briefcase className="w-5 h-5 text-slate-400" />
                  {jobCount} Open Positions
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Visual / Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 relative w-full aspect-[4/3] lg:aspect-auto lg:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100"
          >
            {isEditing ? (
              <div className="w-full h-full group relative">
                {theme?.banner_url ? (
                  <img src={theme.banner_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-4 bg-slate-50">
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                      <Upload className="w-8 h-8 opacity-50 text-slate-500" />
                    </div>
                    <span className="font-medium text-slate-500">No Hero Banner</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white rounded-2xl p-6 shadow-xl text-center max-w-[280px]">
                    <h4 className="font-bold text-slate-800 mb-2">Hero Image</h4>
                    <p className="text-sm text-slate-500 mb-6">Showcase your office, your team, or your product.</p>
                    <EditableImage
                      currentUrl={theme?.banner_url || ''}
                      onUpload={(url) => onUpdate({ banner_url: url })}
                      label="Upload High-Res Photo"
                    />
                  </div>
                </div>
              </div>
            ) : (
              theme?.banner_url ? (
                <img src={theme.banner_url} alt="Company workspace" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <span className="text-slate-400 font-medium">Careers at {company.name}</span>
                </div>
              )
            )}
            
            {/* Soft inner glow overlay */}
            <div className="absolute inset-0 rounded-[2rem] pointer-events-none ring-1 ring-inset ring-black/10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
