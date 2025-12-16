# AI 快速启动指南

> **用途**: 帮助 AI 助手在 5 分钟内恢复项目上下文  
> **更新时间**: 2025-12-16  
> **版本**: v1.0.0

---

## 🎯 项目概览

### 项目类型
- **名称**: 开源电子书
- **技术栈**: React + Docusaurus
- **项目性质**: 开源电子书项目

### 当前状态
- **版本**: v1.0.0（开发中）
- **分支**: dev-v1.0.0
- **详情**: [CURRENT_VERSION.md](./05-iteration/CURRENT_VERSION.md)

---

## 📚 必读文档（按顺序）

### 1. 当前版本状态（必读）
- [CURRENT_VERSION.md](./05-iteration/CURRENT_VERSION.md)
- 了解当前开发进度和待办事项

### 2. 版本需求文档（必读）
- [v1.0.0_REQUIREMENTS.md](./05-iteration/v1.0.0/v1.0.0_REQUIREMENTS.md)
- 了解 v1.0.0 的功能需求

### 3. 技术架构（按需）
- [架构支柱](./02-architecture/README.md)
- Docusaurus 配置和技术方案

### 4. 内容规划（按需）
- [产品支柱](./01-product/README.md)
- 电子书内容结构和规划

---

## 🔴 核心规范

### 开发规范
1. ✅ 小步迭代，不影响现有内容
2. ✅ 文档先行，代码随后
3. ✅ 保持简单、稳定、可靠

### Git 规范
1. ✅ 基于 main 创建开发分支
2. ✅ 未经允许不得合并到 main
3. ✅ 提交信息遵循规范：
   - `feat:` - 新功能
   - `fix:` - 修复
   - `docs:` - 文档更新
   - `chore:` - 构建/配置更新

### 版本管理
1. ✅ 只有明确允许才能使用 `v1.0.x` 版本号
2. ✅ 打 tag 前需要明确授权

---

## 🗂️ 项目结构

```
openbook-baoyi/
├── __pillars__/              ← 支柱体系（文档中心）
│   ├── 01-product/           ← 内容规划
│   ├── 02-architecture/      ← 技术架构
│   ├── 04-operations/        ← 部署运维
│   └── 05-iteration/         ← 版本迭代
│
├── docs/                     ← Docusaurus 文档内容
├── src/                      ← 自定义组件和页面
├── static/                   ← 静态资源
├── docusaurus.config.js      ← Docusaurus 配置
└── package.json              ← 依赖管理
```

---

## 🚀 常用命令

### 开发
```bash
npm install          # 安装依赖
npm start            # 启动开发服务器
npm run build        # 构建生产版本
npm run serve        # 预览生产构建
```

### Git 操作
```bash
# 查看当前分支
git branch

# 切换到开发分支
git checkout dev-v1.0.0

# 提交代码
git add .
git commit -m "feat: 添加新章节"
git push origin dev-v1.0.0
```

---

## 💡 AI 助手工作流程

### 1. 接到新任务
- [ ] 阅读 CURRENT_VERSION.md
- [ ] 阅读相关需求文档
- [ ] 确认当前分支

### 2. 开发过程
- [ ] 小步迭代
- [ ] 更新迭代日志
- [ ] 遵守开发规范

### 3. 完成任务
- [ ] 更新相关文档
- [ ] 清理临时文件
- [ ] 提交代码

---

## 📞 需要帮助？

如有疑问，请查阅：
- [支柱体系 README](./README.md)
- [通用五大支柱框架](../UNIVERSAL_PILLARS_FRAMEWORK.md)
