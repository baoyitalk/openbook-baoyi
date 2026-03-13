# 项目规则

## 技术约束
- Next.js App Router（不用 Pages Router）
- 纯 JS，不用 TypeScript
- pnpm 管理依赖
- 中文注释
- 端口 3002

## 代码规范
- Server Component 默认，需要交互才加 'use client'
- fetch 缓存策略必须显式声明（revalidate / no-store）
- 每个组件文件顶部写面试考点注释
- mock 数据带模拟延迟，体现真实场景

## 文件组织
- `app/` — 页面路由
- `app/api/` — API Route Handlers
- `components/` — 共享组件
- `lib/` — 工具函数和 mock 数据
