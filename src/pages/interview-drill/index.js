import React, {useEffect, useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import {
  interviewCategories as fallbackInterviewCategories,
  sharedAnswerLibrary,
} from '../../data/interviewDrillData';
import {loadInterviewDrillFromSupabase} from '../../lib/interviewDrillRepository';

function normalizeText(text) {
  return (text || '').toLowerCase();
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
  const plain =
    source.plain ||
    finalDeep ||
    finalOral;
  const pitfall =
    source.pitfall ||
    '常见漏洞：只报结论，不讲场景、边界、代价，容易被继续追问卡住。';
  const summary =
    source.summary ||
    finalOral;

  return {learning, plain, pitfall, summary};
}

function getNodeId(questionId, chainType, path) {
  return `${questionId}.${chainType}.${path.join('.')}`;
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
      result.push(node.q, node.a, node.deepAnswer || '', node.answerRef || '');
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
    ...(question.aliases || []),
    ...flattenChain(question.chainA),
    ...flattenChain(question.chainB),
  ]
    .join(' ')
    .toLowerCase();

  return hay.includes(k);
}

function ChainNode({
  item,
  question,
  questionId,
  chainType,
  path,
  openAnswers,
  onToggle,
  answerRefUsage,
}) {
  const nodeId = item.id || getNodeId(questionId, chainType, path);
  const answerKey = `${nodeId}::oral`;
  const deepKey = `${nodeId}::deep`;
  const isOpen = !!openAnswers[answerKey];
  const deepOpen = !!openAnswers[deepKey];
  const hasChildren = item.followUps && item.followUps.length > 0;
  const answer = resolveAnswerPayload(question, item);

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
      <div className={styles.followUpQ}>追问 {path.join('.')}：{item.q}</div>
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
                path={[...path, idx + 1]}
                openAnswers={openAnswers}
                onToggle={onToggle}
                answerRefUsage={answerRefUsage}
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
}) {
  return (
    <ol className={styles.chainList}>
      {chain.map((item, idx) => (
        <ChainNode
          key={`root-${idx}`}
          item={item}
          question={question}
          questionId={questionId}
          chainType={chainType}
          path={[idx + 1]}
          openAnswers={openAnswers}
          onToggle={onToggle}
          answerRefUsage={answerRefUsage}
        />
      ))}
    </ol>
  );
}

export default function InterviewDrillPage() {
  const {siteConfig} = useDocusaurusContext();
  const {supabaseUrl, supabaseAnonKey} = siteConfig.customFields || {};
  const [interviewCategories, setInterviewCategories] = useState(fallbackInterviewCategories);
  const [remoteStatus, setRemoteStatus] = useState('idle');
  const [keyword, setKeyword] = useState('');
  const [chainType, setChainType] = useState('A');
  const [openAnswers, setOpenAnswers] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function loadRemote() {
      if (!supabaseUrl || !supabaseAnonKey) return;
      setRemoteStatus('loading');
      try {
        const remote = await loadInterviewDrillFromSupabase({
          url: String(supabaseUrl),
          anonKey: String(supabaseAnonKey),
        });
        if (!cancelled && remote.length > 0) {
          setInterviewCategories(remote);
        }
        if (!cancelled) setRemoteStatus('ready');
      } catch (err) {
        if (!cancelled) {
          setRemoteStatus('error');
          // Fallback to local data silently; this hint helps debugging in browser console.
          // eslint-disable-next-line no-console
          console.warn('Supabase interview data load failed, fallback to local data.', err);
        }
      }
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
  }, [keyword]);

  const totalCount = filteredCategories.reduce(
    (acc, category) => acc + category.questions.length,
    0
  );
  const answerRefUsage = useMemo(
    () => collectAnswerRefUsage(interviewCategories),
    [interviewCategories]
  );

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
            </div>
          </div>
          <div className={styles.resultMeta}>当前命中 {totalCount} 道题</div>
          {remoteStatus === 'loading' && (
            <div className={styles.sourceHint}>数据源：正在从 Supabase 同步题库...</div>
          )}
          {remoteStatus === 'ready' && (
            <div className={styles.sourceHint}>数据源：Supabase</div>
          )}
          {remoteStatus === 'error' && (
            <div className={styles.sourceHint}>
              数据源：本地回退（Supabase 读取失败，请检查环境变量与表结构）
            </div>
          )}
          {remoteStatus === 'idle' && (
            <div className={styles.sourceHint}>
              数据源：本地（未检测到 Supabase 配置）
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
                <h2>{category.label}</h2>
                {category.questions.map((q) => (
                  <div key={q.id} id={q.id} className={styles.questionCard}>
                    <h3>{q.title}</h3>
                    <div className={styles.aliases}>
                      {(q.aliases || []).map((alias) => (
                        <span key={alias} className={styles.aliasTag}>{alias}</span>
                      ))}
                    </div>
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
                    </div>

                    <ChainList
                      chain={chainType === 'A' ? q.chainA : q.chainB}
                      question={q}
                      questionId={q.id}
                      chainType={chainType}
                      answerRefUsage={answerRefUsage}
                      openAnswers={openAnswers[q.id] || {}}
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
