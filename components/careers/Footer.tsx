'use client'

import { cn } from '@/lib/utils'

interface Props {
  companyName: string
  className?: string
  data?: {
    description?: string
    email?: string
    linkedin?: string
    twitter?: string
  }
}

export default function Footer({ companyName, className, data }: Props) {
  const currentYear = new Date().getFullYear()

  // Use dynamic description if provided, fallback to the old default
  const description = data?.description || "Defining the next generation of professional agility. Join a team where your craft is respected, your boundaries are honored, and your impact is tangible."

  return (
    <footer
      className={cn('pt-20 pb-12 border-t', className)}
      style={{ backgroundColor: 'var(--company-surface)', borderColor: 'rgba(0,0,0,0.05)' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Company info */}
          <div className="md:col-span-2">
            <h3
              className="text-2xl font-black tracking-tight mb-6"
              style={{ color: 'var(--company-primary)' }}
            >
              {companyName}
            </h3>
            <p className="max-w-sm text-lg leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--company-on-surface-variant)' }}>
              {description}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold mb-6 font-headline tracking-wide uppercase text-sm" style={{ color: 'var(--company-on-surface)' }}>Platform</h4>
            <ul className="space-y-4">
              <li>
                <a href="#about" className="font-medium transition-colors hover:text-black" style={{ color: 'var(--company-on-surface-variant)' }}>
                  Our Story
                </a>
              </li>
              <li>
                <a href="#life" className="font-medium transition-colors hover:text-black" style={{ color: 'var(--company-on-surface-variant)' }}>
                  Culture
                </a>
              </li>
              <li>
                <a href="#roles" className="font-medium transition-colors hover:text-black" style={{ color: 'var(--company-on-surface-variant)' }}>
                  Open Roles
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-6 font-headline tracking-wide uppercase text-sm" style={{ color: 'var(--company-on-surface)' }}>Connect</h4>
            <ul className="space-y-4 font-medium" style={{ color: 'var(--company-on-surface-variant)' }}>
              {data?.email ? (
                <li>
                  <a href={`mailto:${data.email}`} className="hover:text-black transition-colors">
                    {data.email}
                  </a>
                </li>
              ) : (
                <li className="hover:text-black transition-colors cursor-pointer">hello@{companyName.toLowerCase().replace(/\s/g, '')}.com</li>
              )}
              
              {data?.linkedin ? (
                <li>
                  <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                    LinkedIn
                  </a>
                </li>
              ) : (
                <li className="hover:text-black transition-colors cursor-pointer">LinkedIn</li>
              )}

              {data?.twitter ? (
                <li>
                  <a href={data.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                    Twitter / X
                  </a>
                </li>
              ) : (
                <li className="hover:text-black transition-colors cursor-pointer">Twitter / X</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: 'rgba(0,0,0,0.05)' }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--company-on-surface-variant)' }}>
            © {currentYear} {companyName}. All rights reserved.
          </p>

          <div className="flex gap-8">
            <a href="#" className="text-sm font-medium hover:text-black transition-colors" style={{ color: 'var(--company-on-surface-variant)' }}>
              Privacy Policy
            </a>
            <a href="#" className="text-sm font-medium hover:text-black transition-colors" style={{ color: 'var(--company-on-surface-variant)' }}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
