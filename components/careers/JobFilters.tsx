'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, FilterX } from 'lucide-react'
import { Job } from '@/lib/types'
import JobCard from './JobCard'

interface Props {
  initialJobs: Job[]
}

export default function JobFilters({ initialJobs }: Props) {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
  })

  // Extract unique values from jobs
  const locations = useMemo(() =>
    Array.from(new Set(initialJobs.map(job => job.location))).sort(),
    [initialJobs]
  )

  const jobTypes = useMemo(() =>
    Array.from(new Set(initialJobs.map(job => job.job_type))).sort(),
    [initialJobs]
  )

  // Filter jobs based on current filters
  const filteredJobs = useMemo(() => {
    return initialJobs.filter(job => {
      const matchesSearch = !filters.search ||
        job.title.toLowerCase().includes(filters.search.toLowerCase())

      const matchesLocation = !filters.location ||
        filters.location === '*' || job.location === filters.location

      const matchesJobType = !filters.jobType ||
        filters.jobType === '*' || job.job_type === filters.jobType

      return matchesSearch && matchesLocation && matchesJobType
    })
  }, [initialJobs, filters])

  const [visibleCount, setVisibleCount] = useState(10)

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(10)
  }, [filters])

  const hasActiveFilters = filters.search || filters.location || filters.jobType

  const clearFilters = () => {
    setFilters({ search: '', location: '', jobType: '' })
  }

  return (
    <div className="space-y-8 max-w-[1000px] mx-auto">
      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center organic-shadow"
      >
        {/* Search */}
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--company-on-surface-variant)' }} />
          <Input
            placeholder="Search by job title..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-12 py-6 rounded-2xl bg-white/50 border-none font-medium outline-none focus-visible:ring-1"
            style={{ 
              color: 'var(--company-on-surface)',
              ['--tw-ring-color' as any]: 'var(--company-primary)' 
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex w-full md:w-auto gap-4">
          <Select
            value={filters.location}
            onValueChange={(value: string | null) => {
              if (value === null) return
              setFilters(prev => ({ ...prev, location: value }))
            }}
          >
            <SelectTrigger className="w-full md:w-[180px] py-6 rounded-2xl border-none bg-white/50 font-medium font-label backdrop-blur-md">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="*">All Locations</SelectItem>
              {locations.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Job Type Select */}
          <Select
            value={filters.jobType}
            onValueChange={(value: string | null) => {
              if (value === null) return
              setFilters(prev => ({ ...prev, jobType: value }))
            }}
          >
            <SelectTrigger className="w-full md:w-[150px] py-6 rounded-2xl border-none bg-white/50 font-medium font-label backdrop-blur-md">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="*">All Types</SelectItem>
              {jobTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
              title="Clear filters"
            >
              <FilterX className="h-5 w-5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Active filters display */}
      <div className="flex justify-between items-center px-2">
        <p className="font-semibold text-sm" style={{ color: 'var(--company-on-surface-variant)' }}>
          Showing {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Job List */}
      <motion.div layout className="mt-8 space-y-4">
        {filteredJobs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-[2rem] border-2 border-dashed border-slate-200"
          >
            <p className="text-lg font-medium" style={{ color: 'var(--company-on-surface-variant)' }}>
              No roles match your search.
            </p>
          </motion.div>
        ) : (
          <>
            {filteredJobs.slice(0, visibleCount).map((job, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                key={job.id}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
            
            {visibleCount < filteredJobs.length && (
              <motion.div layout className="flex justify-center pt-8">
                <button
                  onClick={() => setVisibleCount(prev => prev + 10)}
                  className="px-8 py-3 rounded-xl font-bold transition-all text-sm"
                  style={{ 
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    color: 'var(--company-on-surface-variant)'
                  }}
                >
                  Show More Roles
                </button>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
