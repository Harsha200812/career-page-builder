'use client'

import { useState, useMemo } from 'react'
import { Job } from '@/lib/types'
import JobCard from '@/components/careers/JobCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, MapPin, Briefcase, Building2, X } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

interface Props {
  jobs: Job[]
  isEditing: boolean
  companyId: string
}

export default function EditableJobs({ jobs, isEditing, companyId }: Props) {
  const supabase = createClient()
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [department, setDepartment] = useState('')
  const [jobType, setJobType] = useState('')
  const [showAll, setShowAll] = useState(false)

  const INITIAL_JOBS_COUNT = 6

  const locations = useMemo(() => Array.from(new Set(jobs.map(j => j.location))).sort(), [jobs])
  const departments = useMemo(() => Array.from(new Set(jobs.map(j => j.department))).sort(), [jobs])
  const jobTypes = useMemo(() => Array.from(new Set(jobs.map(j => j.job_type))).sort(), [jobs])

  const filteredJobs = useMemo(() => {
    const q = search.toLowerCase()
    return jobs.filter(job => {
      if (q && !job.title.toLowerCase().includes(q) && !job.department.toLowerCase().includes(q)) return false
      if (location && job.location !== location) return false
      if (department && job.department !== department) return false
      if (jobType && job.job_type !== jobType) return false
      return true
    })
  }, [jobs, search, location, department, jobType])

  const displayedJobs = showAll ? filteredJobs : filteredJobs.slice(0, INITIAL_JOBS_COUNT)
  const hasMoreJobs = filteredJobs.length > INITIAL_JOBS_COUNT
  const hasActiveFilters = search || location || department || jobType

  const clearFilters = () => {
    setSearch('')
    setLocation('')
    setDepartment('')
    setJobType('')
  }

  // ─────────── Recruiter Edit Mode ───────────
  if (isEditing) {
    return (
      <section id="openings" className="py-20 md:py-28 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--company-primary)' }}>
            Open Positions
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-4">
            {jobs.filter(j => j.is_active).length} active job{jobs.filter(j => j.is_active).length !== 1 ? 's' : ''} listed
          </p>
          <p className="text-sm text-slate-400">
            Use the <span className="font-semibold text-blue-600">Jobs</span> panel in the toolbar to manage positions.
          </p>
        </div>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className={`bg-white rounded-xl p-5 border shadow-sm ${job.is_active ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{job.department}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${job.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {job.is_active ? 'Active' : 'Archived'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {jobs.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-2xl">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-2">No jobs yet</p>
            <p className="text-sm text-slate-400">Click <span className="font-semibold text-blue-600">Jobs</span> in the toolbar to create your first listing.</p>
          </div>
        )}
      </section>
    )
  }

  // ─────────── Candidate Public View ───────────
  return (
    <section id="openings" className="py-20 md:py-28 px-6 md:px-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
          style={{ backgroundColor: 'var(--company-primary)10', color: 'var(--company-primary)' }}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Open Positions
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--company-primary)' }}>
          Join Our Team
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Find your next opportunity and help us shape the future.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-8">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by job title or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 rounded-xl border-slate-200 text-base"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {/* Location */}
          <FilterPill
            label="Location"
            icon={<MapPin className="w-3.5 h-3.5" />}
            options={locations}
            value={location}
            onChange={setLocation}
          />
          {/* Department */}
          <FilterPill
            label="Department"
            icon={<Building2 className="w-3.5 h-3.5" />}
            options={departments}
            value={department}
            onChange={setDepartment}
          />
          {/* Job Type */}
          <FilterPill
            label="Job Type"
            icon={<Briefcase className="w-3.5 h-3.5" />}
            options={jobTypes}
            value={jobType}
            onChange={setJobType}
          />

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700">{filteredJobs.length}</span> of{' '}
        <span className="font-semibold text-slate-700">{jobs.length}</span> positions
      </div>

      {/* Job List */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Search className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium mb-2">No positions match your criteria</p>
            <p className="text-sm text-slate-400 mb-4">Try adjusting your filters or search terms</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <>
            {displayedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}

            {hasMoreJobs && (
              <div className="text-center pt-6">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: 'var(--company-primary)', color: 'white' }}
                >
                  {showAll ? 'Show Less' : `Show ${filteredJobs.length - INITIAL_JOBS_COUNT} More Positions`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

// ─────────── Filter Pill Component ───────────
function FilterPill({
  label,
  icon,
  options,
  value,
  onChange,
}: {
  label: string
  icon: React.ReactNode
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  if (options.length === 0) return null

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none inline-flex items-center gap-1.5 pl-3 pr-8 py-2 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
          value
            ? 'bg-[var(--company-primary)] text-white border-transparent'
            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
        }`}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className={`w-3 h-3 ${value ? 'text-white' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
