import React, {useEffect, useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import {
  interviewCategories as fallbackInterviewCategories,
  sharedAnswerLibrary,
} from '../../data/interviewDrillData';
import {
  loadInterviewDrillFromSupabase,
  saveInterviewDrillToSupabase,
} from '../../lib/interviewDrillRepository';

const DRAFT_STORAGE_KEY = 'interview-drill-edit-draft-v1';

function normalizeText(text) {
  return (text || '').toLowerCase();
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function inferContrastHint(questionText = '') {
  const q = questionText || '';
  if (q.includes('区别') || q.includes('对比') || q.includes('vs')) {
    return '重点补一句区别：分别适用什么场景、各自代价是什么。';
  }
  if (q.includes('为什么')) {
    return '重点补一句为什么：问题背景、方案取舍和最终收益。';
  }
  if (q.includes('怎么') || q.includes('如何')) {
    return '重点补一句怎么做：步骤顺序、落地动作和验收指标。';
  }
  return '重点补一句边界：什么时候用、什么时候不用。';
}

function buildFeynmanAnswer({questionText = '', oral = '', deep = '', source = {}}) {
  const finalOral = oral || deep || '';
  const finalDeep = deep || oral || '';
  const learning =
    source.learning ||
    `是什么：${finalOral}\n作用：解决当前问题里的核心矛盾，保证回答可落地。\n${inferContrastHint(questionText)}`;
  const plain = source.plain || finalDeep || finalOral;
  const pitfall =
    source.pitfall ||
    '常见漏洞：只报结论，不讲场景、边界、代价，容易被继续追问卡住。';
  const summary = source.summary || finalOral;

  return {learning, plain, pitfall, summary};
}

function getNodeId(questionId, chainType, displayPath) {
  return `${questionId}.${chainType}.${displayPath.join('.')}`;
}

function collectAnswerRefUsage(categories) {
  const usage = {};
  const walk = (nodes = []) => {
    nodes.forEach((node) => {
      if (node.answerRef) {
        usage[node.answerRef] = (usage[node.answerRef] || 0) + 1;
      }
      if (node.followUps && node.followUps.length > 0) {
        walk(node.followUps);
      }
    });
  };

  categories.forEach((category) => {
    category.questions.forEach((q) => {
      walk(q.chainA);
      walk(q.chainB);
    });
  });

  return usage;
}

function resolveAnswerPayload(question, node) {
  if (node.answerRef) {
    const local = question.answerLibrary?.[node.answerRef];
    const shared = sharedAnswerLibrary?.[node.answerRef];
    const fromRef = local || shared;
    if (fromRef) {
      if (typeof fromRef === 'string') {
        return {
          oral: fromRef,
          deep: fromRef,
          feynman: buildFeynmanAnswer({
            questionText: node.q,
            oral: fromRef,
            deep: fromRef,
          }),
        };
      }
      const oral = fromRef.oral || node.a || '';
      const deep = fromRef.deep || fromRef.oral || node.a || '';
      return {
        oral,
        deep,
        feynman: buildFeynmanAnswer({
          questionText: node.q,
          oral,
          deep,
          source: fromRef.feynman || {},
        }),
      };
    }
  }

  const oral = node.a || '';
  const deep = node.deepAnswer || node.a || '';
  return {
    oral,
    deep,
    feynman: buildFeynmanAnswer({
      questionText: node.q,
      oral,
      deep,
      source: node.feynman || {},
    }),
  };
}

function flattenChain(chain) {
  const result = [];
  const walk = (nodes = []) => {
    nodes.forEach((node) => {
      result.push(node.q, node.a, node.deepAnswer || '', node.answerRef || '', node.discussion || '');
      if (node.followUps && node.followUps.length > 0) {
        walk(node.followUps);
      }
    });
  };
  walk(chain);
  return result;
}

function matchesKeyword(question, keyword) {
  const k = normalizeText(keyword).trim();
  if (!k) return true;

  const hay = [
    question.title,
    question.q1,
    question.a0,
    question.discussion || '',
    ...(question.aliases || []),
    ...flattenChain(question.chainA),
    ...flattenChain(question.chainB),
  ]
    .join(' ')
    .toLowerCase();

  return hay.includes(k);
}

function getQuestionById(categories, questionId) {
  for (let i = 0; i < categories.length; i += 1) {
    const qIndex = categories[i].questions.findIndex((q) => q.id === questionId);
    if (qIndex !== -1) {
      return {categoryIndex: i, questionIndex: qIndex};
    }
  }
  return null;
}

function getChainKey(chainType) {
  return chainType === 'A' ? 'chainA' : 'chainB';
}

function createEmptyNode() {
  return {
    q: '新追问',
    a: '待补充口语答案',
    deepAnswer: '待补充深层答案',
    discussion: '',
    followUps: [],
  };
}

function ChainNode({
  item,
  question,
  questionId,
  chainType,
  displayPath,
  indexPath,
  openAnswers,
  onToggle,
  answerRefUsage,
  isEditMode,
  onUpdateNode,
  onAddChild,
  onDeleteNode,
}) {
  const nodeId = item.id || getNodeId(questionId, chainType, displayPath);
  const answerKey = `${nodeId}::oral`;
  const deepKey = `${nodeId}::deep`;
  const isOpen = !!openAnswers[answerKey];
  const deepOpen = !!openAnswers[deepKey];
  const hasChildren = item.followUps && item.followUps.length > 0;
  const answer = resolveAnswerPayload(question, item);
  const depth = displayPath.length;

  return (
    <li className={styles.chainItem} id={nodeId}>
      <div className={styles.nodeMeta}>ID: {nodeId}</div>
      {item.answerRef && (
        <div className={styles.refMeta}>
          Ref: {item.answerRef} · x{answerRefUsage[item.answerRef] || 1}
          {(answerRefUsage[item.answerRef] || 0) > 1 && (
            <span className={styles.hotRefBadge}>高频</span>
          )}
        </div>
      )}
      <div className={styles.followUpQ}>追问 {displayPath.join('.')}：{item.q}</div>

      {isEditMode && (
        <div className={styles.editPanel}>
          <div className={styles.editorGrid}>
            <label className={styles.editorLabel}>
              追问
              <input
                className={styles.editorInput}
                value={item.q || ''}
                onChange={(e) => onUpdateNode(indexPath, 'q', e.target.value)}
              />
            </label>
            <label className={styles.editorLabel}>
              口语答案
              <textarea
                className={styles.editorTextarea}
                value={item.a || ''}
                onChange={(e) => onUpdateNode(indexPath, 'a', e.target.value)}
              />
            </label>
            <label className={styles.editorLabel}>
              深层答案
              <textarea
                className={styles.editorTextarea}
                value={item.deepAnswer || ''}
                onChange={(e) => onUpdateNode(indexPath, 'deepAnswer', e.target.value)}
              />
            </label>
            <label className={styles.editorLabel}>
              讨论备注
              <textarea
                className={styles.editorTextarea}
                value={item.discussion || ''}
                onChange={(e) => onUpdateNode(indexPath, 'discussion', e.target.value)}
              />
            </label>
          </div>
          <div className={styles.editorActions}>
            {depth < 4 && (
              <button type="button" className={styles.editorBtn} onClick={() => onAddChild(indexPath)}>
                + 子追问
              </button>
            )}
            <button type="button" className={clsx(styles.editorBtn, styles.dangerBtn)} onClick={() => onDeleteNode(indexPath)}>
              删除节点
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className={styles.answerToggle}
        onClick={() => onToggle(answerKey)}>
        {isOpen ? '收起答案' : '展开答案'}
      </button>
      {isOpen && (
        <div className={styles.followUpA}>
          <div><strong>口语版：</strong>{answer.oral}</div>
          <button
            type="button"
            className={styles.deepAnswerToggle}
            onClick={() => onToggle(deepKey)}>
            {deepOpen ? '收起深层答案' : '展开深层答案'}
          </button>
          {deepOpen && (
            <div className={styles.deepAnswerBox}>
              <div className={styles.feynmanBlock}>
                <div><strong>1. 学习理解：</strong>{answer.feynman.learning}</div>
                <div><strong>2. 大白讲解：</strong>{answer.feynman.plain}</div>
                <div><strong>3. 漏洞点：</strong>{answer.feynman.pitfall}</div>
                <div><strong>4. 简短总结：</strong>{answer.feynman.summary}</div>
              </div>
            </div>
          )}
          {item.discussion && <div className={styles.discussionBox}><strong>讨论：</strong>{item.discussion}</div>}
        </div>
      )}
      {isOpen && hasChildren && (
        <>
          <div className={styles.deepHint}>继续深挖：</div>
          <ol className={styles.subChainList}>
            {item.followUps.map((child, idx) => (
              <ChainNode
                key={`${nodeId}-${idx}`}
                item={child}
                question={question}
                questionId={questionId}
                chainType={chainType}
                displayPath={[...displayPath, idx + 1]}
                indexPath={[...indexPath, idx]}
                openAnswers={openAnswers}
                onToggle={onToggle}
                answerRefUsage={answerRefUsage}
                isEditMode={isEditMode}
                onUpdateNode={onUpdateNode}
                onAddChild={onAddChild}
                onDeleteNode={onDeleteNode}
              />
            ))}
          </ol>
        </>
      )}
    </li>
  );
}

function ChainList({
  chain,
  question,
  questionId,
  chainType,
  openAnswers,
  onToggle,
  answerRefUsage,
  isEditMode,
  onUpdateNode,
  onAddChild,
  onDeleteNode,
  onAddRoot,
}) {
  return (
    <>
      {isEditMode && (
        <div className={styles.editorActionsTop}>
          <button type="button" className={styles.editorBtn} onClick={onAddRoot}>
            + 新增一级追问
          </button>
        </div>
      )}
      <ol className={styles.chainList}>
        {chain.map((item, idx) => (
          <ChainNode
            key={`root-${idx}`}
            item={item}
            question={question}
            questionId={questionId}
            chainType={chainType}
            displayPath={[idx + 1]}
            indexPath={[idx]}
            openAnswers={openAnswers}
            onToggle={onToggle}
            answerRefUsage={answerRefUsage}
            isEditMode={isEditMode}
            onUpdateNode={onUpdateNode}
            onAddChild={onAddChild}
            onDeleteNode={onDeleteNode}
          />
        ))}
      </ol>
    </>
  );
}

export default function InterviewDrillPage() {
  const {siteConfig} = useDocusaurusContext();
  const {supabaseUrl, supabaseAnonKey} = siteConfig.customFields || {};

  const [interviewCategories, setInterviewCategories] = useState(fallbackInterviewCategories);
  const [baselineCategories, setBaselineCategories] = useState(fallbackInterviewCategories);
  const [remoteStatus, setRemoteStatus] = useState('idle');
  const [keyword, setKeyword] = useState('');
  const [chainType, setChainType] = useState('A');
  const [openAnswers, setOpenAnswers] = useState({});
  const [mode, setMode] = useState('view');
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState({type: 'idle', message: ''});

  useEffect(() => {
    let cancelled = false;

    async function loadRemote() {
      let base = fallbackInterviewCategories;
      let nextStatus = 'idle';

      if (supabaseUrl && supabaseAnonKey) {
        nextStatus = 'loading';
        if (!cancelled) setRemoteStatus(nextStatus);
        try {
          const remote = await loadInterviewDrillFromSupabase({
            url: String(supabaseUrl),
            anonKey: String(supabaseAnonKey),
          });
          if (remote.length > 0) {
            base = remote;
            nextStatus = 'ready';
          }
        } catch (err) {
          nextStatus = 'error';
          // eslint-disable-next-line no-console
          console.warn('Supabase interview data load failed, fallback to local data.', err);
        }
      }

      if (cancelled) return;

      let finalData = base;
      if (typeof window !== 'undefined') {
        const draftRaw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
        if (draftRaw) {
          try {
            const parsed = JSON.parse(draftRaw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              finalData = parsed;
              nextStatus = nextStatus === 'error' ? 'error' : 'draft';
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn('invalid local draft ignored', err);
          }
        }
      }

      setBaselineCategories(base);
      setInterviewCategories(finalData);
      setRemoteStatus(nextStatus);
      setDraftLoaded(true);
    }

    loadRemote();
    return () => {
      cancelled = true;
    };
  }, [supabaseUrl, supabaseAnonKey]);

  const filteredCategories = useMemo(() => {
    return interviewCategories
      .map((category) => ({
        ...category,
        questions: category.questions.filter((q) => matchesKeyword(q, keyword)),
      }))
      .filter((category) => category.questions.length > 0);
  }, [interviewCategories, keyword]);

  const totalCount = filteredCategories.reduce(
    (acc, category) => acc + category.questions.length,
    0
  );

  const answerRefUsage = useMemo(
    () => collectAnswerRefUsage(interviewCategories),
    [interviewCategories]
  );

  const mutateCategories = (mutator) => {
    setInterviewCategories((prev) => {
      const next = deepClone(prev);
      mutator(next);
      return next;
    });
  };

  const saveDraft = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(interviewCategories));
    setRemoteStatus('draft');
    setSaveStatus({type: 'local', message: '草稿已保存到本地浏览器。'});
  };

  const clearDraft = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    setInterviewCategories(deepClone(baselineCategories));
    setRemoteStatus(supabaseUrl && supabaseAnonKey ? 'ready' : 'idle');
    setSaveStatus({type: 'idle', message: ''});
  };

  const saveToDatabase = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setSaveStatus({type: 'error', message: '未配置 Supabase，无法落库。'});
      return;
    }
    setSaveStatus({type: 'saving', message: '正在写入 Supabase...'});
    try {
      const summary = await saveInterviewDrillToSupabase({
        url: String(supabaseUrl),
        anonKey: String(supabaseAnonKey),
        categories: interviewCategories,
      });
      setSaveStatus({
        type: 'success',
        message: `写库成功：分类 ${summary.categories}，问题 ${summary.questions}，追问节点 ${summary.nodes}。`,
      });
      setRemoteStatus('ready');
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    } catch (err) {
      setSaveStatus({
        type: 'error',
        message: `写库失败：${err.message || '未知错误'}（请检查 RLS 写入策略）。`,
      });
    }
  };

  const addQuestion = (categoryId) => {
    mutateCategories((next) => {
      const cat = next.find((c) => c.id === categoryId);
      if (!cat) return;
      const stamp = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      cat.questions.unshift({
        id: `${slugify(categoryId)}-new-${stamp}`,
        title: '新问题',
        aliases: [],
        q1: '请补充主问题',
        a0: '请补充口语回答',
        a0Deep: '请补充深层回答',
        discussion: '',
        chainA: [],
        chainB: [],
      });
    });
  };

  const deleteQuestion = (questionId) => {
    mutateCategories((next) => {
      next.forEach((cat) => {
        cat.questions = cat.questions.filter((q) => q.id !== questionId);
      });
    });
  };

  const updateQuestionField = (questionId, field, value) => {
    mutateCategories((next) => {
      const pos = getQuestionById(next, questionId);
      if (!pos) return;
      const q = next[pos.categoryIndex].questions[pos.questionIndex];
      if (field === 'aliases') {
        q.aliases = value
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        q[field] = value;
      }
    });
  };

  const withNodeList = (next, questionId, selectedChainType, indexPath, mutator) => {
    const pos = getQuestionById(next, questionId);
    if (!pos) return;
    const q = next[pos.categoryIndex].questions[pos.questionIndex];
    const chainKey = getChainKey(selectedChainType);
    let list = q[chainKey];

    if (indexPath.length === 0) {
      mutator(list, -1);
      return;
    }

    for (let i = 0; i < indexPath.length - 1; i += 1) {
      const idx = indexPath[i];
      if (!list[idx]) return;
      list = list[idx].followUps || [];
    }

    const lastIndex = indexPath[indexPath.length - 1];
    mutator(list, lastIndex);
  };

  const addRootNode = (questionId, selectedChainType) => {
    mutateCategories((next) => {
      withNodeList(next, questionId, selectedChainType, [], (list) => {
        list.push(createEmptyNode());
      });
    });
  };

  const updateNodeField = (questionId, selectedChainType, indexPath, field, value) => {
    mutateCategories((next) => {
      withNodeList(next, questionId, selectedChainType, indexPath, (list, nodeIndex) => {
        if (!list[nodeIndex]) return;
        list[nodeIndex][field] = value;
      });
    });
  };

  const addChildNode = (questionId, selectedChainType, indexPath) => {
    mutateCategories((next) => {
      withNodeList(next, questionId, selectedChainType, indexPath, (list, nodeIndex) => {
        const node = list[nodeIndex];
        if (!node) return;
        const depth = indexPath.length;
        if (depth >= 4) return;
        if (!Array.isArray(node.followUps)) node.followUps = [];
        node.followUps.push(createEmptyNode());
      });
    });
  };

  const deleteNode = (questionId, selectedChainType, indexPath) => {
    mutateCategories((next) => {
      withNodeList(next, questionId, selectedChainType, indexPath, (list, nodeIndex) => {
        if (nodeIndex < 0 || nodeIndex >= list.length) return;
        list.splice(nodeIndex, 1);
      });
    });
  };

  const getSourceHint = () => {
    if (remoteStatus === 'loading') return '数据源：正在从 Supabase 同步题库...';
    if (remoteStatus === 'ready') return '数据源：Supabase';
    if (remoteStatus === 'draft') return '数据源：本地草稿（你在编辑模式保存过草稿）';
    if (remoteStatus === 'error') return '数据源：本地回退（Supabase 读取失败，请检查环境变量与表结构）';
    return '数据源：本地（未检测到 Supabase 配置）';
  };

  return (
    <Layout title="面试速刷" description="可搜索、可切链路、可折叠答案的面试速刷页">
      <main className={styles.page}>
        <section className={styles.header}>
          <h1>面试速刷台</h1>
          <p>目标：面试前快速定位问题，按 A 链（回答触发）或 B 链（面试官主导）演练。</p>
          <div className={styles.controls}>
            <input
              type="search"
              placeholder="输入关键词，比如：jsbridge / fiber / 首屏优化"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className={styles.searchInput}
            />
            <div className={styles.chainSwitch}>
              <button
                type="button"
                className={clsx(styles.switchBtn, chainType === 'A' && styles.active)}
                onClick={() => setChainType('A')}>
                A链（回答触发）
              </button>
              <button
                type="button"
                className={clsx(styles.switchBtn, chainType === 'B' && styles.active)}
                onClick={() => setChainType('B')}>
                B链（面试官主导）
              </button>
              <button
                type="button"
                className={clsx(styles.switchBtn, mode === 'view' && styles.active)}
                onClick={() => setMode('view')}>
                阅览模式
              </button>
              <button
                type="button"
                className={clsx(styles.switchBtn, mode === 'edit' && styles.active)}
                onClick={() => setMode('edit')}>
                编辑模式
              </button>
            </div>
          </div>
          <div className={styles.resultMeta}>当前命中 {totalCount} 道题</div>
          <div className={styles.sourceHint}>{getSourceHint()}</div>
          {mode === 'edit' && draftLoaded && (
            <div className={styles.editorActionsTop}>
              <button type="button" className={styles.editorBtn} onClick={saveDraft}>保存草稿</button>
              <button type="button" className={styles.editorBtn} onClick={saveToDatabase}>
                保存到数据库
              </button>
              <button type="button" className={styles.editorBtn} onClick={() => setInterviewCategories(deepClone(baselineCategories))}>重置为基线</button>
              <button type="button" className={clsx(styles.editorBtn, styles.dangerBtn)} onClick={clearDraft}>清空草稿并恢复</button>
            </div>
          )}
          {saveStatus.type !== 'idle' && (
            <div
              className={clsx(
                styles.saveStatus,
                saveStatus.type === 'error' && styles.saveStatusError,
                saveStatus.type === 'success' && styles.saveStatusSuccess
              )}>
              {saveStatus.message}
            </div>
          )}
        </section>

        <section className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarTitle}>分类索引</div>
            {filteredCategories.map((category) => (
              <div key={category.id} className={styles.sidebarBlock}>
                <div className={styles.categoryTitle}>
                  <span>{category.label}</span>
                  <span className={styles.heatTag}>{category.heat}</span>
                </div>
                <ul className={styles.questionNav}>
                  {category.questions.map((q) => (
                    <li key={q.id}>
                      <a href={`#${q.id}`}>{q.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          <section className={styles.content}>
            {filteredCategories.map((category) => (
              <article key={category.id} className={styles.categorySection}>
                <div className={styles.categoryHeaderLine}>
                  <h2>{category.label}</h2>
                  {mode === 'edit' && (
                    <button type="button" className={styles.editorBtn} onClick={() => addQuestion(category.id)}>
                      + 新问题
                    </button>
                  )}
                </div>

                {category.questions.map((q) => (
                  <div key={q.id} id={q.id} className={styles.questionCard}>
                    {mode === 'edit' ? (
                      <div className={styles.editPanel}>
                        <div className={styles.nodeMeta}>ID: {q.id}</div>
                        <div className={styles.editorGrid}>
                          <label className={styles.editorLabel}>
                            标题
                            <input className={styles.editorInput} value={q.title || ''} onChange={(e) => updateQuestionField(q.id, 'title', e.target.value)} />
                          </label>
                          <label className={styles.editorLabel}>
                            Q1
                            <input className={styles.editorInput} value={q.q1 || ''} onChange={(e) => updateQuestionField(q.id, 'q1', e.target.value)} />
                          </label>
                          <label className={styles.editorLabel}>
                            A0 口语
                            <textarea className={styles.editorTextarea} value={q.a0 || ''} onChange={(e) => updateQuestionField(q.id, 'a0', e.target.value)} />
                          </label>
                          <label className={styles.editorLabel}>
                            A0 深层
                            <textarea className={styles.editorTextarea} value={q.a0Deep || ''} onChange={(e) => updateQuestionField(q.id, 'a0Deep', e.target.value)} />
                          </label>
                          <label className={styles.editorLabel}>
                            别名（逗号分隔）
                            <input
                              className={styles.editorInput}
                              value={(q.aliases || []).join(', ')}
                              onChange={(e) => updateQuestionField(q.id, 'aliases', e.target.value)}
                            />
                          </label>
                          <label className={styles.editorLabel}>
                            讨论备注
                            <textarea className={styles.editorTextarea} value={q.discussion || ''} onChange={(e) => updateQuestionField(q.id, 'discussion', e.target.value)} />
                          </label>
                        </div>
                        <div className={styles.editorActions}>
                          <button type="button" className={clsx(styles.editorBtn, styles.dangerBtn)} onClick={() => deleteQuestion(q.id)}>
                            删除问题
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3>{q.title}</h3>
                        <div className={styles.aliases}>
                          {(q.aliases || []).map((alias) => (
                            <span key={alias} className={styles.aliasTag}>{alias}</span>
                          ))}
                        </div>
                      </>
                    )}

                    <div className={styles.mainQA}>
                      <div className={styles.nodeMeta}>ID: {q.id}.root</div>
                      <p><strong>Q1：</strong>{q.q1}</p>
                      <p><strong>A0 口语版：</strong>{q.a0}</p>
                      <details className={styles.a0Deep}>
                        <summary>A0 深层版（费曼4段，默认折叠）</summary>
                        {(() => {
                          const a0Feynman = buildFeynmanAnswer({
                            questionText: q.q1,
                            oral: q.a0 || q.a0Deep || '',
                            deep: q.a0Deep || q.a0 || '',
                            source: q.a0Feynman || {},
                          });
                          return (
                            <div className={styles.feynmanBlock}>
                              <div><strong>1. 学习理解：</strong>{a0Feynman.learning}</div>
                              <div><strong>2. 大白讲解：</strong>{a0Feynman.plain}</div>
                              <div><strong>3. 漏洞点：</strong>{a0Feynman.pitfall}</div>
                              <div><strong>4. 简短总结：</strong>{a0Feynman.summary}</div>
                            </div>
                          );
                        })()}
                      </details>
                      {q.discussion && <div className={styles.discussionBox}><strong>讨论：</strong>{q.discussion}</div>}
                    </div>

                    <ChainList
                      chain={chainType === 'A' ? q.chainA : q.chainB}
                      question={q}
                      questionId={q.id}
                      chainType={chainType}
                      answerRefUsage={answerRefUsage}
                      openAnswers={openAnswers[q.id] || {}}
                      isEditMode={mode === 'edit'}
                      onAddRoot={() => addRootNode(q.id, chainType)}
                      onUpdateNode={(indexPath, field, value) => updateNodeField(q.id, chainType, indexPath, field, value)}
                      onAddChild={(indexPath) => addChildNode(q.id, chainType, indexPath)}
                      onDeleteNode={(indexPath) => deleteNode(q.id, chainType, indexPath)}
                      onToggle={(key) => {
                        setOpenAnswers((prev) => ({
                          ...prev,
                          [q.id]: {
                            ...(prev[q.id] || {}),
                            [key]: !(prev[q.id] || {})[key],
                          },
                        }));
                      }}
                    />
                  </div>
                ))}
              </article>
            ))}
          </section>
        </section>
      </main>
    </Layout>
  );
}
