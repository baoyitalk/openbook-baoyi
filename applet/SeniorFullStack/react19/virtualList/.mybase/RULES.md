# 项目规则

1. 所有文件使用 JSX/JS，不用 TypeScript
2. pnpm 管理依赖
3. vite 端口固定 3001（所有项目统一 3001，切换时先杀旧进程）
4. 面试导向，代码需有详细中文注释
5. 小步迭代，不搞太复杂
6. 每次修 bug 记录到 BUG_LIST.md 并写反思
7. 重启命令：




```shell

lsof -ti :3001 | xargs kill -9 2>/dev/null; pnpm dev

```
