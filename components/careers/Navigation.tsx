'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Props {
  companyName: string
  slug: string
  className?: string
}

export default function Navigation({ companyName, slug, className }: Props) {
  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300',
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href={`/${slug}/careers`}
          className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
          style={{ color: 'var(--company-primary)' }}
        >
          {companyName}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#about"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Our Story
          </a>
          <a
            href="#life"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Culture
          </a>
          <a
            href="#values"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Values
          </a>
          <a
            href="#openings"
            className="text-sm font-bold px-4 py-2 rounded-lg"
            style={{
              color: 'var(--company-primary)',
              backgroundColor: 'var(--company-primary)10'
            }}
          >
            Open Roles
          </a>
        </div>

        {/* CTA */}
        <Link
          href="#openings"
          className="hidden md:inline-flex px-6 py-2.5 rounded-xl font-semibold transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          style={{
            backgroundColor: 'var(--company-primary)',
            color: 'white',
          }}
        >
          View Positions
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded-lg hover:bg-slate-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
