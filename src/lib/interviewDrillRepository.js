import {createClient} from '@supabase/supabase-js';

const CHAIN_A = 'A';
const CHAIN_B = 'B';

function mapCategory(raw) {
  return {
    id: raw.slug,
    label: raw.label,
    heat: raw.heat || 'A',
    questions: [],
  };
}

function mapQuestion(raw) {
  return {
    id: raw.slug,
    title: raw.title,
    aliases: raw.aliases || [],
    q1: raw.q1,
    a0: raw.a0,
    a0Deep: raw.a0Deep || raw.a0,
    chainA: [],
    chainB: [],
  };
}

function buildChainTree(nodes, questionId, chainType, answerMap) {
  const scoped = nodes
    .filter((n) => n.question_id === questionId && n.chain_type === chainType)
    .sort((a, b) => {
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order;
      }
      return a.created_at.localeCompare(b.created_at);
    });

  const byParent = new Map();
  scoped.forEach((node) => {
    const key = node.parent_id || '__root__';
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(node);
  });

  const toTree = (parentId = '__root__') => {
    const children = byParent.get(parentId) || [];
    return children.map((child) => {
      const answer = answerMap.get(child.answer_id);
      return {
        id: child.id,
        q: child.prompt,
        a: answer?.oral_text || '',
        deepAnswer: answer?.deep_text || answer?.oral_text || '',
        answerRef: child.answer_id,
        closeReason: child.close_reason || 'NONE',
        depth: child.depth,
        followUps: toTree(child.id),
      };
    });
  };

  return toTree();
}

function assertSupabaseConfig(url, anonKey) {
  return Boolean(url && anonKey);
}

export async function loadInterviewDrillFromSupabase({url, anonKey}) {
  if (!assertSupabaseConfig(url, anonKey)) {
    throw new Error('Supabase 未配置');
  }

  const client = createClient(url, anonKey);

  const [categoriesRes, answersRes, questionsRes, chainRes] = await Promise.all([
    client
      .from('interview_categories')
      .select('id, slug, label, heat, sort_order')
      .order('sort_order', {ascending: true}),
    client
      .from('interview_answers')
      .select('id, oral_text, deep_text, is_active')
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
  const answerMap = new Map(answers.map((a) => [a.id, a]));

  const categoryMap = new Map();
  categories.forEach((c) => {
    categoryMap.set(c.id, mapCategory(c));
  });

  questions.forEach((q) => {
    const category = categoryMap.get(q.category_id);
    if (!category) return;
    const a0Answer = answerMap.get(q.a0_answer_id);
    if (!a0Answer) return;

    const mapped = mapQuestion({
      ...q,
      a0: a0Answer.oral_text,
      a0Deep: a0Answer.deep_text || a0Answer.oral_text,
    });
    mapped.a0AnswerRef = q.a0_answer_id;
    mapped.chainA = buildChainTree(nodes, q.id, CHAIN_A, answerMap);
    mapped.chainB = buildChainTree(nodes, q.id, CHAIN_B, answerMap);
    category.questions.push(mapped);
  });

  return Array.from(categoryMap.values()).filter((c) => c.questions.length > 0);
}
