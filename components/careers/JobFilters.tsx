'use client'

import { useMemo, useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { cn } from '@/lib/utils'

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

  const hasActiveFilters = filters.search || filters.location || filters.jobType

  const clearFilters = () => {
    setFilters({ search: '', location: '', jobType: '' })
  }

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by job title..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10"
          />
        </div>

        {/* Location Select */}
        <Select
          value={filters.location}
          onValueChange={(value: string | null) => {
            if (value === null) return
            setFilters(prev => ({ ...prev, location: value }))
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="*">All Locations</SelectItem>
            {locations.map(loc => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
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
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="*">All Types</SelectItem>
            {jobTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            title="Clear filters"
          >
            <FilterX className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Search: {filters.search}
            </span>
          )}
          {filters.location && filters.location !== '*' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Location: {filters.location}
            </span>
          )}
          {filters.jobType && filters.jobType !== '*' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              Type: {filters.jobType}
            </span>
          )}
        </div>
      )}

      {/* Job count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredJobs.length} of {initialJobs.length} position{initialJobs.length !== 1 ? 's' : ''}
      </p>

      {/* Job List */}
      <div className="mt-6 space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs match your filters.</p>
          </div>
        ) : (
          filteredJobs.map(job => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  )
}
