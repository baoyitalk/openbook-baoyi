# Interview Drill Python50 Upgrade v1

## Scope
- 将 `Python 爬虫高频` 从 20 题扩展到 50 题。
- 全部按统一费曼四段输出：学习理解 / 讲授大白话 / 漏洞卡点 / 压缩总结。
- 页面题库、Markdown 文档、Supabase seed 同步升级。

## Delivery
- 题库分类：`python-crawler`
- 题量：20 -> 50
- 全站总量：49 -> 79（categories=6）
- 文件：
  - `src/data/interviewDrillData.js`
  - `docs/面试实战记录/interview-review/高频面试题/分类版/06-Python爬虫费曼4段.md`
  - `supabase/seeds/20260408_interview_drill_v2_seed.sql`
  - `supabase/migrations/20260408142000_interview_drill_v2_seed.sql`
  - `supabase/migrations/20260408193000_interview_drill_v2_seed_refresh.sql`

## Validation
- `npm run test:interview-drill` PASS
  - categories=6, questions=79, nodes=793
- `npm run test:interview-drill:supabase` PASS（远端当前仍是旧数据集）

## Note
- 远端 Supabase 当前仍显示旧种子（5分类/29题）。
- 执行 `20260408193000_interview_drill_v2_seed_refresh.sql` 后可升级到新数据集。
