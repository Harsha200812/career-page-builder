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
        'fixed top-0 w-full z-50 px-8 py-4 bg-background/80 backdrop-blur-xl shadow-sm transition-all duration-300',
        className
      )}
    >
      <div className="flex justify-between items-center max-w-[1440px] mx-auto">
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
            className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Our Story
          </a>
          <a
            href="#life"
            className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Culture
          </a>
          <a
            href="#roles"
            className="font-body text-sm font-bold border-b-2 pb-1 transition-colors"
            style={{ 
              color: 'var(--company-primary)',
              borderColor: 'var(--company-primary)'
            }}
          >
            Open Roles
          </a>
        </div>

        {/* CTA */}
        <Link
          href="#roles"
          className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 duration-300 ease-out shadow-lg shadow-black/5"
          style={{
            backgroundColor: 'var(--company-primary)',
            color: 'white',
          }}
        >
          Join the Talent Pool
        </Link>
      </div>
    </nav>
  )
}
