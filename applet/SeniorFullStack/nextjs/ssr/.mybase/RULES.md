# 项目规则

## 技术约束
- Next.js App Router（不用 Pages Router）
- 纯 JS，不用 TypeScript
- pnpm 管理依赖
- 中文注释
- 端口 3003

## 代码规范
- Server Component 默认，需要交互/浏览器 API 才加 'use client'
- 每个组件文件顶部写面试考点注释
- mock 数据带不同延迟，体现 Streaming 效果
- Hydration Error 场景用 mounted 状态 + useEffect 解决

## 文件组织
- `app/` — 页面路由
- `app/components/` — 页面级组件（Server + Client）
- `lib/` — mock 数据和工具函数
