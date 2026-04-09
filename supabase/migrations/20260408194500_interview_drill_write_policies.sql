-- Enable write access for interview drill editor mode.
-- NOTE: This is intended for internal tooling only.

alter table public.interview_categories enable row level security;
alter table public.interview_answers enable row level security;
alter table public.interview_questions enable row level security;
alter table public.interview_chain_nodes enable row level security;

drop policy if exists "anon_write_interview_categories" on public.interview_categories;
create policy "anon_write_interview_categories"
  on public.interview_categories
  for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "anon_write_interview_answers" on public.interview_answers;
create policy "anon_write_interview_answers"
  on public.interview_answers
  for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "anon_write_interview_questions" on public.interview_questions;
create policy "anon_write_interview_questions"
  on public.interview_questions
  for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "anon_write_interview_chain_nodes" on public.interview_chain_nodes;
create policy "anon_write_interview_chain_nodes"
  on public.interview_chain_nodes
  for all
  to anon, authenticated
  using (true)
  with check (true);
