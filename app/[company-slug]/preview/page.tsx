import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ 'company-slug': string }>
}

export default async function PreviewPage({ params }: PageProps) {
  const { 'company-slug': slug } = await params
  const supabase = await (await import('@/lib/supabase/server')).createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // For now, preview just redirects to careers page (which is public)
  // In a real app, you might add query param preview=true
  redirect(`/${slug}/careers?preview=true`)
}
