# Obsidian Wikilinks 双向链接支持指南

## 📌 现状

Docusaurus 原生**不支持** Obsidian 的 Wikilinks 语法 `[[note]]`，但有多种解决方案。

## 🔧 推荐方案

### **方案 1：在 Obsidian 中转换为标准 Markdown 链接** ⭐⭐⭐ (推荐)

**工具**: Wikilinks to MDLinks 插件

**步骤**:
1. 在 Obsidian 中安装 "Wikilinks to MDLinks" 插件
2. 写作时使用 Wikilinks: `[[文件名]]` 或 `[[文件名|显示文本]]`
3. 发布前，选中文本 → 运行命令 "Convert wikilinks to markdown links"
4. 自动转换为: `[显示文本](./path/to/file.md)`

**优点**:
- ✅ 简单直接
- ✅ 无需额外依赖
- ✅ 完全兼容 Docusaurus
- ✅ 保留 Obsidian 写作体验

**缺点**:
- ❌ 需要手动转换
- ❌ 无法保留反向链接功能

---

### **方案 2：使用 Obsidiosaurus 导出工具** ⭐⭐

**工具**: Obsidiosaurus (GitHub: CIMSTA/obsidiosaurus)

**功能**:
- 自动转换 Wikilinks
- 处理 Obsidian callouts
- 批量导出整个 vault

**使用**:
```bash
# 安装
npm install -g obsidiosaurus

# 转换
obsidiosaurus --vault /path/to/vault --output ./docs
```

**优点**:
- ✅ 自动化处理
- ✅ 批量转换
- ✅ 保留文件结构

**缺点**:
- ❌ 需要额外工具
- ❌ 可能有兼容性问题

---

### **方案 3：使用 O2 插件** ⭐⭐

**工具**: O2 Obsidian 插件

**功能**:
- 支持多平台导出（Jekyll、Docusaurus）
- 自动转换 Wikilinks
- 保持平台兼容性

**优点**:
- ✅ 一体化解决方案
- ✅ 支持多平台
- ✅ 自动化

**缺点**:
- ❌ 插件可能不稳定
- ❌ 需要配置

---

## 💡 Wikilinks 语法参考

### 基本语法

```markdown
# 简单链接
[[文件名]]

# 带显示文本的链接
[[文件名|显示文本]]

# 链接到特定标题
[[文件名#标题]]

# 链接到块引用
[[文件名#^block-id]]
```

### 转换后的 Markdown 格式

```markdown
# 简单链接
[文件名](./path/to/file.md)

# 带显示文本的链接
[显示文本](./path/to/file.md)

# 链接到特定标题
[文件名](./path/to/file.md#标题)

# 块引用（Docusaurus 不支持，需要移除）
# 改为链接到文件或标题
```

---

## ⚠️ 限制与注意事项

### Docusaurus 不支持的特性

| 特性 | Obsidian | Docusaurus |
|------|----------|-----------|
| Wikilinks 语法 | ✅ | ❌ |
| 反向链接面板 | ✅ | ❌ |
| 知识图谱 | ✅ | ❌ |
| 块引用链接 | ✅ | ❌ |
| 自动反向链接 | ✅ | ❌ |

### 最佳实践

1. **文件命名**
   - 使用英文或中文，避免特殊字符
   - 保持路径相对正确
   - 区分大小写

2. **链接路径**
   ```markdown
   # ✅ 正确
   [[../other-file]]
   [[./same-folder-file]]
   
   # ❌ 避免
   [[绝对路径]]
   [[不存在的文件]]
   ```

3. **发布前检查**
   - 运行 `npm run build` 检查链接
   - 查看是否有 "Broken links" 警告
   - 修复所有损坏的链接

---

## 🚀 实施步骤

### 快速开始（推荐方案 1）

1. **在 Obsidian 中安装插件**
   - 打开 Obsidian 设置 → Community plugins
   - 搜索 "Wikilinks to MDLinks"
   - 安装并启用

2. **写作时使用 Wikilinks**
   ```markdown
   这是一个 [[链接到其他文件]] 的例子。
   或者 [[文件名|自定义显示文本]]。
   ```

3. **发布前转换**
   - 选中需要转换的文本
   - 打开命令面板 (Cmd/Ctrl + P)
   - 运行 "Wikilinks to MDLinks: Convert wikilinks to markdown links"

4. **验证构建**
   ```bash
   npm run build
   ```

---

## 📚 相关资源

- [Obsidian 官方文档 - 内部链接](https://help.obsidian.md/Linking+notes+and+files/Internal+links)
- [Docusaurus 文档 - 链接](https://docusaurus.io/docs/markdown-features/links)
- [Wikilinks to MDLinks 插件](https://github.com/agathauy/wikilinks-to-mdlinks-obsidian)
- [Obsidiosaurus 项目](https://github.com/CIMSTA/obsidiosaurus)

---

## ❓ 常见问题

### Q: 能否在 Docusaurus 中直接使用 Wikilinks？
**A**: 不能。Docusaurus 不支持 Wikilinks 语法，需要转换为标准 Markdown 链接。

### Q: 转换后会丢失反向链接吗？
**A**: 是的。Docusaurus 不支持 Obsidian 的反向链接功能，但链接本身会保留。

### Q: 如何保留 Obsidian 的知识图谱功能？
**A**: 无法直接保留。可以考虑使用其他工具（如 Obsidian Publish）或自定义 Docusaurus 插件。

### Q: 块引用链接怎么处理？
**A**: Docusaurus 不支持块引用，建议改为链接到文件或标题。

---

## 🔄 工作流程建议

```
Obsidian 写作
    ↓
使用 Wikilinks [[note]]
    ↓
发布前转换为 Markdown 链接
    ↓
运行 npm run build 验证
    ↓
提交到 Git
    ↓
部署到 Docusaurus
```

---

**最后更新**: 2026-03-17
