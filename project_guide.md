# 🚀 Careers Page Builder — Complete Project Guide

## 1. Project Understanding

### What You're Building
A **multi-tenant Careers Page Builder** that serves two user types:

| User | What They Do | Key Pages |
|------|-------------|-----------|
| **Recruiter** | Logs in, customizes company careers page, publishes it | `/login`, `/<company-slug>/edit`, `/<company-slug>/preview` |
| **Candidate** | Browses company page & open jobs | `/<company-slug>/careers` |

### Core Features

**Recruiter Side:**
- Set brand theme (colors, banner, logo, culture video)
- Add/remove/reorder content sections (About Us, Life at Company, etc.)
- Preview page before publishing
- Save settings per company
- Share public careers link

**Candidate Side:**
- View branded company careers page
- Browse jobs with filters (Location, Job Type) + search by Title
- Mobile-friendly, accessible, SEO-ready

### Sample Data
~100 job listings with fields: `title`, `work_policy`, `location`, `department`, `employment_type`, `experience_level`, `job_type`, `salary_range`, `job_slug`, `posted_days_ago`

---

## 2. Recommended Tech Stack

### Frontend: **Next.js 14+ (App Router)** with **TypeScript** + **Tailwind CSS**

**Why Next.js?**
- Server-side rendering for SEO (critical for candidate pages)
- App Router supports dynamic routes (`/[company-slug]/careers`)
- API routes built-in — no separate backend needed
- Easy Vercel deployment
- React Server Components for performance

**Why Tailwind CSS?**
- Rapid UI development
- Easy theming with CSS variables (for brand colors)
- Mobile-first design built-in
- Pairs perfectly with component libraries

### Database: **Supabase** (PostgreSQL + Auth + Storage)

**Why Supabase?**
- **Free tier** is generous (500MB DB, 1GB storage, 50K monthly users)
- **Built-in Auth** — no need to build login from scratch
- **Storage** — for logos, banners, culture videos
- **Row Level Security** — multi-tenant data isolation
- **Real-time** — instant preview updates
- PostgreSQL = proper relational DB with JSON support

### UI Component Library: **shadcn/ui**

**Why shadcn/ui?**
- Copy-paste components (you own the code)
- Built on Radix UI (accessible by default)
- Tailwind-based styling
- Works perfectly with Next.js

---

## 3. Tool Usage Strategy — What to Use Where

### 🎨 Phase 1: UI Design → **Stitch (Google)**

> **What is Stitch?** Google's AI UI design tool that generates full UI designs from text prompts. Think of it as "Figma but AI-generated."

**Use Stitch for:**
1. **Designing the candidate-facing careers page** — Tell it to create a branded careers page with hero banner, about section, job listings with filters
2. **Designing the recruiter dashboard/editor** — Page editor with drag-drop sections, theme controls, preview
3. **Designing the login page**
4. **Mobile responsive versions** of all pages

**How to use Stitch:**
1. Go to [stitch.withgoogle.com](https://stitch.withgoogle.com)
2. Write detailed prompts like:
   ```
   Design a modern careers page for a tech company with:
   - Hero banner with company logo, tagline, and background image
   - "About Us" section with company description
   - "Life at Company" section with team photos
   - Job listings section with search bar, filter pills for Location/Job Type
   - Each job card shows: title, location, department, work policy badge
   - Footer with company links
   - Use dark teal (#004038) as primary color
   - Mobile-first responsive layout
   ```
3. **Export the designs as reference** — screenshot or download
4. Use these as your visual target when coding

---

### 🧩 Phase 2: Component Generation → **21st.dev**

> **What is 21st.dev?** An AI tool that generates production-ready React/Next.js components with Tailwind CSS and shadcn/ui styling.

**Use 21st.dev for generating these components:**

| Component | Prompt Idea |
|-----------|-------------|
| `HeroBanner` | "Hero section with full-width banner image, overlay gradient, company logo, and tagline text" |
| `JobCard` | "Job listing card with title, location badge, department tag, work policy pill (Remote/Hybrid/On-site), and salary range" |
| `JobFilters` | "Filter bar with search input, location dropdown, job type pills, and clear filters button" |
| `SectionEditor` | "Drag-and-drop section editor with add/remove/reorder controls for content blocks" |
| `ThemeCustomizer` | "Color picker panel with primary/secondary color inputs, font selector, and live preview" |
| `ContentSection` | "Collapsible content section with rich text, image uploads, and heading" |
| `NavigationBar` | "Clean navbar with company logo, navigation links, and 'Apply' CTA button" |

**How to use 21st.dev:**
1. Go to [21st.dev](https://21st.dev)
2. Describe the component you want
3. Copy the generated code into your project
4. Customize styling to match your Stitch designs
5. Wire up with real data and state management

---

### 💻 Phase 3: Full Stack Development → **Claude Code + Antigravity**

> **Claude Code** is your AI coding assistant in the terminal. **Antigravity** is the enhanced agent mode with planning, execution, and verification.

**Use Claude Code / Antigravity for:**

#### A. Project Scaffolding
```
Prompt: "Set up a Next.js 14 project with App Router, TypeScript, Tailwind CSS, 
shadcn/ui, and Supabase client. Create folder structure for:
- app/(auth)/login
- app/[company-slug]/careers  
- app/[company-slug]/edit
- app/[company-slug]/preview
- components/ui, components/careers, components/editor
- lib/supabase, lib/types, lib/utils
- data/seed (for sample job data)"
```

#### B. Database Schema & Supabase Setup
```
Prompt: "Create Supabase migration SQL for a multi-tenant careers page builder with tables:
- companies (id, slug, name, settings_json, created_at, updated_at)
- company_themes (company_id, primary_color, secondary_color, banner_url, logo_url, video_url)
- company_sections (company_id, type, title, content, order, is_visible)
- jobs (id, company_id, title, location, department, work_policy, employment_type, 
       experience_level, job_type, salary_range, slug, posted_at, is_active)
- users (linked to Supabase Auth, with company_id for recruiters)
Set up RLS policies so each company can only access its own data."
```

#### C. API Routes / Server Actions
```
Prompt: "Create Next.js API routes for:
- GET /api/companies/[slug] — fetch company data + theme + sections
- PUT /api/companies/[slug] — update company settings (auth required)
- GET /api/companies/[slug]/jobs — fetch jobs with filters (location, jobType, search)
- POST /api/companies/[slug]/jobs/seed — seed sample job data
Use Supabase server client with proper auth checks."
```

#### D. Page-by-Page Implementation
Use Claude Code to build each page, integrating the components from 21st.dev:

1. **Login Page** — Supabase Auth with email/password
2. **Editor Page** — Theme customizer, section manager, drag-drop
3. **Preview Page** — Render the careers page in edit mode
4. **Public Careers Page** — SSR, SEO meta tags, structured data, job browsing

#### E. Data Seeding
```
Prompt: "Create a seed script that imports the sample CSV job data into Supabase, 
creating a demo company 'TechCorp' with slug 'techcorp', a default theme, 
default sections (About, Life at Company, Open Roles), and all 100 sample jobs."
```

#### F. SEO & Accessibility
```
Prompt: "Add to the public careers page:
- Dynamic meta tags (title, description, OG tags)  
- JSON-LD structured data for JobPosting schema
- Semantic HTML (h1, nav, main, section, footer)
- ARIA labels on all interactive elements
- Keyboard navigation support
- Color contrast compliance"
```

#### G. Testing
```
Prompt: "Write tests for:
- API route for fetching jobs with filters
- Component rendering for JobCard, JobFilters
- SEO meta tags generation
- Mobile responsive behavior"
```

---

## 4. Database Schema Design

```
┌─────────────────────┐     ┌──────────────────────┐
│     companies        │     │    company_themes     │
├─────────────────────┤     ├──────────────────────┤
│ id (uuid, PK)       │────→│ company_id (FK)      │
│ slug (unique)        │     │ primary_color        │
│ name                 │     │ secondary_color      │
│ description          │     │ font_family          │
│ created_at           │     │ banner_url           │
│ updated_at           │     │ logo_url             │
│ is_published         │     │ culture_video_url    │
└─────────────────────┘     └──────────────────────┘
         │
         │ 1:N                    1:N
         ▼                         ▼
┌─────────────────────┐     ┌──────────────────────┐
│  company_sections    │     │       jobs            │
├─────────────────────┤     ├──────────────────────┤
│ id (uuid, PK)       │     │ id (uuid, PK)        │
│ company_id (FK)      │     │ company_id (FK)      │
│ type (enum)          │     │ title                │
│ title                │     │ location             │
│ content (jsonb)      │     │ department           │
│ sort_order           │     │ work_policy          │
│ is_visible           │     │ employment_type      │
└─────────────────────┘     │ experience_level     │
                            │ job_type             │
                            │ salary_range         │
                            │ slug                 │
                            │ posted_at            │
                            │ is_active            │
                            └──────────────────────┘
```

---

## 5. Step-by-Step Execution Plan

### Day 1: Design + Setup (2 hours)

| Step | Tool | Action |
|------|------|--------|
| 1.1 | **Stitch** | Design the public careers page (desktop + mobile) |
| 1.2 | **Stitch** | Design the recruiter editor dashboard |
| 1.3 | **Stitch** | Design login page |
| 1.4 | **Claude Code** | Scaffold Next.js project with all dependencies |
| 1.5 | **Supabase Console** | Create project, set up database tables, enable Auth |
| 1.6 | **Claude Code** | Create Supabase client config, types, env variables |

### Day 2: Components + Data (2 hours)

| Step | Tool | Action |
|------|------|--------|
| 2.1 | **21st.dev** | Generate HeroBanner, JobCard, JobFilters components |
| 2.2 | **21st.dev** | Generate SectionEditor, ThemeCustomizer components |
| 2.3 | **Claude Code** | Integrate components, add TypeScript types |
| 2.4 | **Claude Code** | Create data seed script, import sample jobs |
| 2.5 | **Claude Code** | Build API routes for company + job data |

### Day 3: Core Pages (2 hours)

| Step | Tool | Action |
|------|------|--------|
| 3.1 | **Claude Code** | Build Login page with Supabase Auth |
| 3.2 | **Claude Code** | Build Public Careers page (SSR, SEO, filters, search) |
| 3.3 | **Claude Code** | Build Editor page (theme customizer, section manager) |
| 3.4 | **Claude Code** | Build Preview page |
| 3.5 | **Antigravity** | Polish UI, fix responsive issues, accessibility audit |

### Day 4: Polish + Deploy (2 hours)

| Step | Tool | Action |
|------|------|--------|
| 4.1 | **Claude Code** | Add SEO meta tags, JSON-LD structured data |
| 4.2 | **Claude Code** | Write tests |
| 4.3 | **Vercel** | Deploy to production |
| 4.4 | **You (manual)** | Write Tech Spec.md, README.md, AGENT_LOG.md |
| 4.5 | **Screen recorder** | Record 5-min demo video |

---

## 6. Detailed Tool Usage Guide

### 🔧 Stitch (stitch.withgoogle.com)

**Purpose:** Generate UI designs as visual reference before coding.

**Step-by-step:**
1. Open Stitch → Create new project
2. Start with the **Public Careers Page** — this is what candidates see
3. Write a prompt like:
   > "Create a modern, clean careers page for a tech company. Include: a full-width hero banner with logo and tagline, an 'About Us' section, a 'Life at Company' photo grid, and a job listings section with search bar and filter tags for Location and Job Type. Each job is a card showing title, location, department, and work policy badge. Use a professional dark teal color scheme. Mobile responsive."
4. Iterate on the design — adjust colors, layout, spacing
5. Screenshot the final designs for reference
6. Repeat for the **Editor Dashboard** and **Login Page**

### 🧩 21st.dev

**Purpose:** Generate individual React components with Tailwind CSS.

**Step-by-step:**
1. Go to [21st.dev](https://21st.dev)
2. For each component, describe what you need:
   - Include the visual style, props, and behavior
   - Specify "React + TypeScript + Tailwind CSS"
3. Copy the generated code
4. Paste into your project under `components/`
5. Modify to accept real data props and match your Stitch designs
6. Key components to generate:
   - `HeroBanner` — accepts `logoUrl`, `bannerUrl`, `tagline`, `primaryColor`
   - `JobCard` — accepts job data, shows title/location/department/policy
   - `JobFilters` — search input + dropdown filters
   - `SectionBlock` — reusable content section with title + body

### 💻 Claude Code (Terminal)

**Purpose:** Full stack coding — APIs, database, business logic, integration, testing.

**How to use effectively:**
1. **Start with scaffolding** — get the project structure right
2. **Work page by page** — complete one page fully before moving to next
3. **Be specific in prompts** — include file paths, function signatures, data types
4. **Ask for explanations** — so you can write Tech Spec.md yourself
5. **Iterate** — review generated code, ask for improvements

**Example workflow:**
```bash
# In your terminal with Claude Code:
> "Create the Supabase database schema with companies, themes, sections, and jobs tables.
   Include RLS policies. Output as a SQL migration file."

> "Build the public careers page at app/[company-slug]/careers/page.tsx. 
   It should SSR-fetch company data + jobs, render the branded page with 
   HeroBanner, sections, and joblistings. Include meta tags for SEO."

> "Add job filtering to the careers page. Client-side filter by location 
   (dropdown), job type (pills), and search by title. Use URL search params 
   to preserve filter state."
```

### 🚀 Antigravity (Enhanced Claude Code)

**Purpose:** Complex multi-step tasks — architecture planning, full-page builds, debugging, testing.

**Best for:**
- Initial project planning and architecture decisions
- Building complete pages with multiple components
- Debugging complex issues across multiple files
- Running verification and testing flows
- Final polish — accessibility, performance, SEO audit

---

## 7. Key Architecture Decisions

### Multi-Tenancy via Company Slug
- Every company gets a unique `slug` (e.g., `techcorp`)
- All data is scoped by `company_id`
- RLS policies enforce data isolation
- Routes: `/<slug>/careers` (public), `/<slug>/edit` (auth required)

### Theme System
- Store theme as JSON in `company_themes` table
- Apply via CSS custom properties at runtime:
  ```css
  :root {
    --primary-color: var(--company-primary);
    --secondary-color: var(--company-secondary);
  }
  ```
- This lets each company's page look unique without separate CSS files

### Section System
- Sections stored as ordered rows in `company_sections`
- Each section has a `type` (about, life, values, benefits, custom)
- Content stored as JSONB for flexibility
- Sections can be reordered, hidden, or deleted by recruiter

### Job Filtering
- **Server-side initial load** (SSR for SEO)
- **Client-side filtering** for instant UX (no page reloads)
- Use URL search params so filtered URLs are shareable/bookmarkable

---

## 8. Submission Checklist

| Item | Notes |
|------|-------|
| ✅ GitHub repo | Clean code, organized folders, sample data included |
| ✅ Production link | Deploy on Vercel (free tier) |
| ✅ Tech Spec.md | Write MANUALLY — architecture, schema, assumptions, test plan |
| ✅ README.md | Write MANUALLY — setup guide, features, improvement plan |
| ✅ AGENT_LOG.md | Write MANUALLY — document how you used AI tools |
| ✅ Demo video (≤5 min) | Use OBS / Loom to record walkthrough |

> [!CAUTION]
> **Tech Spec.md, README.md, and AGENT_LOG.md must be written by YOU, not AI.**
> The assignment explicitly says "DON'T Write this with AI." These are where you show your thinking.

---

## 9. What to Include in AGENT_LOG.md

Since the assignment evaluates **how you used AI tools**, document:

1. **Stitch** — What prompts you used, how you iterated on designs
2. **21st.dev** — Which components you generated, what you modified
3. **Claude Code / Antigravity** — Key prompts, how you refined AI output, where you overrode its suggestions
4. **What worked well** — Time saved, quality of output
5. **What you fixed manually** — Where AI got it wrong, how you corrected it

---

## 10. Scalability Considerations (For Tech Spec)

If hundreds of companies used this:
- **Database**: Add indexes on `company_id`, `slug`, `location`, `department`
- **Caching**: Use ISR (Incremental Static Regeneration) in Next.js for public pages
- **CDN**: Serve static assets (logos, banners) from Supabase Storage + CDN
- **Rate limiting**: On API routes to prevent abuse
- **Image optimization**: Use Next.js `<Image>` for automatic optimization
- **Search**: Move to full-text search (pg_trgm) or Algolia for job search at scale
