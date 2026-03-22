import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ 'company-slug': string }>
}

export default async function EditPage({ params }: PageProps) {
  const { 'company-slug': slug } = await params
  const supabase = await (await import('@/lib/supabase/server')).createClient()

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get company by slug
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!company) {
    redirect('/')
  }

  // Verify user is a member of this company
  const { data: membership } = await supabase
    .from('company_users')
    .select('id')
    .eq('company_id', company.id)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    redirect('/')
  }

  // Redirect to careers page - editing is now inline
  redirect(`/${slug}/careers`)
}
