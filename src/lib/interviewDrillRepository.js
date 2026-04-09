import {createClient} from '@supabase/supabase-js';

const CHAIN_A = 'A';
const CHAIN_B = 'B';

function genUuid() {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}-${Math.random()
    .toString(16)
    .slice(2, 10)}`;
}

function inferContrastHint(questionText = '') {
  const q = questionText || '';
  if (q.includes('区别') || q.includes('对比') || q.includes('vs')) {
    return '补充区别：适用场景和代价。';
  }
  if (q.includes('为什么')) {
    return '补充原因：背景、取舍、收益。';
  }
  if (q.includes('怎么') || q.includes('如何')) {
    return '补充方法：步骤、动作、验收。';
  }
  return '补充边界：何时适用、何时不适用。';
}

function buildFeynmanAnswer({questionText = '', oral = '', deep = ''}) {
  const finalOral = oral || deep || '';
  const finalDeep = deep || oral || '';
  return {
    learning: `是什么：${finalOral}\n作用：用于解决当前问题并支撑后续追问。\n${inferContrastHint(questionText)}`,
    plain: finalDeep || finalOral,
    pitfall: '常见漏洞：只给结论，不讲场景、边界和取舍。',
    summary: finalOral,
  };
}

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
    a0Feynman: buildFeynmanAnswer({
      questionText: raw.q1,
      oral: raw.a0,
      deep: raw.a0Deep || raw.a0,
    }),
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
        feynman: buildFeynmanAnswer({
          questionText: child.prompt,
          oral: answer?.oral_text || '',
          deep: answer?.deep_text || answer?.oral_text || '',
        }),
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

async function insertInBatches(client, table, rows, batchSize = 200) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    const {error} = await client.from(table).insert(chunk);
    if (error) throw error;
  }
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

export async function saveInterviewDrillToSupabase({url, anonKey, categories}) {
  if (!assertSupabaseConfig(url, anonKey)) {
    throw new Error('Supabase 未配置');
  }
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error('没有可保存的题库数据');
  }

  const client = createClient(url, anonKey);

  const [existingCategoriesRes, existingQuestionsRes] = await Promise.all([
    client.from('interview_categories').select('id, slug'),
    client.from('interview_questions').select('id, slug'),
  ]);
  if (existingCategoriesRes.error) throw existingCategoriesRes.error;
  if (existingQuestionsRes.error) throw existingQuestionsRes.error;

  const existingCategoryMap = new Map(
    (existingCategoriesRes.data || []).map((item) => [item.slug, item.id])
  );
  const existingQuestionMap = new Map(
    (existingQuestionsRes.data || []).map((item) => [item.slug, item.id])
  );

  const categoryRows = categories.map((category, idx) => ({
    id: existingCategoryMap.get(category.id) || genUuid(),
    slug: category.id,
    label: category.label || category.id,
    heat: category.heat || 'A',
    sort_order: idx + 1,
  }));

  const {error: upsertCategoryErr} = await client
    .from('interview_categories')
    .upsert(categoryRows, {onConflict: 'slug'});
  if (upsertCategoryErr) throw upsertCategoryErr;

  const categoryLookupRes = await client
    .from('interview_categories')
    .select('id, slug');
  if (categoryLookupRes.error) throw categoryLookupRes.error;
  const categoryIdBySlug = new Map(
    (categoryLookupRes.data || []).map((item) => [item.slug, item.id])
  );

  const questionRows = [];
  const answerRows = [];
  const chainRows = [];
  const activeQuestionIds = [];
  const currentQuestionSlugs = new Set();

  const buildChain = ({
    nodes = [],
    questionId,
    chainType,
    parentId = null,
    depth = 1,
  }) => {
    nodes.forEach((node, idx) => {
      const nodeId = genUuid();
      const answerId = genUuid();
      answerRows.push({
        id: answerId,
        oral_text: node.a || '',
        deep_text: node.deepAnswer || node.a || '',
        is_active: true,
      });
      chainRows.push({
        id: nodeId,
        question_id: questionId,
        chain_type: chainType,
        parent_id: parentId,
        prompt: node.q || '',
        answer_id: answerId,
        depth,
        close_reason:
          node.closeReason ||
          (depth >= 4 ? 'FORCED_CLOSE_AT_DEPTH_4' : 'NONE'),
        sort_order: idx + 1,
      });
      if (Array.isArray(node.followUps) && node.followUps.length > 0) {
        buildChain({
          nodes: node.followUps,
          questionId,
          chainType,
          parentId: nodeId,
          depth: Math.min(depth + 1, 4),
        });
      }
    });
  };

  categories.forEach((category, categoryIdx) => {
    const categoryId = categoryIdBySlug.get(category.id);
    if (!categoryId) return;
    (category.questions || []).forEach((question, qIdx) => {
      currentQuestionSlugs.add(question.id);
      const questionId = existingQuestionMap.get(question.id) || genUuid();
      activeQuestionIds.push(questionId);

      const a0AnswerId = genUuid();
      answerRows.push({
        id: a0AnswerId,
        oral_text: question.a0 || '',
        deep_text: question.a0Deep || question.a0 || '',
        is_active: true,
      });

      questionRows.push({
        id: questionId,
        category_id: categoryId,
        slug: question.id,
        title: question.title || question.id,
        q1: question.q1 || question.title || '',
        a0_answer_id: a0AnswerId,
        aliases: question.aliases || [],
        sort_order: categoryIdx * 1000 + qIdx + 1,
        is_active: true,
      });

      buildChain({
        nodes: question.chainA || [],
        questionId,
        chainType: CHAIN_A,
      });
      buildChain({
        nodes: question.chainB || [],
        questionId,
        chainType: CHAIN_B,
      });
    });
  });

  if (questionRows.length === 0) {
    throw new Error('没有可保存的问题数据');
  }

  // deactivate all existing questions first, then reactivate current set
  const {error: deactivateErr} = await client
    .from('interview_questions')
    .update({is_active: false})
    .eq('is_active', true);
  if (deactivateErr) throw deactivateErr;

  await insertInBatches(client, 'interview_answers', answerRows, 200);

  const {error: upsertQuestionErr} = await client
    .from('interview_questions')
    .upsert(questionRows, {onConflict: 'slug'});
  if (upsertQuestionErr) throw upsertQuestionErr;

  if (activeQuestionIds.length > 0) {
    const {error: deleteChainErr} = await client
      .from('interview_chain_nodes')
      .delete()
      .in('question_id', activeQuestionIds);
    if (deleteChainErr) throw deleteChainErr;
  }

  await insertInBatches(client, 'interview_chain_nodes', chainRows, 200);

  return {
    categories: categoryRows.length,
    questions: questionRows.length,
    answers: answerRows.length,
    nodes: chainRows.length,
    questionSlugs: Array.from(currentQuestionSlugs),
  };
}
