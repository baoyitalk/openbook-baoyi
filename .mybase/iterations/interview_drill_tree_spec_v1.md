# Interview Drill Tree Spec v1

## 1. Background
Current interview drill content is not linear Q/A anymore.
The target is a branching follow-up tree driven by candidate answers.

## 2. Core Goal
Build a practical interview drill system where:
- interviewer asks `Q1`
- candidate answers `A0` with multiple key points (usually up to 3)
- each key point can trigger deeper follow-up chains
- follow-ups support two modes:
  - `A-chain`: answer-triggered (default)
  - `B-chain`: interviewer-led

## 3. Key Rules (Must)
- Each chain must have at least `5` follow-ups.
- Each chain can expand by difficulty and importance, but max `16` follow-ups.
- Repeated answers are allowed and encouraged.
- More repeated knowledge points = higher interview value.

## 4. Anti-Infinite Design (Must)
To prevent endless recursion:
- max depth: `4` (Q1 level = depth 0)
- max branch count per answer node: `3`
- max child follow-ups per branch: `3`
- max total follow-ups per question per chain: `16`
- stop expansion when content already covers: definition + approach + risk + outcome

### 4.1 Closure Semantics (Must)
- At depth `4`, force close the chain (`FORCED_CLOSE_AT_DEPTH_4`).
- Forced close output format:
  - mechanism conclusion
  - engineering trade-off
  - business impact
- No depth `5+` follow-up generation is allowed.

### 4.2 Early Close for Non-Technical Questions (Must)
- Non-technical questions do **not** require forced deep technical drilling.
- When answer already has verifiable outcome, allow early close (`EARLY_CLOSE`).
- Typical early-close scope:
  - collaboration/process
  - communication/ownership
  - project planning/priority
  - motivation/background

## 5. UX Requirements
- Independent page route: `/interview-drill`
- Fast keyword search
- Category sidebar jump
- switch between A-chain and B-chain
- recursive follow-up expand/collapse (node by node)
- show active data source status:
  - Supabase
  - local fallback

## 6. Data Model Direction (Supabase)
Tables:
- `interview_categories`
- `interview_questions`
- `interview_chain_nodes` (recursive by `parent_id`)

Node fields (minimum):
- `question_id`
- `chain_type` (`A`/`B`)
- `parent_id` (nullable)
- `prompt`
- `answer`
- `sort_order`

## 7. Content Authoring Rules
- A0 answer should intentionally include 2-3 expandable keywords.
- Each keyword should map to a clear child follow-up branch.
- Keep answers concise and spoken-language style.
- Duplicate high-frequency points across scenarios on purpose.
- Reusable answers should use reference id (`answerRef`) to avoid repeated manual edits.
- Each node should support:
  - oral answer (default visible after expand)
  - deep answer (default collapsed)
  - unique node id for precise manual maintenance

## 8. Iteration Plan
Phase 1 (done baseline):
- independent page
- chain switch
- recursive render
- local data fallback

Phase 2:
- full Supabase data source
- seed/import tool from markdown
- admin edit workflow

Phase 3:
- heat scoring automation by repetition count
- interview simulation mode (randomized follow-up path)

## 9. Acceptance Criteria
- A sample question supports tree follow-up beyond one level.
- A-chain and B-chain can be switched at runtime.
- any chain respects min 5 / max 16 rule.
- page can locate target question within seconds via search.
- app works when Supabase is unavailable (fallback works).
- depth 4 reached => chain must close (no depth 5+).
- non-technical question can close earlier with explicit `EARLY_CLOSE` reason.
