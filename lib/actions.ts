'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CompanyTheme, CompanySection } from '@/lib/types'

// ============================================
// Company Theme Actions
// ============================================

export async function updateCompanyTheme(
  companyId: string,
  themeData: Partial<CompanyTheme>
) {
  const supabase = await createClient()

  // Check auth - get user session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Verify user belongs to this company
  const { data: membership } = await supabase
    .from('company_users')
    .select('id')
    .eq('company_id', companyId)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    throw new Error('Forbidden - Not a member of this company')
  }

  const { error } = await supabase
    .from('company_themes')
    .upsert({
      company_id: companyId,
      ...themeData,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    throw new Error(`Failed to update theme: ${error.message}`)
  }

  revalidatePath(`/[company-slug]/careers`)
  revalidatePath(`/[company-slug]/preview`)
  return { success: true }
}

// ============================================
// Company Sections Actions
// ============================================

export async function reorderSections(companyId: string, sectionIds: string[]) {
  const supabase = await createClient()

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Update sort_order for each section
  const updates = sectionIds.map((id, index) =>
    supabase
      .from('company_sections')
      .update({ sort_order: index })
      .eq('id', id)
      .eq('company_id', companyId)
  )

  await Promise.all(updates)
  revalidatePath(`/[company-slug]/careers`)
  revalidatePath(`/[company-slug]/preview`)
  return { success: true }
}

export async function updateSection(
  companyId: string,
  sectionId: string,
  updates: Partial<CompanySection>
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('company_sections')
    .update(updates)
    .eq('id', sectionId)
    .eq('company_id', companyId)

  if (error) {
    throw new Error(`Failed to update section: ${error.message}`)
  }

  revalidatePath(`/[company-slug]/careers`)
  return { success: true }
}

export async function createSection(
  companyId: string,
  sectionData: Omit<CompanySection, 'id' | 'company_id' | 'created_at' | 'updated_at'>
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.from('company_sections').insert({
    company_id: companyId,
    ...sectionData,
  })

  if (error) {
    throw new Error(`Failed to create section: ${error.message}`)
  }

  revalidatePath(`/[company-slug]/careers`)
  return { success: true }
}

export async function deleteSection(companyId: string, sectionId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('company_sections')
    .delete()
    .eq('id', sectionId)
    .eq('company_id', companyId)

  if (error) {
    throw new Error(`Failed to delete section: ${error.message}`)
  }

  revalidatePath(`/[company-slug]/careers`)
  return { success: true }
}

// ============================================
// Jobs Actions (for future use)
// ============================================

export async function createJob(companyId: string, jobData: any) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.from('jobs').insert({
    company_id: companyId,
    ...jobData,
  })

  if (error) {
    throw new Error(`Failed to create job: ${error.message}`)
  }

  revalidatePath(`/[company-slug]/careers`)
  return { success: true }
}

export async function updateJob(companyId: string, jobId: string, jobData: any) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('jobs')
    .update(jobData)
    .eq('id', jobId)
    .eq('company_id', companyId)

  if (error) {
    throw new Error(`Failed to update job: ${error.message}`)
  }

  revalidatePath(`/[company-slug]/careers`)
  return { success: true }
}

export async function deleteJob(companyId: string, jobId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId)
    .eq('company_id', companyId)

  if (error) {
    throw new Error(`Failed to delete job: ${error.message}`)
  }

  revalidatePath(`/[company-slug]/careers`)
  return { success: true }
}
