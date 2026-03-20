-- Enable Row Level Security

-- Companies table
create table if not exists companies (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_published boolean default false not null
);

-- Company themes table
create table if not exists company_themes (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references companies(id) on delete cascade not null,
  primary_color text default '#2563eb' not null,
  secondary_color text default '#64748b' not null,
  font_family text default 'Inter' not null,
  banner_url text,
  logo_url text,
  culture_video_url text,
  unique(company_id)
);

-- Company sections table
create table if not exists company_sections (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references companies(id) on delete cascade not null,
  type text not null check (type in ('about', 'life', 'values', 'benefits', 'custom')),
  title text not null,
  content jsonb default '{}' not null,
  sort_order integer not null,
  is_visible boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Jobs table
create table if not exists jobs (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references companies(id) on delete cascade not null,
  title text not null,
  location text not null,
  department text not null,
  work_policy text not null check (work_policy in ('Remote', 'Hybrid', 'On-site')),
  employment_type text not null,
  experience_level text not null,
  job_type text not null,
  salary_range text,
  slug text not null,
  posted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_active boolean default true not null
);

-- Indexes for better query performance
create index if not exists idx_companies_slug on companies(slug);
create index if not exists idx_company_themes_company_id on company_themes(company_id);
create index if not exists idx_company_sections_company_id on company_sections(company_id);
create index if not exists idx_jobs_company_id on jobs(company_id);
create index if not exists idx_jobs_location on jobs(location);
create index if not exists idx_jobs_department on jobs(department);
create index if not exists idx_jobs_is_active on jobs(is_active);
create index if not exists idx_jobs_slug on jobs(slug);

-- Row Level Security Policies

-- Companies: Users can only access their own company
create policy "Users can view own company" on companies
  for select using (
    auth.uid() = (
      select user_id from company_users where company_id = companies.id
    )
  );

create policy "Users can insert own company" on companies
  for insert with check (
    auth.uid() = (
      select user_id from company_users where company_id = companies.id
    )
  );

-- Company themes: Only accessible by company members
create policy "Company members can view own theme" on company_themes
  for select using (
    auth.uid() = (
      select user_id from company_users where company_id = company_themes.company_id
    )
  );

create policy "Company members can upsert own theme" on company_themes
  for all using (
    auth.uid() = (
      select user_id from company_users where company_id = company_themes.company_id
    )
  );

-- Company sections: Only accessible by company members
create policy "Company members can view own sections" on company_sections
  for select using (
    auth.uid() = (
      select user_id from company_users where company_id = company_sections.company_id
    )
  );

create policy "Company members can manage own sections" on company_sections
  for all using (
    auth.uid() = (
      select user_id from company_users where company_id = company_sections.company_id
    )
  );

-- Jobs: Company members can manage, public can view published
create policy "Public can view active jobs" on jobs
  for select using (is_active = true);

create policy "Company members can manage jobs" on jobs
  for all using (
    auth.uid() = (
      select user_id from company_users where company_id = jobs.company_id
    )
  );

-- Company_users junction table for multi-tenancy (optional, for multiple recruiters per company)
create table if not exists company_users (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references companies(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'recruiter' not null check (role in ('recruiter', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(company_id, user_id)
);

create index if not exists idx_company_users_company_id on company_users(company_id);
create index if not exists idx_company_users_user_id on company_users(user_id);

create policy "Users can view own company_users" on company_users
  for select using (auth.uid() = user_id);

create policy "Users can insert own company_users" on company_users
  for insert with check (auth.uid() = user_id);
