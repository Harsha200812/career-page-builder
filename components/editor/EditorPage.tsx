'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import ThemeCustomizer from './ThemeCustomizer'
import SectionManager from './SectionManager'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  LayoutTemplate,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Palette,
  Lock,
  Undo,
  Building2,
  Link as LinkIcon,
  Eye,
  Layers,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import CompanyInfoEditor from './CompanyInfoEditor'

interface Props {
  slug: string
}

export default function EditorPage({ slug }: Props) {
  const [company, setCompany] = useState<{ id: string; name: string; description?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'info' | 'theme' | 'sections'>('info')
  const [refreshKey, setRefreshKey] = useState(0)
  const supabase = createClient()
  const router = useRouter()

  const fetchCompanyAndUpdate = async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('id, name, description')
      .eq('slug', slug)
      .single()
    if (!error && data) setCompany(data)
  }

  useEffect(() => {
    async function fetchCompany() {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, description')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Error fetching company:', error)
      } else if (data) {
        setCompany(data)
      }
      setLoading(false)
    }

    fetchCompany()
  }, [slug, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf8fe]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003083]"></div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf8fe]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1b1b1f]">Company Not Found</h1>
          <p className="text-[#434653] mt-2">Unable to load editor.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#fbf8fe] text-[#1b1b1f] font-sans antialiased min-h-screen flex overflow-hidden">
      {/* Left Sidebar */}
      <div className={cn(
        "relative flex h-screen flex-col bg-[#f6f2f8] overflow-x-hidden border-r border-[#c3c6d5]/15 flex-shrink-0 z-50 transition-all duration-300",
        isLeftSidebarOpen ? "w-64" : "w-16"
      )}>
        {/* Collapse toggle */}
        <button
          onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          className="absolute top-4 right-3 z-10 p-1.5 rounded-lg hover:bg-[#e4e1e7] transition-colors text-[#434653]"
        >
          {isLeftSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </button>
        <div className="flex h-full flex-col justify-between py-5 px-3">
          <div className="flex flex-col gap-8">
            {isLeftSidebarOpen && (
              <div className="flex gap-3 items-center pt-2 pr-8">
                <div className="bg-blue-100 flex items-center justify-center rounded-full size-10 shadow-sm text-blue-700 font-bold text-lg shrink-0">
                  {company.name.charAt(0)}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <h1 className="text-[#1b1b1f] font-bold text-lg leading-tight truncate">{company.name}</h1>
                  <p className="text-[#434653] text-sm">Recruiter Portal</p>
                </div>
              </div>
            )}
            {!isLeftSidebarOpen && (
              <div className="flex items-center justify-center pt-10">
                <div className="bg-blue-100 flex items-center justify-center rounded-full size-10 shadow-sm text-blue-700 font-bold text-lg">
                  {company.name.charAt(0)}
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-2 mt-4">
              <button onClick={() => alert('Dashboard coming soon!')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0edf2] transition-colors w-full text-left">
                <LayoutDashboard className="w-5 h-5 text-[#434653] shrink-0" />
                {isLeftSidebarOpen && <span className="text-[#1b1b1f] text-sm font-medium truncate">Dashboard</span>}
              </button>
              <button onClick={() => alert('Jobs manager coming soon!')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0edf2] transition-colors w-full text-left">
                <Briefcase className="w-5 h-5 text-[#434653] shrink-0" />
                {isLeftSidebarOpen && <span className="text-[#1b1b1f] text-sm font-medium truncate">Jobs</span>}
              </button>
              <button onClick={() => alert('Candidates manager coming soon!')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0edf2] transition-colors w-full text-left">
                <Users className="w-5 h-5 text-[#434653] shrink-0" />
                {isLeftSidebarOpen && <span className="text-[#1b1b1f] text-sm font-medium truncate">Candidates</span>}
              </button>
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#eae7ed] text-[#1b1b1f] shadow-sm w-full text-left">
                <LayoutTemplate className="w-5 h-5 text-[#003083] shrink-0" />
                {isLeftSidebarOpen && <span className="text-[#1b1b1f] text-sm font-semibold truncate">Careers Page</span>}
              </button>
              <button onClick={() => alert('Settings coming soon!')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0edf2] transition-colors w-full text-left">
                <Settings className="w-5 h-5 text-[#434653] shrink-0" />
                {isLeftSidebarOpen && <span className="text-[#1b1b1f] text-sm font-medium truncate">Settings</span>}
              </button>
            </nav>
          </div>

          <div className="flex flex-col gap-2 mt-8">
            <button onClick={() => alert('Help Center coming soon!')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0edf2] transition-colors w-full text-left">
              <HelpCircle className="w-5 h-5 text-[#434653] shrink-0" />
              {isLeftSidebarOpen && <span className="text-[#1b1b1f] text-sm font-medium">Help Center</span>}
            </button>
            <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0edf2] transition-colors text-left">
              <LogOut className="w-5 h-5 text-[#434653] shrink-0" />
              {isLeftSidebarOpen && <span className="text-[#1b1b1f] text-sm font-medium">Log Out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-[#fbf8fe] relative overflow-hidden h-screen">
        {/* Background glow effects */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#b3ebff] opacity-40 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#dbe1ff] opacity-30 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top Header */}
        <header className="flex justify-between items-center px-12 py-6 border-b border-[#c3c6d5]/15 bg-[#fbf8fe]/80 backdrop-blur-md absolute top-0 left-0 right-0 z-40">
          <div className="flex flex-col gap-1">
            <h2 className="text-[#1b1b1f] font-bold text-3xl tracking-tight">Careers Page Editor</h2>
            <p className="text-[#434653] text-sm">Customize your organic layers careers page</p>
          </div>
          <div className="flex gap-4">
            <a 
              href={`/${slug}/preview`}
              target="_blank"
              className="px-4 py-2.5 rounded-lg bg-[#eae7ed] text-[#1b1b1f] font-medium text-sm hover:opacity-80 transition-opacity shadow-sm flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview Mode
            </a>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/${slug}/careers`);
                alert('Public link copied to clipboard!');
              }}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#003083] to-[#0044b4] text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              Copy Share Link
            </button>
          </div>
        </header>

        {/* Live Preview Container */}
        <div className="w-full h-full pt-28 pb-4 px-4 overflow-hidden">
          <div className="w-full h-full bg-[#f6f2f8] rounded-t-2xl ring-1 ring-[#c3c6d5]/20 shadow-xl overflow-hidden flex flex-col relative">
            
            {/* Browser top-bar mockup */}
            <div className="bg-[#f0edf2] h-12 flex items-center px-4 gap-3 border-b border-[#c3c6d5]/15">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#c3c6d5]/80"></div>
                <div className="w-3 h-3 rounded-full bg-[#c3c6d5]/80"></div>
                <div className="w-3 h-3 rounded-full bg-[#c3c6d5]/80"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-[#e4e1e7] px-6 py-1.5 rounded-full text-xs text-[#434653] flex items-center gap-2 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  localhost:3000/{slug}/careers
                </div>
              </div>
              <div className="w-12"></div>
            </div>

            {/* Iframe for pure live preview matching the exact user view */}
            <div className="flex-1 w-full h-full bg-white relative">
              <iframe 
                key={refreshKey}
                src={`/${slug}/careers?timestamp=${refreshKey}`} 
                className="w-full h-full border-none"
                title="Careers Page Live Preview"
              />
              {/* Optional overlay to prevent clicking links in the iframe if it's strictly a visual preview */}
              <div className="absolute inset-0 pointer-events-none"></div>
            </div>

          </div>
        </div>

        {/* Floating Toggle Button for Sidebar */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-50 bg-[#003083] text-white w-10 h-24 rounded-l-2xl flex items-center justify-center cursor-pointer shadow-[-4px_0_12px_rgba(0,48,131,0.2)] transition-all duration-300",
            isSidebarOpen ? "right-[400px]" : "right-0"
          )}
        >
          {isSidebarOpen ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>

        {/* Right Editor Flyout Sidebar */}
        <aside 
          className={cn(
            "absolute top-0 right-0 h-full w-[400px] bg-white/95 backdrop-blur-2xl border-l border-[#c3c6d5]/20 z-40 transition-transform duration-300 shadow-[-12px_0_40px_rgba(27,27,31,0.1)] flex flex-col",
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col h-full pt-28">
            <div className="px-8 pb-4 border-b border-[#c3c6d5]/15">
              <h3 className="font-bold text-2xl text-[#1b1b1f]">Editor Tools</h3>
              <p className="text-[#434653] text-sm">Customize themes and sections</p>
            </div>

            {/* Custom Tabs */}
            <div className="flex px-8 pt-4 gap-4 border-b border-[#c3c6d5]/15 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('info')}
                className={cn(
                  "pb-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap",
                  activeTab === 'info' ? "border-[#003083] text-[#003083]" : "border-transparent text-[#434653] hover:text-[#1b1b1f]"
                )}
              >
                Information
              </button>
              <button 
                onClick={() => setActiveTab('theme')}
                className={cn(
                  "pb-3 text-sm font-semibold transition-colors border-b-2",
                  activeTab === 'theme' ? "border-[#003083] text-[#003083]" : "border-transparent text-[#434653] hover:text-[#1b1b1f]"
                )}
              >
                Theme
              </button>
              <button 
                onClick={() => setActiveTab('sections')}
                className={cn(
                  "pb-3 text-sm font-semibold transition-colors border-b-2",
                  activeTab === 'sections' ? "border-[#003083] text-[#003083]" : "border-transparent text-[#434653] hover:text-[#1b1b1f]"
                )}
              >
                Sections
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
              {activeTab === 'info' && (
                <section className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2 mb-6">
                    <Building2 className="w-5 h-5 text-[#003083]" />
                    <h4 className="font-semibold text-lg text-[#1b1b1f]">Company Settings</h4>
                  </div>
                  <CompanyInfoEditor 
                    companyId={company.id} 
                    initialName={company.name} 
                    initialDescription={company.description || undefined} 
                    onUpdate={() => {
                      setRefreshKey(prev => prev + 1)
                      // Re-fetch so the left sidebar name also updates
                      fetchCompanyAndUpdate()
                    }} 
                  />
                </section>
              )}

              {activeTab === 'theme' && (
                <section className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2 mb-6">
                    <Palette className="w-5 h-5 text-[#003083]" />
                    <h4 className="font-semibold text-lg text-[#1b1b1f]">Theme Settings</h4>
                  </div>
                  <ThemeCustomizer companyId={company.id} onUpdate={() => setRefreshKey(prev => prev + 1)} />
                </section>
              )}

              {activeTab === 'sections' && (
                <section className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#003083]" />
                      <h4 className="font-semibold text-lg text-[#1b1b1f]">Page Sections</h4>
                    </div>
                  </div>
                  <SectionManager companyId={company.id} onUpdate={() => setRefreshKey(prev => prev + 1)} />
                </section>
              )}
            </div>

            <div className="p-8 bg-[#f0edf2]/50 border-t border-[#c3c6d5]/15 mt-auto">
              <button onClick={() => alert('Revert features are disabled in this prototype.')} className="w-full py-3 rounded-xl bg-[#e4e1e7] text-[#1b1b1f] font-semibold text-sm hover:bg-[#dcd9de] transition-colors flex items-center justify-center gap-2 shadow-sm">
                <Undo className="w-4 h-4" />
                Revert All Changes
              </button>
            </div>
          </div>
        </aside>

      </main>
    </div>
  )
}
