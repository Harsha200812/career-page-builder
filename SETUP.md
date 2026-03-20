# Setup Guide for Careers Page Builder

## Prerequisites

- Node.js 18+ installed
- Supabase account/project created
- `.env.local` configured

## Configuration

### 1. Get Supabase Credentials

In your Supabase project dashboard:

**Settings > API**:

- **Project URL**: `https://your-project.supabase.co`
- **anon/public key**: `eyJ...` (starts with `eyJ`)
- **service_role key**: `eyJ...` (keep this secret!)

Also create a Storage bucket:

**Storage**:
- Create new bucket named `careers-assets`
- Set it to **Public** for easy access

### 2. Update `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

⚠️ **Never commit `.env.local` to git.**

### 3. Run Database Migration

Execute the SQL in `supabase/migrations/001_initial_schema.sql`:

**Option A** - Supabase SQL Editor:
1. Go to Supabase Dashboard > Database > SQL Editor
2. Click "New query"
3. Paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run"

**Option B** - Supabase CLI (if installed):
```bash
npx supabase db push
```

### 4. Seed Demo Data

```bash
npm run db:seed
```

This creates:
- Company: `Azure Meridian` (slug: `azure-meridian`)
- Theme: Primary `#003083`, Secondary `#00677d`
- Sections: About, Life at Company, Values
- 10 sample jobs across various departments

### 5. Start Development Server

```bash
npm run dev
```

Open: http://localhost:3000/azure-meridian/careers

---

## Troubleshooting

### Seed fails with RLS error

Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`. The service role key bypasses RLS.

### Seed fails: "Cannot find module 'dotenv'"

Install dotenv: `npm install dotenv`

### Build errors

Clear cache and reinstall:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Components not showing

Check browser console for errors. Ensure:
- Database migration ran successfully
- All tables exist
- RLS policies are in place

---

## Next Steps After Setup

1. Create a recruiter account:
   ```bash
   # Go to Supabase Auth > Users > Add user
   # Create a user and note the email/password
   # Then manually add them to company_users table:
   INSERT INTO company_users (company_id, user_id, role)
   VALUES ((SELECT id FROM companies WHERE slug='azure-meridian'), 'user-uuid', 'recruiter');
   ```

2. Test recruiter editor:
   - Login at `/login`
   - Visit `/azure-meridian/edit`
   - Customize theme, sections

3. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

---

## Project Architecture

- **Frontend**: Next.js 14 App Router + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Next.js Server Actions + Server Components
- **Database**: Supabase PostgreSQL with RLS
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (`careers-assets`)

## Key Files

- `app/[company-slug]/careers/page.tsx` - Public careers page (SSR)
- `components/careers/` - UI components (Hero, Jobs, Sections, Footer)
- `lib/actions.ts` - Server Actions for mutations
- `lib/supabase/` - Server and client Supabase helpers
- `supabase/migrations/001_initial_schema.sql` - Database schema

---

Built with ❤️ following the Azure Meridian design system.
