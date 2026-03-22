'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowRight, Building2, Mail, Lock, Sparkles } from 'lucide-react'

export default function SignupPage() {
  const [step, setStep] = useState<'account' | 'company'>('account')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleAccountStep = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setError(null)
    setStep('company')
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim()) {
      setError('Company name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Create auth user — no emailRedirectTo so no confirmation email is sent
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
          data: { company_name: companyName },
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Account creation failed')

      // Check if we have an active session (email confirmation disabled)
      // or if the user needs to confirm first
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Email confirmation required — redirect to login with a notice
        setLoading(false)
        setStep('account')
        setError('Please check your email to confirm your account, then sign in.')
        return
      }

      // 2. Call the onboarding RPC to create company + link + theme + sections
      const slug = generateSlug(companyName)
      const { error: rpcError } = await supabase.rpc('onboard_company', {
        p_company_name: companyName.trim(),
        p_company_slug: slug,
        p_company_description: companyDescription.trim() || null,
      })

      if (rpcError) throw rpcError

      // 3. Redirect to the editor
      router.push(`/${slug}/careers`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-[#f8fafc]">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-[#f8fafc]">
        <div className="absolute top-[-15%] right-[-10%] w-[80vw] h-[80vw] bg-[#ede9fe]" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', filter: 'blur(120px)', opacity: 0.6 }}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-[#e0f2fe]" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', filter: 'blur(120px)', opacity: 0.6 }}></div>
        <div className="absolute top-1/3 left-1/3 w-[50vw] h-[50vw] bg-white" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', filter: 'blur(120px)', opacity: 0.6 }}></div>
      </div>

      <main className="relative z-10 w-full max-w-7xl px-6 lg:px-12 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
        
        {/* Left Side: Branding */}
        <section className="hidden lg:flex flex-col w-1/3 space-y-8">
          <div className="mb-4">
            <span className="text-3xl font-black tracking-tighter text-[#0f172a]">RecruitFlow</span>
          </div>
          
          <div className="rounded-[2rem] p-8 space-y-6" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">AI-Powered Builder</h3>
                <p className="text-xs text-slate-500">Create stunning pages in minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Custom Branding</h3>
                <p className="text-xs text-slate-500">Match your company identity</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-2xl bg-violet-100 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">One-Click Publish</h3>
                <p className="text-xs text-slate-500">Go live instantly</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Signup Form */}
        <section className="w-full max-w-md">
          <div className="rounded-[2.5rem] p-8 md:p-12 shadow-[0_25px_60px_-15px_rgba(0,71,171,0.08)]" style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255, 255, 255, 0.5)' }}>
            <div className="lg:hidden text-center mb-8">
              <span className="text-2xl font-black tracking-tighter text-[#0f172a]">RecruitFlow</span>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className={`w-8 h-1.5 rounded-full transition-colors ${step === 'account' ? 'bg-blue-600' : 'bg-blue-200'}`} />
              <div className={`w-8 h-1.5 rounded-full transition-colors ${step === 'company' ? 'bg-blue-600' : 'bg-blue-200'}`} />
            </div>

            {step === 'account' ? (
              <>
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-2">Create Account</h1>
                  <p className="text-[#475569] text-sm">Start building your careers page</p>
                </div>

                <form onSubmit={handleAccountStep} className="space-y-5">
                  {error && (
                    <div className="p-4 text-sm font-medium text-red-600 bg-red-50/80 rounded-2xl border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#475569] px-1" htmlFor="signup-email">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="signup-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full pl-11 pr-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-[#0047AB] focus:ring-4 focus:ring-[#0047AB]/5 transition-all text-[#0f172a] placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#475569] px-1" htmlFor="signup-password">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="signup-password"
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full pl-11 pr-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-[#0047AB] focus:ring-4 focus:ring-[#0047AB]/5 transition-all text-[#0f172a] placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-[#0047AB] hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-2">Your Company</h1>
                  <p className="text-[#475569] text-sm">We'll set up your careers page</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                  {error && (
                    <div className="p-4 text-sm font-medium text-red-600 bg-red-50/80 rounded-2xl border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#475569] px-1" htmlFor="company-name">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="company-name"
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Acme Inc."
                        className="w-full pl-11 pr-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-[#0047AB] focus:ring-4 focus:ring-[#0047AB]/5 transition-all text-[#0f172a] placeholder:text-slate-400"
                      />
                    </div>
                    {companyName && (
                      <p className="text-xs text-slate-400 px-1">
                        Page URL: <span className="font-mono text-blue-600">/{generateSlug(companyName)}/careers</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#475569] px-1" htmlFor="company-desc">
                      Brief Description (optional)
                    </label>
                    <textarea
                      id="company-desc"
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      placeholder="What does your company do?"
                      rows={3}
                      className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-[#0047AB] focus:ring-4 focus:ring-[#0047AB]/5 transition-all text-[#0f172a] placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setStep('account'); setError(null) }}
                      className="flex-1 py-4 px-6 bg-slate-100 text-slate-700 font-semibold rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] py-4 px-6 bg-[#0047AB] hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          Launch Page
                          <Sparkles className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            <p className="mt-10 text-center text-sm font-medium text-[#475569]">
              Already have an account?
              <Link className="text-[#0047AB] font-bold hover:text-blue-700 transition-colors ml-1" href="/login">
                Sign In
              </Link>
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
