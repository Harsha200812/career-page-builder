'use client'

import { Job } from '@/lib/types'
import { MapPin, Building, Clock, Briefcase, DollarSign } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  job: Job
}

export default function JobCard({ job }: Props) {
  const getWorkPolicyColor = (policy: string) => {
    switch (policy) {
      case 'Remote':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'Hybrid':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'On-site':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    // Different colors for employment types
    const colors = {
      'Full-time': 'bg-purple-100 text-purple-800',
      'Contract': 'bg-orange-100 text-orange-800',
      'Part-time': 'bg-teal-100 text-teal-800',
      'Internship': 'bg-pink-100 text-pink-800',
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="job-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Job info */}
        <div className="flex-1 space-y-3">
          {/* Title & badges */}
          <div className="space-y-3">
            <h3
              className="text-xl font-bold leading-tight"
              style={{ color: 'var(--company-primary)' }}
            >
              {job.title}
            </h3>

            <div className="flex flex-wrap gap-2">
              {/* Work Policy Badge */}
              <span
                className={`badge ${getWorkPolicyColor(job.work_policy)}`}
              >
                {job.work_policy}
              </span>

              {/* Employment Type Badge */}
              <span className={`badge ${getTypeColor(job.employment_type)}`}>
                {job.employment_type}
              </span>

              {/* Department Badge */}
              <span className="badge bg-gray-100 text-gray-700">
                {job.department}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>{job.experience_level}</span>
            </div>

            {job.salary_range && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium text-foreground">{job.salary_range}</span>
              </div>
            )}
          </div>
        </div>

        {/* Apply button */}
        <div className="flex-shrink-0">
          <Button
            className={cn(
              buttonVariants({ variant: 'default' }),
              'px-6 py-3 rounded-xl'
            )}
            style={{ backgroundColor: 'var(--company-primary)' }}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  )
}
