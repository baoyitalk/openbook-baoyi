# Docusaurus MDX v3 兼容性完整解决方案

## 📌 问题诊断

### 症状
- 构建失败：`ReferenceError: xxx is not defined`
- 错误信息：`Could not parse expression with acorn`
- 行号指向包含花括号的文本

### 根本原因
MDX v3 将 `{}` 解析为 JSX 表达式，而不是普通文本。

```
❌ 错误：{value: 1}  → 被解析为 JSX 变量引用
✅ 正确：`{value: 1}` → 被解析为代码文本
```

---

## 🔧 快速修复方案

### 方案 1：一键修复（推荐）

```bash
# 1. 运行兼容性检查
chmod +x scripts/fix-mdx-compatibility.sh
./scripts/fix-mdx-compatibility.sh

# 2. 查看问题文件列表
# 3. 手动修复或使用下面的批量脚本
```

### 方案 2：批量自动修复

```bash
# 备份
cp -r docs docs-backup-$(date +%Y%m%d)

# 修复所有 Markdown 文件中的花括号
find docs -name "*.md" -type f -exec sed -i '' \
  's/\([^`]\)\({[^}]*}\)\([^`]\)/\1`\2`\3/g' {} \;

# 验证
npm run build
```

### 方案 3：手动修复（最安全）

1. 查找问题文件
   ```bash
   npm run build 2>&1 | grep "line:"
   ```

2. 打开文件，找到指定行

3. 用反引号包裹花括号
   ```markdown
   ❌ 返回 {value, done}
   ✅ 返回 `{value, done}`
   ```

---

## 📋 常见场景修复

### 场景 1：对象字面量

```markdown
❌ 函数返回 {name: 'John', age: 30}
✅ 函数返回 `{name: 'John', age: 30}`
```

### 场景 2：表格中的对象

```markdown
❌ 
| 返回值 | {value, done} |

✅ 
| 返回值 | `{value, done}` |
```

### 场景 3：解构赋值

```markdown
❌ 使用 {useState, useEffect} 钩子
✅ 使用 `{useState, useEffect}` 钩子
```

### 场景 4：泛型类型

```markdown
❌ Array<{id: number}>
✅ `Array<{id: number}>`
```

### 场景 5：正则表达式

```markdown
❌ 匹配 {1,3} 次
✅ 匹配 `{1,3}` 次
```

---

## 🛡️ 预防措施

### 1. 编辑器配置

**VS Code 设置**（`.vscode/settings.json`）
```json
{
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

### 2. Pre-commit Hook

创建 `.husky/pre-commit`：
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# 检查 MDX 兼容性
npm run check:mdx || exit 1
```

添加到 `package.json`：
```json
{
  "scripts": {
    "check:mdx": "bash scripts/fix-mdx-compatibility.sh"
  }
}
```

### 3. CI/CD 集成

**GitHub Actions** (`.github/workflows/build.yml`)
```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run check:mdx
      - run: npm run build
```

---

## 📊 问题排查流程

```
构建失败
    ↓
查看错误信息中的文件和行号
    ↓
打开文件，找到指定行
    ↓
是否包含 {xxx}？
    ├─ 是 → 用反引号包裹
    ├─ 否 → 检查是否有其他 MDX 语法错误
    └─ 不确定 → 运行 grep 检查
    ↓
重新构建
    ↓
成功 ✅
```

---

## 🔍 诊断命令

### 查找所有潜在问题

```bash
# 查找代码块外的花括号
grep -rn "{" docs --include="*.md" | grep -v "^\s*\`\`\`" | grep -v "^\s*\`"

# 查找 Obsidian 特有语法
grep -rn "\^[0-9a-z]" docs --include="*.md"

# 查找未转义的特殊字符
grep -rn "[<>]" docs --include="*.md" | grep -v "^\s*\`"
```

### 验证修复

```bash
# 清理缓存并重新构建
rm -rf .docusaurus build
npm run build

# 如果成功
echo "✅ 构建成功！"

# 如果失败，查看详细错误
npm run build 2>&1 | grep -A 10 "ERROR"
```

---

## 💾 备份和恢复

### 创建备份

```bash
# 自动备份脚本
BACKUP_DIR="docs-backup-$(date +%Y%m%d-%H%M%S)"
cp -r docs "$BACKUP_DIR"
echo "备份已创建: $BACKUP_DIR"
```

### 恢复备份

```bash
# 列出所有备份
ls -d docs-backup-*

# 恢复指定备份
BACKUP_DIR="docs-backup-20260317-144500"
rm -rf docs
cp -r "$BACKUP_DIR" docs
```

---

## 🎓 学习资源

### 官方文档
- [MDX 官方文档](https://mdxjs.com/)
- [Docusaurus 3 迁移指南](https://docusaurus.io/docs/migration/v3)
- [MDX v3 发布说明](https://mdxjs.com/blog/v3/)

### 相关 Issue
- [Docusaurus Issue #9536](https://github.com/facebook/docusaurus/issues/9536)
- [Docusaurus Issue #9538](https://github.com/facebook/docusaurus/issues/9538)
- [Docusaurus Issue #4288](https://github.com/facebook/docusaurus/issues/4288)

---

## 🚀 最佳实践总结

| 做法 | 原因 |
|------|------|
| ✅ 用反引号包裹花括号 | MDX 不会解析代码文本 |
| ✅ 代码块内随意使用 | 代码块有特殊处理 |
| ✅ 使用标准 Markdown 链接 | 避免 Obsidian 特有语法 |
| ✅ 定期运行构建测试 | 及早发现问题 |
| ❌ 在正文中使用 `{}` | 会被解析为 JSX |
| ❌ 使用 Obsidian 块引用 | Docusaurus 不支持 |
| ❌ 混合使用特殊字符 | 容易产生歧义 |

---

## 📞 获取帮助

如果问题仍未解决：

1. **检查错误信息**
   - 记下文件名和行号
   - 复制完整错误信息

2. **查看相关 Issue**
   - 在 GitHub 搜索错误信息
   - 查看是否有已知解决方案

3. **创建最小复现**
   - 创建一个简单的 `.md` 文件
   - 只包含导致错误的内容
   - 用于调试和报告

4. **社区求助**
   - Docusaurus Discord
   - MDX GitHub Discussions
   - Stack Overflow

---

**最后更新：2026-03-17**
**适用版本：Docusaurus 3.x + MDX v3**
