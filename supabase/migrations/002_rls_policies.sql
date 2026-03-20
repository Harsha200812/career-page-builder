-- Fix RLS policies to allow public access to published careers pages

-- Companies: Public can view published companies
create policy "Public can view published companies" on companies
  for select using (is_published = true);

-- Company themes: Public can view themes for published companies
create policy "Public can view themes for published companies" on company_themes
  for select using (
    exists (
      select 1 from companies
      where companies.id = company_themes.company_id
        and companies.is_published = true
    )
  );

-- Company sections: Public can view visible sections for published companies
create policy "Public can view visible sections for published companies" on company_sections
  for select using (
    exists (
      select 1 from companies
      where companies.id = company_sections.company_id
        and companies.is_published = true
    )
    and is_visible = true
  );
