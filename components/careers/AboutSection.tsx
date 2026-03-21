'use client'

import { motion } from 'framer-motion'
import { Award, Code2, Users2 } from 'lucide-react'

interface Props {
  title?: string
  content: string
  imageUrl?: string
  companyName: string
}

export default function AboutSection({
  title = 'Our Story',
  content,
  imageUrl,
  companyName,
}: Props) {
  return (
    <section id="about" className="py-20 md:py-32 px-6 md:px-12 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Left side - Image with organic blob */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {imageUrl ? (
            <>
              {/* Organic blob accent */}
              <div
                className="asymmetric-blob absolute inset-0 -rotate-6 scale-110 opacity-30"
                style={{ backgroundColor: 'var(--company-secondary)' }}
              ></div>

              {/* Main image */}
              <img
                src={imageUrl}
                alt={`${companyName} team`}
                className="relative z-10 w-full rounded-[3rem] organic-shadow aspect-[4/5] object-cover"
              />
            </>
          ) : (
            <div className="relative z-10 w-full rounded-[3rem] organic-shadow aspect-[4/5] bg-slate-100 flex items-center justify-center">
              <span className="text-slate-400">Team Photo Placeholder</span>
            </div>
          )}

          {/* Badge/Award */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: 'spring', bounce: 0.5 }}
            className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full organic-shadow flex items-center justify-center p-6 z-20"
            style={{ backgroundColor: 'var(--company-surface-container-lowest)' }}
          >
            <div className="text-center">
              <p
                className="font-headline font-bold text-sm"
                style={{ color: 'var(--company-primary)' }}
              >
                Winner<br />
                <span className="text-xs font-normal" style={{ color: 'var(--company-on-surface-variant)' }}>
                  Culture & Design
                </span>
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side - Text content */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase font-label"
            style={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              color: 'var(--company-secondary)',
            }}
          >
            {title}
          </span>

          <h2
            className="font-headline text-4xl font-extrabold leading-tight"
            style={{ color: 'var(--company-on-surface)' }}
          >
            The Craft Behind the Code
          </h2>

          <div 
            className="text-lg leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--company-on-surface-variant)' }}
          >
            {content || `At ${companyName}, we don't just ship features; we engineer experiences.`}
          </div>

          <div className="grid grid-cols-1 gap-6 pt-4">
            <div className="flex gap-4 items-start">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--company-primary)', opacity: 0.1 }}
              >
                <Users2 className="absolute text-primary w-6 h-6" style={{ color: 'var(--company-primary)' }} />
              </div>
              <div>
                <h4 className="font-headline font-bold text-lg">Radical Intentionality</h4>
                <p className="text-sm" style={{ color: 'var(--company-on-surface-variant)' }}>
                  Every meeting has a purpose, every project has a soul, and every voice is heard.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--company-secondary)', opacity: 0.1 }}
              >
                <Code2 className="absolute text-primary w-6 h-6" style={{ color: 'var(--company-secondary)' }} />
              </div>
              <div>
                <h4 className="font-headline font-bold text-lg">Intellectual Autonomy</h4>
                <p className="text-sm" style={{ color: 'var(--company-on-surface-variant)' }}>
                  We hire experts to tell us what to do, not the other way around.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
