# Careers Page Builder

A multi-tenant careers page builder built with Next.js 14, Supabase, and shadcn/ui.

## Features

- **Recruiters**: Login, customize brand theme (colors, logo, banner), manage content sections, preview page
- **Candidates**: Browse companies' careers pages, filter jobs by location and type, search by title
- Mobile-first, accessible, SEO-ready design

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account

### Setup

1. Clone and install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (for seeding)
```

3. Set up Supabase database:

```bash
# Create tables using Supabase SQL editor or CLI
# Run the migration: supabase/migrations/001_initial_schema.sql
npx supabase db push
```

4. Seed sample data (optional):

```bash
npm run db:seed
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── [company-slug]/
│   │   ├── careers/    # Public candidate-facing page
│   │   ├── edit/       # Recruiter editor
│   │   └── preview/    # Preview mode
│   ├── layout.tsx
│   ├── page.tsx        # Landing page
│   └── globals.css
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── careers/        # Candidate page components
│   └── editor/         # Editor components
├── lib/
│   ├── supabase/       # Supabase clients
│   ├── types/          # TypeScript definitions
│   └── utils.ts
├── data/
│   └── seed.ts         # Database seeding script
└── supabase/
    └── migrations/     # SQL migrations
```

## Deployment

Deploy to Vercel:

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

## Next Steps

- [ ] Complete editor UI (theme customizer, section manager)
- [ ] Implement job management CRUD
- [ ] Add authentication middleware
- [ ] Enhance SEO with structured data
- [ ] Write tests
- [ ] Add image upload to Supabase Storage

## License

MIT
