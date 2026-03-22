'use client'

import EditableText from '@/components/editable/EditableText'
import { Mail, Linkedin, Twitter, Instagram, Globe } from 'lucide-react'

interface Props {
  companyName: string
  data?: any
  isEditing: boolean
  onUpdate: (updates: { content: any }) => void
}

export default function EditableFooter({ companyName, data, isEditing, onUpdate }: Props) {
  const content = data || {}
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-12 overflow-hidden">
      {/* Top wave / transition */}
      <div
        className="h-1 w-full"
        style={{ background: 'linear-gradient(90deg, var(--company-primary), color-mix(in srgb, var(--company-primary) 50%, #8b5cf6))' }}
      />

      {/* Main footer body */}
      <div
        className="px-6 md:px-12 pt-16 pb-10"
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 pb-12 border-b border-white/10">
            {/* Company Info – col span 1 */}
            <div>
              <h3
                className="text-2xl font-extrabold mb-3"
                style={{ color: 'var(--company-primary)' }}
              >
                {companyName}
              </h3>
              {isEditing ? (
                <EditableText
                  value={content.description || ''}
                  onChange={(value) => onUpdate({ content: { ...content, description: value } })}
                  placeholder="Company tagline or short description..."
                  as="textarea"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-slate-300 text-sm focus:ring-2 focus:ring-blue-400 min-h-[80px]"
                />
              ) : (
                <p className="text-slate-400 leading-relaxed text-sm">
                  {content.description || `Building the future, one career at a time.`}
                </p>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-slate-500 mb-5">
                Explore
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'About Us', href: '#about' },
                  { label: 'Life & Culture', href: '#life' },
                  { label: 'Our Values', href: '#values' },
                  { label: 'Benefits', href: '#benefits' },
                  { label: 'Open Roles', href: '#openings' },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-0 h-px bg-white group-hover:w-4 transition-all duration-200" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect / Socials */}
            <div>
              <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-slate-500 mb-5">
                Connect
              </h4>

              {isEditing ? (
                <div className="space-y-3">
                  {[
                    { icon: Mail, key: 'email', placeholder: 'careers@company.com', isEmail: true },
                    { icon: Globe, key: 'website', placeholder: 'https://company.com', isEmail: false },
                    { icon: Linkedin, key: 'linkedin', placeholder: 'LinkedIn URL', isEmail: false },
                    { icon: Twitter, key: 'twitter', placeholder: 'Twitter URL', isEmail: false },
                  ].map(({ icon: Icon, key, placeholder }) => (
                    <div key={key} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <input
                        value={content[key] || ''}
                        onChange={(e) => onUpdate({ content: { ...content, [key]: e.target.value } })}
                        placeholder={placeholder}
                        className="flex-1 px-3 py-1.5 text-sm bg-white/10 border border-white/20 rounded-lg text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {content.email && (
                    <a
                      href={`mailto:${content.email}`}
                      className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      {content.email}
                    </a>
                  )}
                  {content.website && (
                    <a
                      href={content.website}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Globe className="w-4 h-4" />
                      </div>
                      Website
                    </a>
                  )}
                  {content.linkedin && (
                    <a
                      href={content.linkedin}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Linkedin className="w-4 h-4" />
                      </div>
                      LinkedIn
                    </a>
                  )}
                  {content.twitter && (
                    <a
                      href={content.twitter}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Twitter className="w-4 h-4" />
                      </div>
                      Twitter / X
                    </a>
                  )}
                  {!content.email && !content.linkedin && !content.twitter && !content.website && (
                    <p className="text-slate-600 text-sm">No contact info yet</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-600">
              © {currentYear} <span className="text-slate-500">{companyName}</span>. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-slate-600">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
