-- Interview Drill v2 schema
-- Focus: reusable answers + recursive chain + closure semantics.

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

create table if not exists public.interview_answers (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  oral_text text not null,
  deep_text text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.interview_questions (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.interview_categories(id) on delete cascade,
  slug text not null unique,
  title text not null,
  q1 text not null,
  a0_answer_id uuid not null references public.interview_answers(id),
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
  answer_id uuid not null references public.interview_answers(id),
  depth int not null,
  close_reason text not null default 'NONE',
  sort_order int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint interview_chain_type_check check (chain_type in ('A', 'B')),
  constraint interview_chain_depth_check check (depth between 1 and 4),
  constraint interview_chain_close_reason_check check (close_reason in ('NONE', 'EARLY_CLOSE', 'FORCED_CLOSE_AT_DEPTH_4'))
);

-- Force close reason semantics.
create or replace function public.interview_chain_close_reason_guard()
returns trigger
language plpgsql
as $$
begin
  if new.depth = 4 and new.close_reason = 'NONE' then
    raise exception 'depth=4 nodes must set close_reason';
  end if;

  if new.close_reason = 'FORCED_CLOSE_AT_DEPTH_4' and new.depth <> 4 then
    raise exception 'FORCED_CLOSE_AT_DEPTH_4 only allowed at depth=4';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_interview_chain_close_reason_guard on public.interview_chain_nodes;
create trigger trg_interview_chain_close_reason_guard
before insert or update on public.interview_chain_nodes
for each row execute function public.interview_chain_close_reason_guard();

-- Max 3 children per node.
create or replace function public.interview_chain_max_children_guard()
returns trigger
language plpgsql
as $$
declare
  cnt int;
begin
  if new.parent_id is null then
    return new;
  end if;

  select count(*) into cnt
  from public.interview_chain_nodes
  where parent_id = new.parent_id
    and id <> coalesce(new.id, gen_random_uuid());

  if cnt >= 3 then
    raise exception 'each node can have at most 3 child follow-ups';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_interview_chain_max_children_guard on public.interview_chain_nodes;
create trigger trg_interview_chain_max_children_guard
before insert or update on public.interview_chain_nodes
for each row execute function public.interview_chain_max_children_guard();

-- Helpful indexes.
create index if not exists idx_interview_questions_category_sort
  on public.interview_questions(category_id, sort_order);

create index if not exists idx_interview_chain_nodes_question_chain_sort
  on public.interview_chain_nodes(question_id, chain_type, sort_order);

create index if not exists idx_interview_chain_nodes_parent
  on public.interview_chain_nodes(parent_id);

create index if not exists idx_interview_chain_nodes_answer
  on public.interview_chain_nodes(answer_id);

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

drop trigger if exists trg_interview_answers_updated_at on public.interview_answers;
create trigger trg_interview_answers_updated_at
before update on public.interview_answers
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_interview_questions_updated_at on public.interview_questions;
create trigger trg_interview_questions_updated_at
before update on public.interview_questions
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_interview_chain_nodes_updated_at on public.interview_chain_nodes;
create trigger trg_interview_chain_nodes_updated_at
before update on public.interview_chain_nodes
for each row execute function public.update_updated_at_column();

-- Usage view: repeated answers => high-frequency knowledge.
create or replace view public.interview_answer_usage_v as
select
  a.id as answer_id,
  a.slug,
  a.oral_text,
  coalesce(q.cnt, 0) + coalesce(n.cnt, 0) as usage_count,
  coalesce(q.cnt, 0) as usage_in_questions,
  coalesce(n.cnt, 0) as usage_in_chain_nodes
from public.interview_answers a
left join (
  select a0_answer_id as answer_id, count(*) as cnt
  from public.interview_questions
  group by a0_answer_id
) q on q.answer_id = a.id
left join (
  select answer_id, count(*) as cnt
  from public.interview_chain_nodes
  group by answer_id
) n on n.answer_id = a.id;

alter table public.interview_categories enable row level security;
alter table public.interview_answers enable row level security;
alter table public.interview_questions enable row level security;
alter table public.interview_chain_nodes enable row level security;

drop policy if exists "anon_read_interview_categories" on public.interview_categories;
create policy "anon_read_interview_categories"
  on public.interview_categories for select
  to anon, authenticated
  using (true);

drop policy if exists "anon_read_interview_answers" on public.interview_answers;
create policy "anon_read_interview_answers"
  on public.interview_answers for select
  to anon, authenticated
  using (is_active = true);

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
