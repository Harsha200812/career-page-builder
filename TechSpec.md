# Tech Specification

## 1. Overview

Brief description of the system architecture and goals.

## 2. System Architecture

### High-Level Diagram

[Describe or embed diagram]

### Components

- Frontend: Next.js 14 App Router
- Backend: Next.js API Routes + Server Components
- Database: Supabase PostgreSQL
- Auth: Supabase Auth
- Storage: Supabase Storage (for media assets)

## 3. Database Schema

Refer to `supabase/migrations/001_initial_schema.sql` for complete schema.

### Tables

- `companies` - Company metadata
- `company_themes` - Brand theme settings
- `company_sections` - Content sections (ordered)
- `jobs` - Job postings
- `company_users` - Recruiter access control

### Multi-Tenancy Strategy

- Company slug in URL: `/[company-slug]/careers`
- Row Level Security (RLS) enforces data isolation
- Each company can only access their own data

## 4. API Design

### Public Endpoints

- `GET /api/companies/[slug]` - Fetch company details (for public pages)
- `GET /api/companies/[slug]/jobs` - List active jobs with filters

### Protected Endpoints (Recruiter)

- `GET /api/companies/[slug]/editor` - Fetch full company data for editor
- `PUT /api/companies/[slug]/theme` - Update theme
- `POST /api/companies/[slug]/sections` - Create/update/reorder sections
- `POST /api/companies/[slug]/jobs` - CRUD for jobs

## 5. Key Assumptions

- Each company has one careers page
- Recruiters authenticate via Supabase Auth
- SEO: Public pages use SSR with duck-typing for meta tags
- Jobs are filtered client-side after initial SSR fetch for performance

## 6. Security Considerations

- Row Level Security (RLS) on all tables
- API route auth checks using Supabase SSR client
- Service role key only used in server-side operations (seed script)
- File uploads stored in private Supabase buckets, served via signed URLs if needed

## 7. Performance & Scalability

- ISR for public pages (optional)
- Image optimization via Next.js Image component
- Database indexes on slug, location, department, is_active
- CDN via Supabase Storage

## 8. Test Plan

### Unit Tests

- [ ] Component rendering (HeroBanner, JobCard, JobFilters)
- [ ] Utility functions (cn, filtering logic)
- [ ] TypeScript types

### Integration Tests

- [ ] API route: GET /api/companies/[slug]/jobs with filters
- [ ] SSR page generation with company data

### Accessibility Tests

- [ ] Color contrast compliance
- [ ] Keyboard navigation
- [ ] ARIA labels

## 9. Future Improvements

- Full-text search for jobs (pg_trgm or Algolia)
- Drag-and-drop section reordering
- Job application flow integration
- Analytics tracking
- Multi-language support
- Advanced theme editor (font picker, custom CSS)
- Bulk job import via CSV

## 10. Deployment Architecture

- Platform: Vercel
- Environment: Node.js 18+
- Database: Supabase (free tier initially)
- Storage: Supabase Storage
- CDN: Vercel Edge Network + Supabase CDN

## 11. Monitoring & Observability

- Vercel Analytics for performance
- Supabase logs for database queries
- Error tracking (Sentry or similar)

---

_Write this document manually based on your actual implementation decisions._
