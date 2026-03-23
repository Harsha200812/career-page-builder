# Tech Specification

## Architecture

We're using Next.js 14 with the App Router. The frontend talks directly to Next.js API routes, which handle all the database operations through Supabase. Supabase Auth takes care of user management and authentication.

**Components:**
- Frontend: Next.js 14 with server components where possible
- Backend: Next.js API routes (no separate server needed)
- Database: Supabase PostgreSQL
- Auth: Supabase Auth
- File storage: Supabase Storage for company logos and assets

Right now the public pages render with Server-Side Rendering so job listings show up immediately when shared. We might add Incremental Static Regeneration later if we need better performance.

## Database Schema

We keep data isolated per company using the company's slug in the URL and Row Level Security policies. The main tables are:

- **companies** - Company name, slug, and basic info
- **company_themes** - Colors, fonts, logo URLs
- **company_sections** - The content sections (hero, about, footer, etc.) in order
- **jobs** - Job title, description, location, department, status
- **company_users** - Links users to companies with role-based access

The company slug becomes part of the URL (`/acme-inc/careers`), and every query filters by that company. RLS ensures recruiters can only see their own company's data.

See `supabase/migrations/001_initial_schema.sql` for the complete schema with all constraints and relationships.

## Assumptions

- One company = one careers page (no multi-brand support)
- Everyone on the recruiter side uses Supabase Auth to sign in
- Public pages use SSR for SEO and fast first loads
- Jobs filtering happens on the client after the initial page load keeps things snappy
- File uploads go to private Supabase buckets; we'll generate signed URLs if companies need to share assets publicly

## Test Plan

### Things we should test

**Component tests:**
- JobCard renders correctly with different data
- JobFilters don't break when the filter list is empty
- ThemeCustomizer applies colors properly

**API tests:**
- `GET /api/companies/[slug]/jobs` returns only active jobs
- Filtering by location/department works as expected
- Protected routes reject unauthenticated requests

**Integration:**
- Public careers page loads with company data and jobs
- Editor page shows all content blocks for the logged-in company

**Accessibility:**
- Color contrast meets WCAG standards
- Keyboard navigation works through all interactive elements
- Proper ARIA labels on filters and buttons
