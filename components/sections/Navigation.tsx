'use client'

import { useState, useEffect } from 'react'
import { Menu, X, LogOut } from 'lucide-react'

interface Props {
  companyName: string
  logoUrl?: string | null
  primaryColor?: string
  isEditMode?: boolean
  isRecruiter?: boolean
  onLogout?: () => void
}

export default function CareersNavigation({ companyName, logoUrl, primaryColor = '#2563eb', isEditMode, isRecruiter, onLogout }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Culture', href: '#life' },
    { label: 'Values', href: '#values' },
    { label: 'Open Roles', href: '#openings' },
  ]

  const topOffset = isEditMode ? 'top-[60px]' : 'top-0'

  return (
    <nav
      className={`sticky ${topOffset} z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Company Name */}
        <a href="#" className="flex items-center gap-3">
          {logoUrl && (
            <img src={logoUrl} alt={companyName} className="h-8 w-auto object-contain" />
          )}
          <span className="text-lg font-bold text-slate-900">{companyName}</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors nav-link"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#openings"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 shadow-lg"
            style={{ backgroundColor: primaryColor, boxShadow: `0 8px 20px ${primaryColor}25` }}
          >
            View Jobs
          </a>
          {/* Logout button for recruiters */}
          {isRecruiter && onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#openings"
            className="block py-3 rounded-xl text-sm font-bold text-white text-center"
            style={{ backgroundColor: primaryColor }}
            onClick={() => setMobileMenuOpen(false)}
          >
            View Jobs
          </a>
          {isRecruiter && onLogout && (
            <button
              onClick={() => { onLogout(); setMobileMenuOpen(false) }}
              className="flex w-full items-center gap-2 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
