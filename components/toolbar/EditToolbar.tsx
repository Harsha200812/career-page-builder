'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  Edit3, Eye, Palette, Layers, Save, RefreshCw, Building2, 
  Globe, Lock, Link2, ExternalLink, Check, Briefcase, LogOut 
} from 'lucide-react'

interface Props {
  isEditMode: boolean
  onToggleEdit: () => void
  activePanel: 'theme' | 'sections' | 'company' | 'jobs' | null
  onPanelChange: (panel: 'theme' | 'sections' | 'company' | 'jobs' | null) => void
  companyName: string
  companySlug: string
  isPublished: boolean
  onPublishToggle: () => void
  saving: boolean
  lastSaved: Date | null
  isDirty: boolean
  onPublish: () => void
  onLogout?: () => void
}

export default function EditToolbar({
  isEditMode,
  onToggleEdit,
  activePanel,
  onPanelChange,
  companyName,
  companySlug,
  isPublished,
  onPublishToggle,
  saving,
  lastSaved,
  isDirty,
  onPublish,
  onLogout,
}: Props) {
  const [copied, setCopied] = useState(false)

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${companySlug}/careers`
    : `/${companySlug}/careers`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const input = document.createElement('input')
      input.value = publicUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }


  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      
      {/* Save Status Toast */}
      {isEditMode && (saving || lastSaved) && (
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg shadow-slate-900/20 transition-all">
          {saving ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Saving changes...
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              Saved at {lastSaved?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </>
          )}
        </div>
      )}

      {/* Main Toolbar Pill */}
      <div className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-2xl shadow-slate-200/50 rounded-full px-2 py-2 flex items-center gap-1.5">
        
        {/* Company Info */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50/50 rounded-full border border-slate-100 mr-1">
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
            {companyName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-slate-700 whitespace-nowrap max-w-[120px] truncate">
            {companyName}
          </span>
        </div>

        {/* Edit / Preview Mode Toggle */}
        <div className="bg-slate-100/50 p-1 rounded-full flex items-center gap-1">
          <button
            onClick={onToggleEdit}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
              !isEditMode ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={onToggleEdit}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
              isEditMode ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        {/* Admin Panels (Only in Edit Mode) */}
        {isEditMode && (
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <ToolbarButton
              active={activePanel === 'theme'}
              onClick={() => onPanelChange(activePanel === 'theme' ? null : 'theme')}
              icon={Palette}
              label="Theme"
            />
            <ToolbarButton
              active={activePanel === 'sections'}
              onClick={() => onPanelChange(activePanel === 'sections' ? null : 'sections')}
              icon={Layers}
              label="Sections"
            />
            <ToolbarButton
              active={activePanel === 'company'}
              onClick={() => onPanelChange(activePanel === 'company' ? null : 'company')}
              icon={Building2}
              label="Company"
            />
            <ToolbarButton
              active={activePanel === 'jobs'}
              onClick={() => onPanelChange(activePanel === 'jobs' ? null : 'jobs')}
              icon={Briefcase}
              label="Jobs"
            />
          </div>
        )}

        {/* Icon Actions: Preview Link & Copy Link */}
        <div className="pl-2 border-l border-slate-200 flex items-center gap-1">
          {/* Open Full Preview in New Tab */}
          <a
            href={`/${companySlug}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open full preview in new tab"
            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Copy Public Link */}
          <button
            onClick={handleCopyLink}
            title={copied ? 'Copied!' : 'Copy public link'}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-full transition-all",
              copied
                ? "text-emerald-600 bg-emerald-50"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            )}
          >
            {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Publish Action */}
        <div className="pl-2 border-l border-slate-200 ml-1 flex items-center gap-2">
          {isPublished && (
            <button
              onClick={() => {
                if (confirm('Unpublish this page? Candidates will no longer be able to view it.')) {
                  onPublishToggle()
                }
              }}
              disabled={saving}
              className="px-4 py-2 rounded-full text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
            >
              Unpublish
            </button>
          )}

          <button
            onClick={() => {
              if (isDirty || !isPublished) {
                if (confirm('Publish all draft changes to the public page?')) {
                  onPublish()
                }
              }
            }}
            disabled={saving || (!isDirty && isPublished)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm",
              !isDirty && isPublished
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md hover:shadow-blue-500/20"
            )}
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Publishing...</span>
              </>
            ) : (!isDirty && isPublished) ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Up to Date</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{isPublished ? 'Publish Changes' : 'Publish Page'}</span>
              </>
            )}
          </button>
        </div>

        {/* Logout (far right) */}
        {onLogout && (
          <div className="pl-2 border-l border-slate-200">
            <button
              onClick={onLogout}
              title="Logout"
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

function ToolbarButton({ 
  active, onClick, icon: Icon, label 
}: { 
  active: boolean, onClick: () => void, icon: any, label: string 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-all w-10 sm:w-auto justify-center overflow-hidden",
        active 
          ? "bg-blue-50 text-blue-600 shadow-inner" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
      title={label}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
