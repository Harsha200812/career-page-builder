'use client'

import { Job } from '@/lib/types'
import { MapPin, Briefcase, Clock, DollarSign, ChevronRight } from 'lucide-react'

interface Props {
  job: Job
}

export default function JobCard({ job }: Props) {
  const policyColors: Record<string, { bg: string; text: string }> = {
    Remote: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    Hybrid: { bg: 'bg-amber-50', text: 'text-amber-700' },
    'On-site': { bg: 'bg-blue-50', text: 'text-blue-700' },
  }

  const policy = policyColors[job.work_policy] || { bg: 'bg-slate-50', text: 'text-slate-600' }

  const daysAgo = Math.floor(
    (Date.now() - new Date(job.posted_at).getTime()) / (1000 * 60 * 60 * 24)
  )
  const postedLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo}d ago`

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-100/50 hover:-translate-y-1 cursor-pointer">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${policy.bg} ${policy.text}`}>
              {job.work_policy}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-500">
              {job.department}
            </span>
            <span className="text-xs text-slate-400 ml-auto md:ml-0">{postedLabel}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[var(--company-primary)] transition-colors">
            {job.title}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              {job.employment_type}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {job.experience_level}
            </span>
            {job.salary_range && (
              <span className="inline-flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                {job.salary_range}
              </span>
            )}
          </div>
        </div>

        {/* Right: CTA */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--company-primary)] group-hover:translate-x-1 transition-transform">
            View Role
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
