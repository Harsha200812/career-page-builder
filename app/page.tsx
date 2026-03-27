import Link from 'next/link'
import { ArrowRight, Palette, Layout, Globe, Briefcase, Sparkles, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <span className="text-2xl font-black tracking-tight text-slate-900">
          Recruit<span className="text-blue-600">Flow</span>
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/whitecarrot-io/careers"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:inline"
          >
            Live Demo
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all hover:-translate-y-0.5 shadow-lg shadow-slate-900/10"
          >
            Recruiter Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Background blobs */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-100/60 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-100/50 blur-[100px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Careers Page Builder
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-6">
            Your brand.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Their next career.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Build branded, mobile‑friendly careers pages in minutes. Customize themes, manage job listings, and attract world‑class talent — no code required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/whitecarrot-io/careers"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-base shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
            >
              View Live Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold text-base hover:bg-white hover:border-slate-300 transition-all"
            >
              Start Building
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything recruiters need
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              One platform to build, customize, and publish branded careers pages for any company.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Palette,
                title: 'Brand Theming',
                description: 'Set custom colors, logos, banners, and fonts to match your company identity.',
                color: 'blue',
              },
              {
                icon: Layout,
                title: 'Section Builder',
                description: 'Add, reorder, and customize content sections — About, Life, Values, Benefits — your way.',
                color: 'indigo',
              },
              {
                icon: Briefcase,
                title: 'Job Management',
                description: 'Create, edit, and manage job listings with smart filters for location, department, and type.',
                color: 'violet',
              },
              {
                icon: Globe,
                title: 'SEO Ready',
                description: 'Server‑rendered pages with meta tags, Open Graph, and structured data for search engines.',
                color: 'emerald',
              },
              {
                icon: Shield,
                title: 'Multi‑Tenant',
                description: 'Each company gets its own branded page and data isolation. Scale to hundreds of companies.',
                color: 'amber',
              },
              {
                icon: Sparkles,
                title: 'Live Preview',
                description: 'See exactly how candidates will experience your page before publishing it live.',
                color: 'rose',
              },
            ].map((feature) => {
              const colorMap: Record<string, string> = {
                blue: 'bg-blue-50 text-blue-600',
                indigo: 'bg-indigo-50 text-indigo-600',
                violet: 'bg-violet-50 text-violet-600',
                emerald: 'bg-emerald-50 text-emerald-600',
                amber: 'bg-amber-50 text-amber-600',
                rose: 'bg-rose-50 text-rose-600',
              }
              return (
                <div
                  key={feature.title}
                  className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${colorMap[feature.color]}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] px-8 py-16 md:px-16 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to attract top talent?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Create your first branded careers page in under 10 minutes.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-base hover:bg-slate-50 transition-all hover:-translate-y-0.5 shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm font-bold text-slate-400">
            © {new Date().getFullYear()} RecruitFlow. Built for the WhiteCarrot assignment.
          </span>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="/login" className="hover:text-slate-600 transition-colors">Login</Link>
            <Link href="/whitecarrot-io/careers" className="hover:text-slate-600 transition-colors">Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
