'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface Props {
  companyName: string
  tagline?: string
  description?: string
  logoUrl?: string | null
  bannerUrl?: string | null
  onPrimaryColor: string
  onSecondaryColor: string
}

export default function HeroSection({
  companyName,
  tagline = 'Careers',
  description = 'We\'re defining the next generation of professional agility. Join a team where your craft is respected, your boundaries are honored, and your impact is tangible.',
  logoUrl,
  bannerUrl,
  onPrimaryColor,
  onSecondaryColor,
}: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Textured Background Elements */}
      <div className="absolute inset-0 z-0 bg-[#fbf8fe]">
        {/* Background image with overlay */}
        {bannerUrl && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 2 }}
            src={bannerUrl}
            alt="Hero Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Organic Blobs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-20 -left-20 w-96 h-96 rounded-full blur-3xl mix-blend-multiply"
          style={{ backgroundColor: onPrimaryColor }}
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute bottom-20 -right-20 w-[30rem] h-[30rem] rounded-full blur-3xl mix-blend-multiply"
          style={{ backgroundColor: onSecondaryColor }}
        ></motion.div>
      </div>

      <div className="relative z-10 max-w-4xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="bg-white/70 backdrop-blur-2xl border border-white/60 p-12 md:p-20 rounded-[2.5rem] shadow-2xl text-center"
        >
          {logoUrl && (
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              src={logoUrl}
              alt={`${companyName} logo`}
              className="mx-auto h-20 w-auto mb-6 object-contain"
            />
          )}

          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full text-xs font-bold font-label tracking-widest uppercase"
            style={{
              backgroundColor: `${onSecondaryColor}20`,
              color: onSecondaryColor,
            }}
          >
            Careers at {companyName}
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8"
            style={{ color: 'var(--company-primary)' }}
          >
            {(tagline || 'Careers').split(' ').map((word, i, arr) => (
              <span key={i}>
                {i === arr.length - 1 ? (
                  <span style={{ color: onSecondaryColor, fontStyle: 'italic' }}>{word}</span>
                ) : (
                  word
                )}
                {i < arr.length - 1 ? ' ' : ''}
              </span>
            ))}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 text-balance"
            style={{ color: 'var(--company-on-surface-variant)' }}
          >
            {description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Link
              href="#roles"
              className="px-8 py-4 rounded-xl font-semibold transition-all hover:-translate-y-1 shadow-lg shadow-black/5"
              style={{
                backgroundColor: 'var(--company-primary)',
                color: 'white',
              }}
            >
              View Openings
            </Link>
            <Link
              href="#about"
              className="px-8 py-4 rounded-xl font-semibold transition-all hover:bg-black/5"
              style={{
                backgroundColor: 'var(--company-surface-container-high)',
                color: 'var(--company-primary)',
              }}
            >
              Learn Our Values
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
