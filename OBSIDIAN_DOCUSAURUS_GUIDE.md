# Obsidian → Docusaurus 完整兼容适配规范

**版本**: v1.0  
**最后更新**: 2026-03-17  
**适用**: Obsidian + Docusaurus 3.9.2

---

## 📋 目录

1. [快速开始](#快速开始)
2. [自动化工作流](#自动化工作流)
3. [语法兼容性](#语法兼容性)
4. [文件组织](#文件组织)
5. [最佳实践](#最佳实践)
6. [常见问题](#常见问题)
7. [故障排查](#故障排查)

---

## 🚀 快速开始

### 环境要求

- Obsidian 1.0+
- Docusaurus 3.9.2+
- Node.js 18+
- Git (已配置 husky hooks)

### 一分钟上手

```bash
# 1. 在 Obsidian 中写作（使用 Wikilinks）
# 2. git commit 时自动转换
# 3. npm run build 验证
# 4. git push 部署
```

---

## 🔄 自动化工作流

### 工作流程图

```
┌─────────────────────────────────────────────────────────┐
│ 1. Obsidian 写作                                        │
│    - 使用 Wikilinks: [[文件名]]                         │
│    - 使用 Callouts: > [!NOTE]                           │
│    - 支持所有 Markdown 语法                             │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Git Commit (自动触发 pre-commit hook)               │
│    - 自动转换 Wikilinks → Markdown 链接                │
│    - 自动转换 Callouts → Admonitions                   │
│    - 自动修复 MDX 兼容性问题                            │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 3. 本地验证                                             │
│    $ npm run build                                      │
│    - 检查链接完整性                                     │
│    - 验证 MDX 语法                                      │
│    - 生成静态文件                                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Git Push & Deploy                                    │
│    $ git push origin main                               │
│    - 自动部署到 Docusaurus                              │
│    - 发布到生产环境                                     │
└─────────────────────────────────────────────────────────┘
```

### 自动转换规则

| Obsidian 语法 | 自动转换为 | 说明 |
|---|---|---|
| `[[文件名]]` | `[文件名](./文件名.md)` | 简单链接 |
| `[[文件名\|显示文本]]` | `[显示文本](./文件名.md)` | 自定义显示文本 |
| `[[文件名#标题]]` | `[文件名](./文件名.md#标题)` | 链接到标题 |
| `> [!NOTE]` | `:::note` | Admonition 转换 |
| `> [!WARNING]` | `:::warning` | 警告框 |
| `{value, done}` | `` `{value, done}` `` | MDX 花括号转义 |

---

## 📝 语法兼容性

### ✅ 完全支持

#### 1. 基础 Markdown

```markdown
# 标题 1
## 标题 2
### 标题 3

**粗体** 和 *斜体*

- 列表项 1
- 列表项 2
  - 嵌套项

1. 有序列表
2. 第二项

> 引用文本
```

#### 2. 代码块

```markdown
\`\`\`javascript
const hello = () => {
  console.log('Hello, World!');
};
\`\`\`

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`
```

#### 3. 表格

```markdown
| 列 1 | 列 2 | 列 3 |
|------|------|------|
| 数据 1 | 数据 2 | 数据 3 |
| 数据 4 | 数据 5 | 数据 6 |
```

#### 4. 链接

```markdown
# ✅ 标准 Markdown 链接
[显示文本](./path/to/file.md)
[外部链接](https://example.com)

# ✅ 自动转换的 Wikilinks
[[文件名]]
[[文件名|显示文本]]
```

#### 5. 图片

```markdown
![alt 文本](./images/image.png)
![alt 文本](https://example.com/image.png)
```

#### 6. Admonitions (提示框)

```markdown
:::note
这是一个注意框
:::

:::warning
这是一个警告框
:::

:::danger
这是一个危险框
:::

:::info
这是一个信息框
:::

:::tip
这是一个提示框
:::
```

### ⚠️ 需要转换

#### 1. Wikilinks (自动转换)

```markdown
# ❌ Obsidian 特有语法
[[文件名]]
[[文件名|显示文本]]

# ✅ 自动转换为
[文件名](./文件名.md)
[显示文本](./文件名.md)
```

#### 2. Obsidian Callouts (自动转换)

```markdown
# ❌ Obsidian 语法
> [!NOTE]
> 这是一个注意

> [!WARNING]
> 这是一个警告

# ✅ 自动转换为
:::note
这是一个注意
:::

:::warning
这是一个警告
:::
```

#### 3. MDX 花括号 (自动转义)

```markdown
# ❌ 会被解析为 JSX
{value, done}
{key: value}

# ✅ 自动转义为
\`{value, done}\`
\`{key: value}\`
```

### ❌ 不支持 (需要移除或替换)

| 特性 | 原因 | 替代方案 |
|------|------|---------|
| 块引用链接 `[[file#^block]]` | Docusaurus 不支持块引用 | 改为链接到文件或标题 |
| 反向链接面板 | Docusaurus 无此功能 | 使用导航菜单替代 |
| 知识图谱 | Docusaurus 无此功能 | 使用 Docusaurus 插件扩展 |
| 嵌入文件 `![[file]]` | Docusaurus 不支持 | 改为链接或复制内容 |
| 标签 `#tag` | Docusaurus 无原生支持 | 使用分类或标签插件 |

---

## 📁 文件组织

### 推荐目录结构

```
docs/
├── intro.md                          # 首页
├── JavaScript面试突破/
│   ├── ch01-JavaScript变量/
│   │   ├── 0-JavaScript变量引言.md
│   │   ├── 1-var let const的差异.md
│   │   └── images/
│   │       └── diagram.png
│   └── ch02-JavaScript数据类型/
├── React前端核心突破/
│   ├── ch01-认识React/
│   └── ch02-JSX/
└── 资深全栈架构师核心突破/
    ├── 架构因果链/
    └── 资深全栈面试/
        └── 3-全部考点/
            └── attchements/
```

### 文件命名规范

```markdown
# ✅ 推荐
- 使用中文或英文
- 使用连字符分隔: my-file.md
- 避免特殊字符: !@#$%^&*()
- 避免空格: 改用连字符或下划线

# ❌ 避免
- 文件名中有空格
- 文件名中有特殊字符
- 过长的文件名 (>50 字符)
```

### 图片管理

```markdown
# 推荐做法
docs/
├── chapter/
│   ├── section.md
│   └── images/
│       ├── diagram-1.png
│       └── diagram-2.png

# 在 Markdown 中引用
![描述](./images/diagram-1.png)
```

---

## 🎯 最佳实践

### 1. 写作规范

#### 标题使用

```markdown
# ✅ 正确
# 一级标题 (每个文件只有一个)
## 二级标题
### 三级标题

# ❌ 避免
## 从二级标题开始
#### 跳过标题级别
```

#### 链接使用

```markdown
# ✅ 正确
[链接文本](./path/to/file.md)
[链接文本](https://example.com)
[[文件名]]  # 会自动转换

# ❌ 避免
[链接](./path/to/file)  # 缺少 .md 扩展名
[[不存在的文件]]  # 会导致链接断裂
[](./path)  # 空链接文本
```

#### 代码块使用

```markdown
# ✅ 正确
\`\`\`javascript
const x = 1;
\`\`\`

# ❌ 避免
\`\`\`
const x = 1;
\`\`\`

\`const x = 1;\`  # 应该用代码块
```

### 2. 发布前检查清单

```bash
# 1. 检查链接完整性
npm run build

# 2. 查看是否有 "Broken links" 警告
# 3. 修复所有损坏的链接

# 4. 本地预览
npm run serve

# 5. 检查样式和排版
# 6. 验证所有图片都能正常显示

# 7. 提交代码
git add .
git commit -m "docs: 添加新文档"

# 8. 推送到远程
git push origin main
```

### 3. 性能优化

#### 图片优化

```markdown
# ✅ 推荐
- 使用 WebP 格式
- 压缩图片大小 (<500KB)
- 使用描述性的 alt 文本

# ❌ 避免
- 使用未压缩的大图片
- 没有 alt 文本
- 过多的图片导致页面加载慢
```

#### 文件大小

```markdown
# ✅ 推荐
- 单个文件 <100KB
- 分章节组织内容
- 使用目录导航

# ❌ 避免
- 单个文件 >500KB
- 所有内容在一个文件中
- 过深的目录嵌套 (>5 层)
```

---

## ❓ 常见问题

### Q1: 为什么我的 Wikilinks 没有被转换？

**A**: 检查以下几点：
1. 确保已安装 husky: `npm list husky`
2. 确保 `.husky/pre-commit` 文件存在且可执行
3. 尝试手动运行: `bash .husky/pre-commit`
4. 检查文件权限: `chmod +x .husky/pre-commit`

### Q2: 链接转换后为什么还是断裂？

**A**: 常见原因：
1. 文件名不匹配（区分大小写）
2. 文件路径不正确
3. 文件不存在
4. 使用了块引用链接 `[[file#^block]]`

**解决方案**:
```bash
# 运行构建检查
npm run build

# 查看 "Broken links" 警告
# 修复所有提示的链接
```

### Q3: 如何处理 Obsidian 特有的语法？

**A**: 
- **块引用**: 改为链接到文件或标题
- **标签**: 使用分类或手动标签系统
- **嵌入**: 改为链接或复制内容
- **反向链接**: 使用导航菜单替代

### Q4: 可以在 Docusaurus 中使用 Wikilinks 吗？

**A**: 不能直接使用，但：
1. 在 Obsidian 中写作时可以使用
2. 提交代码时自动转换
3. 发布到 Docusaurus 时已是标准格式

### Q5: 如何禁用自动转换？

**A**: 
```bash
# 临时禁用
git commit --no-verify

# 永久禁用
rm .husky/pre-commit
```

---

## 🔧 故障排查

### 问题 1: 构建失败 - MDX 错误

```
Error: Unexpected token `{`
```

**原因**: 花括号被解析为 JSX 表达式

**解决方案**:
```markdown
# ❌ 错误
{value, done}

# ✅ 正确
`{value, done}`
```

### 问题 2: 链接断裂

```
[ERROR] Broken link: ./path/to/file.md
```

**原因**: 文件不存在或路径错误

**解决方案**:
```bash
# 1. 检查文件是否存在
ls docs/path/to/file.md

# 2. 检查路径是否正确
# 3. 检查文件名大小写
# 4. 检查是否有 .md 扩展名
```

### 问题 3: 自动转换不工作

```
🔄 Converting Wikilinks to Markdown links...
❌ Conversion failed
```

**原因**: husky 未正确安装或配置

**解决方案**:
```bash
# 重新安装 husky
npm install husky --save-dev
npx husky install

# 重新创建 pre-commit hook
chmod +x .husky/pre-commit

# 测试 hook
bash .husky/pre-commit
```

### 问题 4: 图片不显示

```
Image not found: ./images/diagram.png
```

**原因**: 图片路径错误或文件不存在

**解决方案**:
```bash
# 1. 检查图片文件是否存在
ls docs/chapter/images/diagram.png

# 2. 检查路径是否正确
# 3. 检查文件名大小写
# 4. 检查是否在 .gitignore 中
```

---

## 📚 相关资源

### 官方文档
- [Obsidian 官方文档](https://help.obsidian.md/)
- [Docusaurus 官方文档](https://docusaurus.io/)
- [Markdown 规范](https://commonmark.org/)

### 本项目文档
- [MDX 兼容性解决方案](./MDX_COMPATIBILITY_SOLUTIONS.md)
- [Obsidian 写作规范](./OBSIDIAN_WRITING_GUIDE.md)
- [Wikilinks 支持指南](./WIKILINKS_SUPPORT.md)

### 工具
- [Husky - Git Hooks](https://typicode.github.io/husky/)
- [Obsidiosaurus - 转换工具](https://github.com/CIMSTA/obsidiosaurus)
- [Wikilinks to MDLinks - Obsidian 插件](https://github.com/agathauy/wikilinks-to-mdlinks-obsidian)

---

## 🔄 版本历史

### v1.0 (2026-03-17)
- ✅ 初始版本
- ✅ 完整的兼容性规范
- ✅ 自动化工作流
- ✅ 最佳实践指南

---

## 📞 支持

遇到问题？

1. 查看 [常见问题](#常见问题) 部分
2. 查看 [故障排查](#故障排查) 部分
3. 检查 [相关资源](#相关资源) 中的官方文档
4. 提交 Issue 到 GitHub

---

**祝你写作愉快！** 🎉
