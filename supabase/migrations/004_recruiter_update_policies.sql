-- Allow recruiters to UPDATE their own company record (needed for publish toggle, name changes)
create policy "Recruiters can update their company" on companies
  for update using (
    auth.uid() in (
      select user_id from company_users where company_id = companies.id
    )
  );

-- Allow recruiters to UPDATE their company theme
create policy "Recruiters can update their company theme" on company_themes
  for update using (
    auth.uid() in (
      select user_id from company_users where company_id = company_themes.company_id
    )
  );

-- Allow recruiters to INSERT a company theme (in case it doesn't exist yet)
create policy "Recruiters can insert their company theme" on company_themes
  for insert with check (
    auth.uid() in (
      select user_id from company_users where company_id = company_themes.company_id
    )
  );

-- Allow recruiters to INSERT company sections
create policy "Recruiters can insert company sections" on company_sections
  for insert with check (
    auth.uid() in (
      select user_id from company_users where company_id = company_sections.company_id
    )
  );

-- Allow recruiters to UPDATE company sections
create policy "Recruiters can update company sections" on company_sections
  for update using (
    auth.uid() in (
      select user_id from company_users where company_id = company_sections.company_id
    )
  );

-- Allow recruiters to DELETE company sections
create policy "Recruiters can delete company sections" on company_sections
  for delete using (
    auth.uid() in (
      select user_id from company_users where company_id = company_sections.company_id
    )
  );

-- Allow recruiters to SELECT their OWN company even if not published (for editor)
create policy "Recruiters can view their own company" on companies
  for select using (
    auth.uid() in (
      select user_id from company_users where company_id = companies.id
    )
  );

-- Allow recruiters to view their own themes even if company not published
create policy "Recruiters can view their own company theme" on company_themes
  for select using (
    auth.uid() in (
      select user_id from company_users where company_id = company_themes.company_id
    )
  );

-- Allow recruiters to view all their own sections (including hidden ones) even if not published
create policy "Recruiters can view all their company sections" on company_sections
  for select using (
    auth.uid() in (
      select user_id from company_users where company_id = company_sections.company_id
    )
  );

-- Jobs: allow recruiters to manage jobs for their company
create policy "Recruiters can view all their company jobs" on jobs
  for select using (
    auth.uid() in (
      select user_id from company_users where company_id = jobs.company_id
    )
  );

create policy "Recruiters can insert jobs" on jobs
  for insert with check (
    auth.uid() in (
      select user_id from company_users where company_id = jobs.company_id
    )
  );

create policy "Recruiters can update their company jobs" on jobs
  for update using (
    auth.uid() in (
      select user_id from company_users where company_id = jobs.company_id
    )
  );

create policy "Recruiters can delete their company jobs" on jobs
  for delete using (
    auth.uid() in (
      select user_id from company_users where company_id = jobs.company_id
    )
  );
