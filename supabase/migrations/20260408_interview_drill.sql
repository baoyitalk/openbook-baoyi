-- Interview Drill schema
-- Run in Supabase SQL editor or via supabase migration tooling.

create extension if not exists pgcrypto;

create table if not exists public.interview_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  heat text not null default 'A',
  sort_order int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint interview_categories_heat_check check (heat in ('S', 'A', 'B'))
);

create table if not exists public.interview_questions (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.interview_categories(id) on delete cascade,
  slug text not null unique,
  title text not null,
  q1 text not null,
  a0 text not null,
  a0_deep text not null default '',
  aliases text[] not null default '{}',
  sort_order int not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.interview_chain_nodes (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.interview_questions(id) on delete cascade,
  chain_type text not null,
  parent_id uuid references public.interview_chain_nodes(id) on delete cascade,
  prompt text not null,
  answer text not null,
  deep_answer text not null default '',
  answer_ref text,
  sort_order int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint interview_chain_nodes_chain_type_check check (chain_type in ('A', 'B'))
);

create index if not exists idx_interview_questions_category_sort
  on public.interview_questions(category_id, sort_order);

create index if not exists idx_interview_chain_nodes_question_chain_sort
  on public.interview_chain_nodes(question_id, chain_type, sort_order);

create index if not exists idx_interview_chain_nodes_parent
  on public.interview_chain_nodes(parent_id);

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_interview_categories_updated_at on public.interview_categories;
create trigger trg_interview_categories_updated_at
before update on public.interview_categories
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_interview_questions_updated_at on public.interview_questions;
create trigger trg_interview_questions_updated_at
before update on public.interview_questions
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_interview_chain_nodes_updated_at on public.interview_chain_nodes;
create trigger trg_interview_chain_nodes_updated_at
before update on public.interview_chain_nodes
for each row execute function public.update_updated_at_column();

alter table public.interview_categories enable row level security;
alter table public.interview_questions enable row level security;
alter table public.interview_chain_nodes enable row level security;

-- Anonymous read policy (for Docusaurus front-end read)
drop policy if exists "anon_read_interview_categories" on public.interview_categories;
create policy "anon_read_interview_categories"
  on public.interview_categories for select
  to anon, authenticated
  using (true);

drop policy if exists "anon_read_interview_questions" on public.interview_questions;
create policy "anon_read_interview_questions"
  on public.interview_questions for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "anon_read_interview_chain_nodes" on public.interview_chain_nodes;
create policy "anon_read_interview_chain_nodes"
  on public.interview_chain_nodes for select
  to anon, authenticated
  using (true);
