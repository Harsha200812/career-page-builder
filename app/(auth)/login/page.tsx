'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Get user's company
        const { data: membership } = await supabase
          .from('company_users')
          .select('company_id, companies!inner(slug)')
          .eq('user_id', session.user.id)
          .single()

        if (membership && membership.companies) {
          const companies: any = membership.companies
          const companySlug = Array.isArray(companies) ? companies[0]?.slug : companies.slug
          if (companySlug) {
            router.push(`/${companySlug}/edit`)
            return
          }
        }
        
        // No company assigned - could redirect to onboarding
        router.push('/')
      }
    }

    checkSession()
  }, [router, supabase])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      // Get user's company and redirect
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: membership } = await supabase
          .from('company_users')
          .select('company_id, companies!inner(slug)')
          .eq('user_id', session.user.id)
          .single()

        if (membership && membership.companies) {
          const companies: any = membership.companies
          const companySlug = Array.isArray(companies) ? companies[0]?.slug : companies.slug
          if (companySlug) {
            router.push(`/${companySlug}/edit`)
            return
          }
        }
        
        router.push('/')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-[#f8fafc]">
      {/* Background Organic Blobs */}
      <div className="fixed inset-0 z-0 bg-[#f8fafc]">
        <div className="absolute top-[-15%] left-[-10%] w-[80vw] h-[80vw] bg-[#e0f2fe]" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', filter: 'blur(120px)', opacity: 0.6 }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-[#f5f3ff]" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', filter: 'blur(120px)', opacity: 0.6 }}></div>
        <div className="absolute top-1/4 right-1/4 w-[50vw] h-[50vw] bg-white" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', filter: 'blur(120px)', opacity: 0.6 }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-[40vw] h-[40vw] bg-[#bae6fd]" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', filter: 'blur(120px)', opacity: 0.3 }}></div>
      </div>

      <main className="relative z-10 w-full max-w-7xl px-6 lg:px-12 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
        
        {/* Left Side: Testimonial & Branding */}
        <section className="hidden lg:flex flex-col w-1/3 space-y-8">
          <div className="mb-4">
            <span className="text-3xl font-black tracking-tighter text-[#0f172a] font-headline">RecruitFlow</span>
          </div>
          
          <div className="rounded-[2rem] p-1 overflow-hidden shadow-xl shadow-blue-100/20" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
            <div className="relative rounded-[1.8rem] overflow-hidden aspect-[4/5]">
              <img 
                alt="Professional recruiters collaborating" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTJPjL7PEiA-tNjQT1N2bgnEE8eIsl9hugahpq7OMdm-Mk9j882z8--_fKxHp3nFg5GTh8cgzAKSLpDOUvly8OZ4Rj-qY34cFtL3Ksr-4FD2A0i1sSR6jWDEQBb6Ttr2owzd86U7eY3ZNZC_cE1rRuj_PdSGWwKn_6779zeUEmd7QldM2sisbsDVWbzn-ceXV9W8ENlQkBf-Daa68xR2zyA7nBe5OaQhlr3_YBp7C6M_Tc-0wKIYg3bs06_b6f6yXjzfggRAlaLv8"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex gap-0.5 mb-3 text-amber-500">
                  <span className="text-sm">★</span><span className="text-sm">★</span><span className="text-sm">★</span><span className="text-sm">★</span><span className="text-sm">★</span>
                </div>
                <blockquote className="text-[#0f172a] text-sm font-semibold leading-relaxed italic mb-3">
                  "Azure Meridian has transformed our talent acquisition process, bringing infinite depth to every hire."
                </blockquote>
                <p className="text-xs font-bold text-[#0047AB] uppercase tracking-widest">Azure Meridian</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="w-full max-w-md">
          <div className="rounded-[2.5rem] p-8 md:p-12 shadow-[0_25px_60px_-15px_rgba(0,71,171,0.08)]" style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255, 255, 255, 0.5)' }}>
            <div className="lg:hidden text-center mb-8">
              <span className="text-2xl font-black tracking-tighter text-[#0f172a] font-headline">RecruitFlow</span>
            </div>
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold font-headline text-[#0f172a] tracking-tight mb-3">Sign In</h1>
              <p className="text-[#475569] font-body">Access the talent pool universe.</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-4 text-sm font-medium text-red-600 bg-red-50/80 rounded-2xl border border-red-100">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#475569] px-1" htmlFor="email">Recruiter Identity</label>
                <input 
                  id="email" 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@company.com" 
                  className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-[#0047AB] focus:ring-4 focus:ring-[#0047AB]/5 transition-all text-[#0f172a] placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#475569]" htmlFor="password">Security Key</label>
                  <a className="text-[10px] font-bold text-[#0047AB] hover:text-blue-700 uppercase tracking-wider transition-colors" href="#">Reset</a>
                </div>
                <input 
                  id="password" 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-[#0047AB] focus:ring-4 focus:ring-[#0047AB]/5 transition-all text-[#0f172a] placeholder:text-slate-400"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 px-6 bg-[#0047AB] hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? 'Authenticating...' : 'Enter Workspace'}
              </button>
            </form>

            {/* Google OAuth Option (Visual) */}
            <div className="relative flex items-center py-8">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Universal Access</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
            <button className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white border border-slate-200 text-[#0f172a] font-semibold rounded-2xl hover:bg-slate-50 transition-all group">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Continue with Google
            </button>
            <p className="mt-10 text-center text-sm font-medium text-[#475569]">
              New to the mission? 
              <Link className="text-[#0047AB] font-bold hover:text-blue-700 transition-colors ml-1" href="/">Join the Pool</Link>
            </p>
          </div>
          
          <div className="mt-8 flex justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
            <Link className="text-[10px] font-bold text-[#475569] uppercase tracking-widest hover:text-[#0047AB]" href="#">Privacy</Link>
            <Link className="text-[10px] font-bold text-[#475569] uppercase tracking-widest hover:text-[#0047AB]" href="#">Terms</Link>
            <Link className="text-[10px] font-bold text-[#475569] uppercase tracking-widest hover:text-[#0047AB]" href="#">Help</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
