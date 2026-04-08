# Interview Drill Test Cases v1

## 1. Test Scope
- interview drill page (`/interview-drill`)
- local data rules (A/B chain, recursive follow-ups, min/max constraints)
- Supabase v2 wiring (repository + migration SQL + fallback logic)

## 2. Test Commands
```bash
npm run test:interview-drill
npm run test:interview-drill:supabase
npm run build
node --check src/pages/interview-drill/index.js
node --check src/lib/interviewDrillRepository.js
node --check src/data/interviewDrillData.js
node --check scripts/test_interview_drill_supabase.cjs
```

## 3. Automated Test Case Matrix
| ID | Type | Case | Expected | Result |
|---|---|---|---|---|
| TC-AUTO-001 | Data | Categories exist | category 数量 > 0 | PASS |
| TC-AUTO-002 | Data | Question base fields | 每题包含 `title/q1/a0` | PASS |
| TC-AUTO-003 | Rule | Chain min count | 每条链追问总数 >= 5 | PASS |
| TC-AUTO-004 | Rule | Chain max count | 每条链追问总数 <= 16 | PASS |
| TC-AUTO-005 | Rule | Depth max | 递归深度 <= 4 | PASS |
| TC-AUTO-006 | Rule | Branch children max | 任意节点子追问数 <= 3 | PASS |
| TC-AUTO-007 | Data | Node fields | 每个追问节点包含 `q/a` | PASS |
| TC-AUTO-008 | UI Static | A/B chain switch token | 页面含 A链/B链切换能力 | PASS |
| TC-AUTO-009 | UI Static | Recursive render token | 页面含 `ChainNode` 递归渲染 | PASS |
| TC-AUTO-010 | UI Static | Source hint token | 页面含数据源状态提示 | PASS |
| TC-AUTO-011 | Supabase | Repository table wiring | 仓储读取 v2 4张表（含 answers） | PASS |
| TC-AUTO-012 | Supabase | Migration schema | SQL 含建表 + RLS + policy | PASS |
| TC-AUTO-013 | Syntax | Page syntax check | `index.js` 可解析 | PASS |
| TC-AUTO-014 | Syntax | Repository syntax check | `interviewDrillRepository.js` 可解析 | PASS |
| TC-AUTO-015 | Syntax | Data syntax check | `interviewDrillData.js` 可解析 | PASS |
| TC-RULE-016 | Rule | Force close at depth 4 | 到第4层后必须收口，不允许生成第5层 | TODO |
| TC-RULE-017 | Rule | Early close for non-technical | 非技术问题可提前收口并标记 `EARLY_CLOSE` | TODO |
| TC-ONLINE-001 | Supabase Online | Remote table availability | v2 4 张核心表可查询 | PASS（已可查询） |
| TC-ONLINE-002 | Supabase Online | Remote rule validation | 远端链路满足 5-16/深度/分支规则 | PASS（rule violations=0） |

## 4. Execution Result
- Command: `npm run test:interview-drill`
- Output summary: `pass=5, fail=0`
- Additional syntax checks: all passed
- Command: `npm run test:interview-drill:supabase`
- Output: `categories=6, answers=868, questions=79, nodes=793, rule violations=0`
- Conclusion: 在线联调通过，远端题库数据与链路规则校验通过
- Command: `npm run build`
- Output: FAIL（历史文档 MDX/图片问题，不是 interview-drill 本次改动导致）
- Build blockers:
  - `docs/attchements/zs1016-React组件按职责与规范.md`（MDX expression parse error）
  - `docs/面试实战记录/timeline/20260323/字节.md`（broken markdown image path）
  - 若干历史文档图片类型/路径告警

## 5. Risks / Pending
- Full site build 仍受历史 docs/MDX 问题影响，不属于 interview drill 本次改动范围。
- Browser-level interaction E2E（真实点击/折叠/切链）建议后续加 Playwright 用例。
- Supabase 在线验证：已通过（2026-04-08）
- 新增语义规则尚未编码落地：
  - `EARLY_CLOSE` 在题库内容层面的使用策略（当前仅完成 DB 层字段与约束）

## 6. Conclusion
Current iteration passes development-level automated checks for:
- rule constraints
- recursive chain structure
- Supabase integration wiring
- fallback readiness
