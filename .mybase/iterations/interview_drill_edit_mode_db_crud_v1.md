# Interview Drill Edit Mode DB CRUD v1

## Goal
新增编辑模式：默认阅览，切换编辑后支持问题与追问链手动 CRUD，并可保存到 Supabase 数据库。

## Delivered
- 页面模式切换：阅览模式 / 编辑模式
- 编辑能力：
  - 问题 CRUD（标题、Q1、A0、A0深层、别名、讨论备注）
  - 追问链节点 CRUD（追问、口语答案、深层答案、讨论备注、子追问）
- 保存能力：
  - 本地草稿（localStorage）
  - 保存到数据库（Supabase）
- 数据写入策略 SQL：
  - `supabase/migrations/20260408194500_interview_drill_write_policies.sql`

## Code
- `src/pages/interview-drill/index.js`
- `src/pages/interview-drill/index.module.css`
- `src/lib/interviewDrillRepository.js`
- `docs/面试实战记录/interview-review/高频面试题/架构说明/Supabase题库接入说明.md`

## Validation
- `node --check src/pages/interview-drill/index.js` PASS
- `node --check src/lib/interviewDrillRepository.js` PASS
- `npm run test:interview-drill` PASS
- `npm run test:interview-drill:supabase` PASS

## Note
- 保存到数据库依赖写入策略 SQL 已执行。
- 当前写库为“覆盖式同步当前草稿链路”。
