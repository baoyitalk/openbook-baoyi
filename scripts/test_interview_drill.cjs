#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = '/Users/johnpeng/career_data/code/openbook-baoyi';
const DATA_FILE = path.join(ROOT, 'src/data/interviewDrillData.js');
const PAGE_FILE = path.join(ROOT, 'src/pages/interview-drill/index.js');
const REPO_FILE = path.join(ROOT, 'src/lib/interviewDrillRepository.js');
const SQL_FILE = path.join(ROOT, 'supabase/migrations/20260408141000_interview_drill_v2.sql');

const results = [];

function ok(name, detail) {
  results.push({name, pass: true, detail});
}

function fail(name, detail) {
  results.push({name, pass: false, detail});
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function loadInterviewData() {
  const src = read(DATA_FILE);
  const wrapped =
    src
      .replace('export const sharedAnswerLibrary =', 'const sharedAnswerLibrary =')
      .replace('export const interviewCategories =', 'const interviewCategories =') +
    '\nmodule.exports = { interviewCategories, sharedAnswerLibrary };';
  const sandbox = {module: {exports: {}}};
  vm.createContext(sandbox);
  new vm.Script(wrapped, {filename: DATA_FILE}).runInContext(sandbox);
  return sandbox.module.exports.interviewCategories;
}

function walkNodes(nodes, depth, cb) {
  for (const node of nodes) {
    cb(node, depth);
    walkNodes(node.followUps || [], depth + 1, cb);
  }
}

function countNodes(nodes) {
  let n = 0;
  walkNodes(nodes, 1, () => {
    n += 1;
  });
  return n;
}

function maxDepth(nodes) {
  let m = 0;
  walkNodes(nodes, 1, (_, d) => {
    if (d > m) m = d;
  });
  return m;
}

function validateDataRules(categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    fail('DATA-001 categories exists', 'No categories found');
    return;
  }
  ok('DATA-001 categories exists', `categories=${categories.length}`);

  let totalQuestions = 0;
  let totalNodes = 0;

  for (const category of categories) {
    if (!category.id || !category.label) {
      fail('DATA-002 category fields', `Invalid category: ${JSON.stringify(category)}`);
      continue;
    }
    if (!Array.isArray(category.questions) || category.questions.length === 0) {
      fail('DATA-003 category questions', `Category ${category.id} has no questions`);
      continue;
    }

    totalQuestions += category.questions.length;

    for (const question of category.questions) {
      const head = `${category.id}/${question.id}`;
      const required = [question.title, question.q1, question.a0];
      if (required.some((v) => !v || typeof v !== 'string')) {
        fail('DATA-004 question base fields', `Missing title/q1/a0: ${head}`);
      }

      for (const chainType of ['chainA', 'chainB']) {
        const chain = question[chainType];
        if (!Array.isArray(chain)) {
          fail('DATA-005 chain exists', `${head} ${chainType} is not array`);
          continue;
        }

        const chainCount = countNodes(chain);
        totalNodes += chainCount;
        if (chainCount < 5) {
          fail('RULE-001 chain min', `${head} ${chainType} count=${chainCount} (<5)`);
        }
        if (chainCount > 16) {
          fail('RULE-002 chain max', `${head} ${chainType} count=${chainCount} (>16)`);
        }

        const depth = maxDepth(chain);
        if (depth > 4) {
          fail('RULE-003 depth max', `${head} ${chainType} depth=${depth} (>4)`);
        }

        walkNodes(chain, 1, (node) => {
          const hasAnswer = Boolean(node.a || node.answerRef);
          if (!node.q || !hasAnswer) {
            fail('DATA-006 node fields', `${head} ${chainType} has node with empty q or missing a/answerRef`);
          }
          const childCount = (node.followUps || []).length;
          if (childCount > 3) {
            fail('RULE-004 branch max children', `${head} ${chainType} node children=${childCount} (>3)`);
          }
        });
      }
    }
  }

  ok('DATA-007 summary', `questions=${totalQuestions}, nodes=${totalNodes}`);
}

function validatePageAndSupabase() {
  const page = read(PAGE_FILE);
  const repo = read(REPO_FILE);
  const sql = read(SQL_FILE);

  const pageMust = [
    'A链（回答触发）',
    'B链（面试官主导）',
    'sourceHint',
    'ChainNode',
    'loadInterviewDrillFromSupabase',
  ];

  for (const token of pageMust) {
    if (!page.includes(token)) {
      fail('UI-001 page capability token', `Missing token in page: ${token}`);
    }
  }

  if (pageMust.every((t) => page.includes(t))) {
    ok('UI-001 page capability token', 'A/B chain switch + recursive render + data source hint found');
  }

  const repoMust = [
    'createClient',
    'interview_categories',
    'interview_answers',
    'interview_questions',
    'interview_chain_nodes',
    'a0_answer_id',
    'answer_id',
  ];
  for (const token of repoMust) {
    if (!repo.includes(token)) {
      fail('SUPA-001 repository token', `Missing token in repository: ${token}`);
    }
  }
  if (repoMust.every((t) => repo.includes(t))) {
    ok('SUPA-001 repository token', 'Supabase client + 4-table(v2) query wiring found');
  }

  const sqlMust = [
    'create table if not exists public.interview_categories',
    'create table if not exists public.interview_answers',
    'create table if not exists public.interview_questions',
    'create table if not exists public.interview_chain_nodes',
    'a0_answer_id uuid not null references public.interview_answers(id)',
    'answer_id uuid not null references public.interview_answers(id)',
    "constraint interview_chain_depth_check check (depth between 1 and 4)",
    "constraint interview_chain_close_reason_check check (close_reason in ('NONE', 'EARLY_CLOSE', 'FORCED_CLOSE_AT_DEPTH_4'))",
    'enable row level security',
    'create policy "anon_read_interview_categories"',
    'create policy "anon_read_interview_answers"',
    'create or replace view public.interview_answer_usage_v as',
  ];
  for (const token of sqlMust) {
    if (!sql.includes(token)) {
      fail('SUPA-002 migration token', `Missing token in migration: ${token}`);
    }
  }
  if (sqlMust.every((t) => sql.includes(t))) {
    ok('SUPA-002 migration token', 'Schema + RLS + policy found');
  }
}

function printReportAndExit() {
  let passCount = 0;
  let failCount = 0;

  for (const r of results) {
    if (r.pass) {
      passCount += 1;
      console.log(`[PASS] ${r.name} - ${r.detail}`);
    } else {
      failCount += 1;
      console.log(`[FAIL] ${r.name} - ${r.detail}`);
    }
  }

  console.log(`\nSummary: pass=${passCount}, fail=${failCount}`);
  process.exit(failCount > 0 ? 1 : 0);
}

try {
  const categories = loadInterviewData();
  validateDataRules(categories);
  validatePageAndSupabase();
  printReportAndExit();
} catch (err) {
  console.error('[FATAL]', err.message);
  process.exit(1);
}
