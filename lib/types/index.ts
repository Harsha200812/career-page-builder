export interface Company {
  id: string
  slug: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  is_published: boolean
}

export interface CompanyTheme {
  company_id: string
  primary_color: string
  secondary_color: string
  font_family: string
  banner_url: string | null
  logo_url: string | null
  culture_video_url: string | null
}

export interface CompanySection {
  id: string
  company_id: string
  type: 'about' | 'life' | 'values' | 'benefits' | 'custom'
  title: string
  content: Record<string, any>
  sort_order: number
  is_visible: boolean
}

export interface Job {
  id: string
  company_id: string
  title: string
  location: string
  department: string
  work_policy: 'Remote' | 'Hybrid' | 'On-site'
  employment_type: string
  experience_level: string
  job_type: string
  salary_range: string | null
  slug: string
  posted_at: string
  is_active: boolean
}

export interface CompanyWithDetails extends Company {
  themes: CompanyTheme | null
  sections: CompanySection[]
  jobs: Job[]
}

export interface JobFilter {
  location?: string
  jobType?: string
  search?: string
}
