# Obsidian → Docusaurus 写作规范

## 🎯 核心原则

**Docusaurus 使用 MDX v3，会将花括号 `{}` 解析为 JSX 表达式。**

## ⚠️ 常见问题与解决方案

### 1. 花括号问题

#### ❌ 错误写法
```markdown
返回值格式：{value: 1, done: false}
对象结构：{name, age}
```

#### ✅ 正确写法

**方案 A：使用反引号（推荐）**
```markdown
返回值格式：`{value: 1, done: false}`
对象结构：`{name, age}`
```

**方案 B：使用代码块**
```markdown
返回值格式：
\`\`\`
{value: 1, done: false}
\`\`\`
```

**方案 C：转义（不推荐，影响可读性）**
```markdown
返回值格式：\{value: 1, done: false\}
```

### 2. 表格中的花括号

#### ❌ 错误写法
```markdown
| 特性 | 说明 |
|------|------|
| 返回值 | {value, done} |
```

#### ✅ 正确写法
```markdown
| 特性 | 说明 |
|------|------|
| 返回值 | `{value, done}` |
```

### 3. 链接问题

#### ❌ 错误写法
```markdown
[文件名.md^6.](../../文件名.md^6..md)  <!-- Obsidian 块引用 -->
```

#### ✅ 正确写法
```markdown
[文件名](./文件名.md)  <!-- 标准相对路径 -->
```

### 4. 代码注释中的花括号

#### ✅ 代码块内可以随意使用
```markdown
\`\`\`js
const obj = {value: 1, done: false};  // ✅ 代码块内没问题
console.log(obj);
\`\`\`
```

## 📋 写作检查清单

在发布前检查：

- [ ] 所有正文中的花括号都用反引号包裹
- [ ] 表格中的花括号都用反引号包裹
- [ ] 链接使用标准 Markdown 格式（避免 Obsidian 特有语法）
- [ ] 代码示例都在代码块内
- [ ] 没有使用 Obsidian 块引用（`^` 语法）

## 🛠️ 自动化工具

### 构建前检查
```bash
# 运行兼容性检查
chmod +x scripts/fix-mdx-compatibility.sh
./scripts/fix-mdx-compatibility.sh
```

### 快速测试
```bash
# 本地构建测试
npm run build

# 如果失败，查看错误信息中的文件和行号
```

## 💡 最佳实践

### 1. 技术术语统一用反引号
```markdown
✅ 使用 `useState` 钩子
✅ 返回 `Promise` 对象
✅ 调用 `next()` 方法
```

### 2. 对象/数据结构用代码块
```markdown
返回值结构：
\`\`\`js
{
  value: 1,
  done: false
}
\`\`\`
```

### 3. 避免复杂的内联表达式
```markdown
❌ 函数返回 {value: getValue(), done: checkDone()}
✅ 函数返回一个包含 value 和 done 属性的对象
```

## 🔄 迁移现有文档

如果已有大量文档需要修复：

1. **备份**
   ```bash
   cp -r docs docs-backup-$(date +%Y%m%d)
   ```

2. **批量查找问题**
   ```bash
   grep -r "{.*}" docs --include="*.md" | grep -v "\`"
   ```

3. **逐个修复或使用脚本**

## 📚 参考资源

- [MDX 官方文档](https://mdxjs.com/docs/troubleshooting-mdx/)
- [Docusaurus MDX 指南](https://docusaurus.io/docs/markdown-features)
- [常见错误解决](https://github.com/facebook/docusaurus/issues/9538)

## 🎨 推荐的 Obsidian 插件

- **Linter** - 自动格式化 Markdown
- **Markdown Prettifier** - 美化代码块
- **Obsidian Git** - 版本控制

## 📝 模板示例

创建 Obsidian 模板，自动使用正确格式：

```markdown
---
tags:
  - 技术文章
---

# 标题

## 代码示例

\`\`\`js
// 代码内容
\`\`\`

## 概念说明

使用 `反引号` 包裹技术术语和对象结构。

## 表格

| 特性 | 说明 |
|------|------|
| 属性 | `{key: value}` |
```

---

**记住：在 Obsidian 中写作时，把所有花括号当作"特殊字符"处理！**
