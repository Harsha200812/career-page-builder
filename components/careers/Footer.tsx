'use client'

import { cn } from '@/lib/utils'

interface Props {
  companyName: string
  className?: string
}

export default function Footer({ companyName, className }: Props) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn('py-12 border-t', className)}
      style={{ backgroundColor: 'var(--company-surface)' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company info */}
          <div className="md:col-span-2">
            <h3
              className="text-2xl font-black tracking-tight mb-4"
              style={{ color: 'var(--company-primary)' }}
            >
              {companyName}
            </h3>
            <p className="max-w-md text-muted-foreground">
              We're defining the next generation of professional agility. Join us and be part of something extraordinary.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--company-primary)' }}>Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#life" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Life at {companyName}
                </a>
              </li>
              <li>
                <a href="#roles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Open Roles
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--company-primary)' }}>Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>hello@{companyName.toLowerCase().replace(/\s/g, '')}.com</li>
              <li>+1 (555) 123-4567</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-sm text-muted-foreground">
            © {currentYear} {companyName}. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
