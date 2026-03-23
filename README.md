# Careers Page Builder


## Introduction
This is a multi-tenant Careers Page Builder. It allows recruiters to dynamically customize their company's career page, and candidates to browse and filter open jobs continuously.

## Features
- An editor that works right on the page—change colors, text, and sections without touching code
- Live preview so you know exactly what candidates will see
- Unique URLs for each company, fully separated and secure
- A mobile-friendly job board with search and filters that actually work


## Step-by-Step User Guide

1. Create an account at `/signup` and add your company
2. Go to `/dashboard` — this is where you edit
3. Pick your colors and upload a logo in the theme picker
4. Click into any section to edit it directly: hero banner, about, footer, everything
5. Check your public page at `/[your-company-slug]/careers` in an incognito window

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



## Improvement Plan

- Brand color extraction from existing websites
- Multiple layout templates
- AI-assisted page building through prompts
- Theme generation from hero images
- Real application forms with resume uploads
- Rich text editor (currently just plain textareas)
- Custom domain support
- Basic analytics for page views and job clicks
