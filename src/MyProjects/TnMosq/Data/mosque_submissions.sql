-- Table for the "Add your neighbourhood mosque" form in TunMosq.svelte.
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.
--
-- Visitors can only ADD rows (they cannot read anyone's submission).
-- The page shows a live count through the mosque_submission_count() function below,
-- which returns a number and nothing else.

create table if not exists public.mosque_submissions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null check (char_length(name) between 2 and 120),
  name_ar       text check (name_ar is null or char_length(name_ar) <= 120),
  place         text check (place is null or char_length(place) <= 120),   -- town / neighbourhood
  governorate   text check (governorate is null or char_length(governorate) <= 40),
  lat           double precision check (lat is null or lat between 30 and 38),
  lon           double precision check (lon is null or lon between 7 and 12),
  note          text check (note is null or char_length(note) <= 600),
  status        text not null default 'pending'   -- you review: pending / added / rejected
);

alter table public.mosque_submissions enable row level security;

-- anyone (anon key) may insert, nobody may select/update/delete through the API
drop policy if exists "anyone can submit" on public.mosque_submissions;
create policy "anyone can submit" on public.mosque_submissions
  for insert to anon, authenticated
  with check (status = 'pending');

-- live counter: only the number of submissions is exposed
create or replace function public.mosque_submission_count()
returns bigint
language sql
security definer
set search_path = public
as $$ select count(*) from public.mosque_submissions $$;

grant execute on function public.mosque_submission_count() to anon, authenticated;
