'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import ThemeCustomizer from './ThemeCustomizer'
import SectionManager from './SectionManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  slug: string
}

export default function EditorPage({ slug }: Props) {
  const [company, setCompany] = useState<{ id: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCompany() {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Error fetching company:', error)
      } else if (data) {
        setCompany(data)
      }
      setLoading(false)
    }

    fetchCompany()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Company Not Found</h1>
          <p className="text-gray-600 mt-2">Unable to load editor.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-sm text-gray-500">Page Editor</p>
          </div>
          <div className="flex gap-3">
            <a
              href={`/${slug}/preview`}
              target="_blank"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Preview
            </a>
            <a
              href={`/${slug}/careers`}
              target="_blank"
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              View Live Page
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="theme" className="space-y-6">
          <TabsList>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Brand Theme</CardTitle>
                <CardDescription>Customize colors, fonts, and media to match your brand</CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeCustomizer companyId={company.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sections">
            <Card>
              <CardHeader>
                <CardTitle>Content Sections</CardTitle>
                <CardDescription>Add, remove, and reorder sections on your careers page</CardDescription>
              </CardHeader>
              <CardContent>
                <SectionManager companyId={company.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Job Management</CardTitle>
                <CardDescription>Manage job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Job management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
