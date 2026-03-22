'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Plus, Pencil, Trash2, Eye, EyeOff, Briefcase, MapPin, DollarSign, Clock, Building2, GraduationCap, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { Job } from '@/lib/types'

interface Props {
  companyId: string
  initialJobs: Job[]
  onJobsChange: (jobs: Job[]) => void
  onClose: () => void
}

const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Operations', 'HR', 'Finance', 'Legal', 'Customer Success', 'Other']
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']
const WORK_POLICIES = ['Remote', 'Hybrid', 'On-site']
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager', 'Director', 'VP', 'C-Level']

interface JobForm {
  title: string
  department: string
  location: string
  employment_type: string
  work_policy: 'Remote' | 'Hybrid' | 'On-site'
  experience_level: string
  salary_range: string
  description: string
  requirements: string
  is_active: boolean
}

const emptyForm = (): JobForm => ({
  title: '',
  department: 'Engineering',
  location: '',
  employment_type: 'Full-time',
  work_policy: 'Hybrid',
  experience_level: 'Mid Level',
  salary_range: '',
  description: '',
  requirements: '',
  is_active: true,
})

export default function JobsPanel({ companyId, initialJobs, onJobsChange, onClose }: Props) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<JobForm>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const supabase = createClient()

  const syncJobs = (updated: Job[]) => {
    setJobs(updated)
    onJobsChange(updated)
  }

  const handleCreate = () => {
    setEditingJob(null)
    setForm(emptyForm())
    setShowForm(true)
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setForm({
      title: job.title || '',
      department: job.department || 'Engineering',
      location: job.location || '',
      employment_type: job.employment_type || 'Full-time',
      work_policy: (job.work_policy || 'Hybrid') as 'Remote' | 'Hybrid' | 'On-site',
      experience_level: job.experience_level || 'Mid Level',
      salary_range: job.salary_range || '',
      description: job.description || '',
      requirements: job.requirements || '',
      is_active: job.is_active,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      if (editingJob) {
        const { data, error } = await supabase
          .from('jobs')
          .update({ ...form, updated_at: new Date().toISOString() })
          .eq('id', editingJob.id)
          .eq('company_id', companyId)
          .select()
          .single()
        if (error) throw error
        syncJobs(jobs.map(j => j.id === editingJob.id ? data : j))
      } else {
        const { data, error } = await supabase
          .from('jobs')
          .insert({ ...form, company_id: companyId, posted_at: new Date().toISOString() })
          .select()
          .single()
        if (error) throw error
        syncJobs([data, ...jobs])
      }
      setShowForm(false)
      setEditingJob(null)
    } catch (err: any) {
      alert(`Failed to save job: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (job: Job) => {
    const { data, error } = await supabase
      .from('jobs')
      .update({ is_active: !job.is_active })
      .eq('id', job.id)
      .eq('company_id', companyId)
      .select()
      .single()
    if (!error && data) {
      syncJobs(jobs.map(j => j.id === job.id ? data : j))
    }
  }

  const handleDelete = async (job: Job) => {
    if (!confirm(`Delete "${job.title}"? This cannot be undone.`)) return
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', job.id)
      .eq('company_id', companyId)
    if (!error) {
      syncJobs(jobs.filter(j => j.id !== job.id))
    }
  }

  const activeJobs = jobs.filter(j => j.is_active)
  const archivedJobs = jobs.filter(j => !j.is_active)

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-full max-w-2xl z-50 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 max-h-[75vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">Jobs</h3>
          <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">{activeJobs.length} active</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Job
          </button>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 px-6 py-4">
        {showForm ? (
          /* Job Form */
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-slate-800">{editingJob ? 'Edit Job' : 'Create New Job'}</h4>
              <button onClick={() => setShowForm(false)} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Job Title *</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Department</label>
                <select
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                >
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Job Type</label>
                <select
                  value={form.employment_type}
                  onChange={e => setForm({ ...form, employment_type: e.target.value })}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                >
                  {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Work Policy</label>
                <select
                  value={form.work_policy}
                  onChange={e => setForm({ ...form, work_policy: e.target.value as 'Remote' | 'Hybrid' | 'On-site' })}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                >
                  {WORK_POLICIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Experience</label>
                <select
                  value={form.experience_level}
                  onChange={e => setForm({ ...form, experience_level: e.target.value })}
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                >
                  {EXPERIENCE_LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</label>
                <input
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="City, Country or Remote"
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Salary Range</label>
                <input
                  value={form.salary_range}
                  onChange={e => setForm({ ...form, salary_range: e.target.value })}
                  placeholder="e.g. $80k – $120k"
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Role overview, responsibilities..."
                rows={4}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Requirements</label>
              <textarea
                value={form.requirements}
                onChange={e => setForm({ ...form, requirements: e.target.value })}
                placeholder="Skills, qualifications, experience needed..."
                rows={3}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  className={`w-9 h-5 rounded-full transition-colors ${form.is_active ? 'bg-blue-600' : 'bg-slate-200'}`}
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow m-0.5 transition-transform ${form.is_active ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm font-medium text-slate-700">Publish immediately</span>
              </label>
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingJob ? 'Save Changes' : 'Create Job'}
              </button>
            </div>
          </div>
        ) : (
          /* Job List */
          <div className="space-y-2">
            {jobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-500">No jobs yet</p>
                <p className="text-xs text-slate-400 mt-1">Create your first job listing to start attracting talent</p>
              </div>
            )}

            {/* Active Jobs */}
            {activeJobs.map(job => (
              <JobRow
                key={job.id}
                job={job}
                expanded={expandedId === job.id}
                onExpand={() => setExpandedId(expandedId === job.id ? null : job.id)}
                onEdit={() => handleEdit(job)}
                onToggleActive={() => handleToggleActive(job)}
                onDelete={() => handleDelete(job)}
              />
            ))}

            {/* Archived Jobs */}
            {archivedJobs.length > 0 && (
              <div className="pt-3 mt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Archived ({archivedJobs.length})</p>
                {archivedJobs.map(job => (
                  <JobRow
                    key={job.id}
                    job={job}
                    expanded={expandedId === job.id}
                    onExpand={() => setExpandedId(expandedId === job.id ? null : job.id)}
                    onEdit={() => handleEdit(job)}
                    onToggleActive={() => handleToggleActive(job)}
                    onDelete={() => handleDelete(job)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function JobRow({ job, expanded, onExpand, onEdit, onToggleActive, onDelete }: {
  job: Job
  expanded: boolean
  onExpand: () => void
  onEdit: () => void
  onToggleActive: () => void
  onDelete: () => void
}) {
  return (
    <div className={`rounded-2xl border transition-all ${job.is_active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50'}`}>
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={onExpand}
      >
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${job.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm truncate ${job.is_active ? 'text-slate-900' : 'text-slate-400'}`}>{job.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{job.department} · {job.work_policy}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onEdit() }}
            className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onToggleActive() }}
            className={`p-1.5 rounded-lg transition-colors ${job.is_active ? 'hover:bg-amber-50 hover:text-amber-600' : 'hover:bg-emerald-50 hover:text-emerald-600'}`}
            title={job.is_active ? 'Archive' : 'Reactivate'}
          >
            {job.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-1.5">
          {job.location && <p className="text-xs text-slate-500 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {job.location}</p>}
          {job.salary_range && <p className="text-xs text-slate-500 flex items-center gap-1.5"><DollarSign className="w-3 h-3" /> {job.salary_range}</p>}
          {job.employment_type && <p className="text-xs text-slate-500 flex items-center gap-1.5"><Clock className="w-3 h-3" /> {job.employment_type}</p>}
          {job.experience_level && <p className="text-xs text-slate-500 flex items-center gap-1.5"><GraduationCap className="w-3 h-3" /> {job.experience_level}</p>}
          {job.description && <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">{job.description}</p>}
        </div>
      )}
    </div>
  )
}
