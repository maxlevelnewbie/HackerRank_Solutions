-- ==============================================================================
-- HackerRank Solutions Database Schema for Supabase
-- ==============================================================================

-- 1. Create the solutions table
create table if not exists public.solutions (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null,
  language text not null, -- 'c', 'cpp', 'python', etc.
  category text not null, -- 'Arrays', 'Strings', 'Pointers', 'Loops', 'Functions', 'Math', 'Conditionals'
  difficulty text default 'Easy' check (difficulty in ('Easy', 'Medium', 'Hard')),
  code text not null,
  line_count integer default 0,
  hackerrank_url text,
  description text,
  sample_input text,
  sample_output text,
  points integer default 15,
  success_rate text default '98.5%',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure unique combination of problem slug and language for auto-upsert
  constraint unique_slug_lang unique (slug, language)
);

-- 2. Indexes for fast queries & filters
create index if not exists idx_solutions_language on public.solutions(language);
create index if not exists idx_solutions_category on public.solutions(category);
create index if not exists idx_solutions_difficulty on public.solutions(difficulty);
create index if not exists idx_solutions_slug on public.solutions(slug);

-- 3. Enable Row Level Security (RLS)
alter table public.solutions enable row level security;

-- 4. Policies:
-- Allow anyone (public visitors) to read solutions
drop policy if exists "Allow public read access" on public.solutions;
create policy "Allow public read access"
  on public.solutions for select
  using (true);

-- Allow authenticated users (Admin) to insert new solutions
drop policy if exists "Allow authenticated admin insert" on public.solutions;
create policy "Allow authenticated admin insert"
  on public.solutions for insert
  to authenticated
  with check (true);

-- Allow authenticated users (Admin) to update solutions
drop policy if exists "Allow authenticated admin update" on public.solutions;
create policy "Allow authenticated admin update"
  on public.solutions for update
  to authenticated
  using (true);

-- Allow authenticated users (Admin) to delete solutions
drop policy if exists "Allow authenticated admin delete" on public.solutions;
create policy "Allow authenticated admin delete"
  on public.solutions for delete
  to authenticated
  using (true);

-- 5. Trigger to auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_solutions_updated_at on public.solutions;
create trigger set_solutions_updated_at
  before update on public.solutions
  for each row
  execute function update_updated_at_column();

