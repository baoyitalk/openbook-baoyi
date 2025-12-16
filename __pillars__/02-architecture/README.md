# 架构支柱 - 技术架构

> **职责**: Docusaurus 配置、主题定制、技术方案、架构决策  
> **更新时间**: 2025-12-16

---

## 📋 支柱职责

### 核心职责
1. **技术配置** - Docusaurus 配置和插件管理
2. **主题定制** - 自定义主题和样式
3. **技术方案** - 技术实现方案和最佳实践
4. **架构决策** - 重要技术决策记录（ADR）

---

## 🗂️ 目录结构

```
02-architecture/
├── README.md                    ← 本文件
├── docs/                        ← 技术文档
│   ├── docusaurus-config.md     ← Docusaurus 配置说明
│   ├── theme-customization.md   ← 主题定制文档
│   ├── plugins.md               ← 插件使用说明
│   └── deployment.md            ← 部署架构
├── decisions/                   ← 架构决策记录（ADR）
│   └── ADR-001-example.md       ← ADR 示例
└── baseline/                    ← 生产基线
    └── v{X.X.X}/                ← 版本基线快照
```

---

## 📚 核心文档

### 技术文档
- **Docusaurus 配置** (`docs/docusaurus-config.md`)
  - 基础配置说明
  - 导航栏配置
  - 侧边栏配置
  - SEO 配置

- **主题定制** (`docs/theme-customization.md`)
  - 自定义主题
  - CSS 样式定制
  - 组件覆盖

- **插件说明** (`docs/plugins.md`)
  - 已安装插件列表
  - 插件配置说明
  - 自定义插件开发

- **部署架构** (`docs/deployment.md`)
  - 构建流程
  - 部署方案
  - CDN 配置

### 架构决策记录（ADR）
- **决策记录** (`decisions/`)
  - 重要技术决策
  - 决策背景和原因
  - 影响和后果

---

## 🏗️ 技术栈

### 核心技术
- **React** - UI 框架
- **Docusaurus** - 静态站点生成器
- **Markdown** - 内容编写格式
- **MDX** - 支持 JSX 的 Markdown

### 开发工具
- **Node.js** - 运行环境
- **npm/yarn** - 包管理器
- **Git** - 版本控制

---

## 📐 架构决策记录（ADR）规范

### ADR 标准格式

```markdown
# ADR-{编号}-{标题}

## 状态
[提议 / 接受 / 废弃 / 被替代]

## 背景
为什么需要做这个决策？

## 决策
我们决定做什么？

## 后果
### 优点
- ...

### 缺点
- ...

### 风险
- ...

## 替代方案
我们考虑过哪些其他方案？为什么不选择它们？

---
**决策日期**: YYYY-MM-DD  
**决策人**: XXX  
**影响范围**: XXX
```

### 何时创建 ADR
- 选择技术方案时
- 修改核心架构时
- 引入新的依赖时
- 改变开发流程时

---

## 📝 最佳实践

### DO ✅
1. ✅ 保持配置简洁，避免过度定制
2. ✅ 使用官方推荐的插件和主题
3. ✅ 重要决策必须创建 ADR
4. ✅ 定期更新依赖版本
5. ✅ 遵循 Docusaurus 最佳实践

### DON'T ❌
1. ❌ 不要过度定制，增加维护成本
2. ❌ 不要使用未经验证的第三方插件
3. ❌ 不要忽视性能优化
4. ❌ 不要跳过 ADR 记录重要决策
5. ❌ 不要长期不更新依赖

---

## 🔗 相关文档

- [Docusaurus 官方文档](https://docusaurus.io/)
- [产品支柱](../01-product/README.md) - 内容规划
- [运维支柱](../04-operations/README.md) - 部署运维
- [迭代支柱](../05-iteration/README.md) - 版本管理
