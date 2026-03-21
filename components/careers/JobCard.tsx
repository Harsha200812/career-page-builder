'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Job } from '@/lib/types'
import { ArrowRight } from 'lucide-react'

interface Props {
  job: Job
}

export default function JobCard({ job }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getWorkPolicyStyles = (policy: string) => {
    switch (policy) {
      case 'Remote':
        return { bg: 'rgba(38, 254, 220, 0.1)', text: 'var(--company-tertiary)' } // tertiary
      case 'Hybrid':
        return { bg: 'rgba(0, 68, 180, 0.1)', text: 'var(--company-primary)' }
      case 'On-site':
        return { bg: 'rgba(0, 103, 125, 0.1)', text: 'var(--company-secondary)' }
      default:
        return { bg: 'rgba(0,0,0,0.05)', text: 'var(--company-on-surface-variant)' }
    }
  }

  const policyStyle = getWorkPolicyStyles(job.work_policy)

  return (
    <motion.div 
      layout
      className={`group rounded-[1.5rem] p-6 md:p-8 transition-all duration-300 border-b-2 cursor-pointer ${isExpanded ? 'shadow-md border-transparent' : 'border-transparent hover:border-black/5'} bg-white`}
      onClick={() => setIsExpanded(!isExpanded)}
      style={{ backgroundColor: isExpanded ? 'var(--company-surface-container-lowest)' : 'var(--company-surface)' }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <motion.h3 layout="position" className="font-headline text-xl md:text-2xl font-bold" style={{ color: 'var(--company-on-surface)' }}>
              {job.title}
            </motion.h3>
            <motion.span 
              layout="position"
              className="px-3 py-1 rounded-full font-label text-[10px] font-bold tracking-widest uppercase"
              style={{ backgroundColor: policyStyle.bg, color: policyStyle.text }}
            >
              {job.work_policy} {job.location !== 'Remote' ? `(${job.location})` : ''}
            </motion.span>
          </div>
          <motion.p layout="position" className="font-medium text-sm md:text-base" style={{ color: 'var(--company-on-surface-variant)' }}>
            {job.department} • {job.employment_type}
          </motion.p>
        </div>

        <motion.button layout="position" className="flex items-center gap-2 font-bold group-hover:gap-4 transition-all" style={{ color: 'var(--company-primary)' }}>
          {isExpanded ? 'Close' : 'Details'} <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-8 pt-8 border-t border-black/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed" style={{ color: 'var(--company-on-surface-variant)' }}>
                <div>
                  <h4 className="font-bold mb-3 uppercase text-xs tracking-widest" style={{ color: 'var(--company-on-surface)' }}>The Role</h4>
                  <p>
                    Lead the vision for our core professional agility tools, focusing on seamless workflows and organic aesthetic consistency. As a {job.title}, you will be instrumental in driving our mission forward.
                  </p>
                  
                  {job.salary_range && (
                    <div className="mt-6">
                      <h4 className="font-bold mb-2 uppercase text-xs tracking-widest" style={{ color: 'var(--company-on-surface)' }}>Compensation</h4>
                      <p className="font-medium">{job.salary_range}</p>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold mb-3 uppercase text-xs tracking-widest" style={{ color: 'var(--company-on-surface)' }}>Key Details</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--company-primary)' }}></span>
                      Experience: {job.experience_level}
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--company-secondary)' }}></span>
                      Type: {job.job_type}
                    </li>
                  </ul>
                  
                  <div className="mt-8">
                    <button 
                      className="px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                      style={{ backgroundColor: 'var(--company-primary)', color: 'white' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Submit application logic here
                        alert('Application portal coming soon!');
                      }}
                    >
                      Apply for this role
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
