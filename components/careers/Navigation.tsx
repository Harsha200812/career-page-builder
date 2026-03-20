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
        'fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4',
        'bg-background/80 backdrop-blur-xl border-b',
        'transition-all duration-300',
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href={`/${slug}/careers`}
          className="text-2xl font-black tracking-tight"
          style={{ color: 'var(--company-primary)' }}
        >
          {companyName}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#about"
            className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Our Story
          </a>
          <a
            href="#life"
            className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Life at {companyName}
          </a>
          <a
            href="#roles"
            className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Open Roles
          </a>
        </div>

        {/* CTA */}
        <div>
          <Link
            href="#roles"
            className="btn-primary inline-block"
            style={{
              backgroundColor: 'var(--company-primary)',
              color: 'var(--company-on-primary)',
            }}
          >
            Join the Talent Pool
          </Link>
        </div>
      </div>
    </nav>
  )
}
