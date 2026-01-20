# v1.0.2 修复记录

## 2026-01-20

### FIX-002: MCP 服务进程管理与故障恢复

**问题描述**: xianyu-memory MCP 服务器出现 "Not connected" 错误，无法正常连接

**根因分析**:
1. 进程残留：手动测试时启动的进程被挂起（suspended - tty input）但没有被完全杀掉
2. 锁文件冲突：PID 文件 `~/.xianyu-memory-mcp.pid` 中记录的进程仍然存在
3. UI 误导：正常状态的 stderr 日志在 Cline UI 中显示为红色

**修复步骤**:
1. 使用 `ps aux | grep xianyu-memory` 查找残留进程
2. 使用 `kill -9 <PID>` 强制杀掉残留进程
3. 清理锁文件 `rm ~/.xianyu-memory-mcp.pid`
4. 重启 MCP 服务（通过 Cline 重新加载）

**代码优化**:
- 修改文件：`xianyu-memory-server/src/index.ts`
- 移除正常状态的 stderr 日志，避免 Cline UI 显示红色误导用户
- 移除的日志：
  - `[Agent] chokidar 已就绪，开始监听文件变化`
  - `[Agent] 启动自动监听...`
  - `[Agent] 初始化2分钟计时器（冷启动保护）`
  - 文件变化检测日志

**相关文档**:
- 中央库 ADR：`baoyitalk-platform/__pillars__/02-architecture/decisions/ADR-001-MCP-SERVICE-MANAGEMENT.md`
- AI 记忆库决策 ID：`7a699628-584b-40f8-b2ef-47ab8a286dfb`

**验证结果**: ✅ MCP 服务正常连接，UI 不再显示红色误导日志

---

## 2026-01-12

### FIX-001: MDX 行内代码花括号解析错误

**关联 Bug**: BUG-001

**修复步骤**:
1. 执行 `npm run build` 发现构建失败
2. 定位错误文件：`docs/JavaScript面试突破/ch02-JavaScript数据类型/原始数据类型和引用数据类型的区别.md`
3. 分析根因：行内代码中的 `{name: "John"}` 被 MDX 解析为 JSX 表达式
4. 使用 `write_to_file` 重写文件，将行内代码改为代码块格式
5. 重新构建验证通过

**批量修复方案**（供后续参考）:
```bash
# 搜索有问题的文件
grep -rn '`[^`]*{' docs/

# 批量替换（转义花括号）
sed -i '' 's/`\([^`]*\){\([^`]*\)}\([^`]*\)`/`\1\\{\2\\}\3`/g' file.md
```

**验证结果**: ✅ 构建成功，本地服务正常运行
