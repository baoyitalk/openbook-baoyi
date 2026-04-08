#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {createClient} = require('@supabase/supabase-js');

const ROOT = '/Users/johnpeng/career_data/code/openbook-baoyi';
const ENV_LOCAL = path.join(ROOT, '.env.local');

function loadEnvFromLocalFile() {
  const env = {};
  if (!fs.existsSync(ENV_LOCAL)) return env;

  const lines = fs.readFileSync(ENV_LOCAL, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const idx = trimmed.indexOf('=');
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    env[key] = value;
  }
  return env;
}

function getSupabaseConfig() {
  const fileEnv = loadEnvFromLocalFile();
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    fileEnv.SUPABASE_URL ||
    fileEnv.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    fileEnv.SUPABASE_ANON_KEY ||
    fileEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {url, anonKey};
}

function buildChainTree(nodes, questionId, chainType) {
  const scoped = nodes
    .filter((n) => n.question_id === questionId && n.chain_type === chainType)
    .sort((a, b) => {
      if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
      return String(a.created_at || '').localeCompare(String(b.created_at || ''));
    });

  const byParent = new Map();
  for (const node of scoped) {
    const key = node.parent_id || '__root__';
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(node);
  }

  const toTree = (parent = '__root__') => {
    const children = byParent.get(parent) || [];
    return children.map((c) => ({
      id: c.id,
      q: c.prompt,
      answer_id: c.answer_id,
      depth: c.depth,
      close_reason: c.close_reason,
      followUps: toTree(c.id),
    }));
  };

  return toTree();
}

function walkNodes(nodes, depth, cb) {
  for (const n of nodes) {
    cb(n, depth);
    walkNodes(n.followUps || [], depth + 1, cb);
  }
}

function countNodes(nodes) {
  let count = 0;
  walkNodes(nodes, 1, () => {
    count += 1;
  });
  return count;
}

function maxDepth(nodes) {
  let depth = 0;
  walkNodes(nodes, 1, (_, d) => {
    if (d > depth) depth = d;
  });
  return depth;
}

async function main() {
  const {url, anonKey} = getSupabaseConfig();
  if (!url || !anonKey) {
    console.error('[FAIL] SUPABASE config missing (SUPABASE_URL / SUPABASE_ANON_KEY)');
    process.exit(1);
  }

  const client = createClient(url, anonKey);

  const [categoriesRes, answersRes, questionsRes, chainRes] = await Promise.all([
    client
      .from('interview_categories')
      .select('id, slug, label, heat, sort_order')
      .order('sort_order', {ascending: true}),
    client
      .from('interview_answers')
      .select('id, slug, oral_text, deep_text, is_active')
      .eq('is_active', true),
    client
      .from('interview_questions')
      .select('id, category_id, slug, title, q1, a0_answer_id, aliases, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', {ascending: true}),
    client
      .from('interview_chain_nodes')
      .select('id, question_id, chain_type, parent_id, prompt, answer_id, depth, close_reason, sort_order, created_at')
      .order('sort_order', {ascending: true}),
  ]);

  if (categoriesRes.error) throw categoriesRes.error;
  if (answersRes.error) throw answersRes.error;
  if (questionsRes.error) throw questionsRes.error;
  if (chainRes.error) throw chainRes.error;

  const categories = categoriesRes.data || [];
  const answers = answersRes.data || [];
  const questions = questionsRes.data || [];
  const nodes = chainRes.data || [];
  const answerIds = new Set(answers.map((a) => a.id));

  if (categories.length === 0) {
    console.error('[FAIL] no categories in Supabase');
    process.exit(1);
  }
  if (questions.length === 0) {
    console.error('[FAIL] no active questions in Supabase');
    process.exit(1);
  }
  if (answers.length === 0) {
    console.error('[FAIL] no active answers in Supabase');
    process.exit(1);
  }

  const categoryIds = new Set(categories.map((c) => c.id));
  const byQuestion = new Map(questions.map((q) => [q.id, q]));

  let failCount = 0;
  let checkedChains = 0;

  for (const q of questions) {
    if (!categoryIds.has(q.category_id)) {
      console.log(`[FAIL] question without valid category: ${q.slug}`);
      failCount += 1;
    }

    if (!answerIds.has(q.a0_answer_id)) {
      console.log(`[FAIL] question ${q.slug} has invalid a0_answer_id`);
      failCount += 1;
    }

    for (const chainType of ['A', 'B']) {
      const tree = buildChainTree(nodes, q.id, chainType);
      const total = countNodes(tree);
      checkedChains += 1;

      if (total < 5) {
        console.log(`[FAIL] ${q.slug} chain ${chainType} total=${total} (<5)`);
        failCount += 1;
      }
      if (total > 16) {
        console.log(`[FAIL] ${q.slug} chain ${chainType} total=${total} (>16)`);
        failCount += 1;
      }

      const depth = maxDepth(tree);
      if (depth > 4) {
        console.log(`[FAIL] ${q.slug} chain ${chainType} depth=${depth} (>4)`);
        failCount += 1;
      }

      walkNodes(tree, 1, (node) => {
        if (!node.q || !node.answer_id) {
          console.log(`[FAIL] ${q.slug} chain ${chainType} node empty q/answer_id: ${node.id}`);
          failCount += 1;
        }
        if (!answerIds.has(node.answer_id)) {
          console.log(`[FAIL] ${q.slug} chain ${chainType} node has invalid answer_id: ${node.id}`);
          failCount += 1;
        }
        if (node.depth > 4 || node.depth < 1) {
          console.log(`[FAIL] ${q.slug} chain ${chainType} node depth out of range: ${node.id} depth=${node.depth}`);
          failCount += 1;
        }
        if (node.depth === 4 && node.close_reason === 'NONE') {
          console.log(`[FAIL] ${q.slug} chain ${chainType} depth=4 must have close_reason: ${node.id}`);
          failCount += 1;
        }
        const children = (node.followUps || []).length;
        if (children > 3) {
          console.log(`[FAIL] ${q.slug} chain ${chainType} node children=${children} (>3)`);
          failCount += 1;
        }
      });
    }
  }

  // parent pointers should refer to existing node ids when not null
  const nodeIds = new Set(nodes.map((n) => n.id));
  for (const n of nodes) {
    if (n.parent_id && !nodeIds.has(n.parent_id)) {
      const q = byQuestion.get(n.question_id);
      console.log(`[FAIL] broken parent_id in question=${q ? q.slug : n.question_id}, node=${n.id}`);
      failCount += 1;
    }
  }

  if (failCount > 0) {
    console.log(`\nSummary: FAIL (${failCount}) checkedChains=${checkedChains}, categories=${categories.length}, answers=${answers.length}, questions=${questions.length}`);
    process.exit(1);
  }

  console.log(`[PASS] Supabase schema reachable`);
  console.log(`[PASS] categories=${categories.length}, answers=${answers.length}, questions=${questions.length}, nodes=${nodes.length}`);
  console.log(`[PASS] checkedChains=${checkedChains}, rule violations=0`);
}

main().catch((err) => {
  console.error('[FATAL]', err.message || err);
  process.exit(1);
});
