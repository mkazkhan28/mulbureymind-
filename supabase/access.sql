-- Molar Hub access control (test run: approved emails only).
-- Run once in Supabase > SQL Editor. Safe to run again.

-- 1. The list of approved emails. Only admins can read or change it (students can't add themselves).
create table if not exists public.approved_emails (
  email text primary key check (email = lower(email)),
  note text,
  added_at timestamptz not null default now()
);
alter table public.approved_emails enable row level security;
drop policy if exists "Admins manage approved emails" on public.approved_emails;
create policy "Admins manage approved emails" on public.approved_emails
  for all using (public.is_admin()) with check (public.is_admin());

-- 2. One question the website asks: may the signed-in person use the full site?
--    Admins always; others when their email is on the list. (Later: also an active membership.)
create or replace function public.has_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.is_admin(), false)
      or exists (
        select 1 from public.approved_emails a
        where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
      );
$$;
grant execute on function public.has_access() to anon, authenticated;

-- 3. Approve people (add one line per email, all lowercase). Example:
-- insert into public.approved_emails (email, note) values
--   ('student1@gmail.com', 'test run'),
--   ('student2@gmail.com', 'test run')
-- on conflict (email) do nothing;

-- Remove someone:
-- delete from public.approved_emails where email = 'student1@gmail.com';

-- See who is approved:
-- select * from public.approved_emails order by added_at;
