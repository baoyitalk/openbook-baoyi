# Supabase题库接入说明（v2）

## 1. 为什么要接 Supabase
- 题库会越来越大，纯前端文件维护成本高。
- 追问链是树结构，数据库更适合管理和增量编辑。
- 答案会被多次复用，需要答案中心化管理。

## 2. 已落地能力
- 页面 `/interview-drill` 支持优先读取 Supabase。
- 如果 Supabase 未配置或读取失败，会自动回退本地题库。
- 支持答案引用（`answer_id`）和引用频次统计视图。

## 3. 建表 + 种子 SQL
- 文件：`supabase/migrations/20260408141000_interview_drill_v2.sql`
- 文件：`supabase/migrations/20260408142000_interview_drill_v2_seed.sql`
- 文件：`supabase/migrations/20260408193000_interview_drill_v2_seed_refresh.sql`（题库扩容刷新）
- 文件：`supabase/migrations/20260408194500_interview_drill_write_policies.sql`（编辑模式写库策略）
- 两个 SQL 都要执行：先建表，再导入种子数据。

## 4. 环境变量
在本地启动前配置：

```bash
SUPABASE_URL=你的项目URL
SUPABASE_ANON_KEY=你的anon key
```

## 5. 数据表结构（v2）
- `interview_categories`：分类（S/A/B 热度 + 排序）
- `interview_answers`：答案库（口语版 + 深层版，可复用）
- `interview_questions`：问题主干（Q1 + A0答案引用 + aliases）
- `interview_chain_nodes`：追问节点（递归 + 答案引用 + 深度 + 收口原因）

## 6. 链路约定
- `chain_type='A'`：回答触发链
- `chain_type='B'`：面试官主导链
- `parent_id is null`：一级追问
- `parent_id not null`：二级及更深追问
- `depth`：追问层级（1-4）
- `close_reason`：`NONE` / `EARLY_CLOSE` / `FORCED_CLOSE_AT_DEPTH_4`

## 7. 当前读取逻辑
1. 读取分类、答案、问题、追问节点。
2. 问题用 `a0_answer_id` 关联答案库。
3. 节点用 `answer_id` 关联答案库。
4. 按 `sort_order` 排序并组装递归树。
5. 页面展示“口语版 + 深层版（默认折叠）”。

## 8. 当前线上数据规模（2026-04-08）
- categories=6
- answers=868
- questions=79
- nodes=793
- checkedChains=158

## 9. 编辑模式落库说明
- 页面支持 `阅览模式` 和 `编辑模式`。
- 编辑模式可对问题与追问链做手动 CRUD，并写入讨论备注。
- 点击“保存到数据库”会同步当前草稿到 Supabase（覆盖式重建当前题库链路）。
