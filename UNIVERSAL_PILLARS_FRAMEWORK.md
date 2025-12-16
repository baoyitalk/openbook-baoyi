# 通用五大支柱管理框架
## Universal Pillars Management Framework

> **用途**: 适用于所有项目的支柱体系标准框架  
> **版本**: v1.0  
> **创建时间**: 2025-12-16  
> **来源**: 基于实际项目实践提炼

---

## 📚 核心理念

### 什么是支柱体系？

支柱体系是项目的**知识库和文档中心**，通过五大支柱系统化管理所有项目文档、决策记录和开发规范。

### 核心价值

1. **知识传承** - 避免重复造轮子，积累团队智慧
2. **决策追溯** - 记录"为什么这样做"，而不只是"做了什么"
3. **团队协作** - 统一理解和规范，降低沟通成本
4. **AI 上下文** - 帮助 AI 助手快速恢复记忆，提高开发效率
5. **质量保障** - 通过红线机制强制约束，防止低级错误

### 核心原则

```
开发在迭代支柱，生产在四大支柱
历史看迭代快照，真相看四大基线
红线是底线，规范是指南
文档先行，代码随后
```

---

## 🗂️ 标准目录结构

```
__pillars__/                          ← 支柱体系根目录
│
├── 📄 核心文档（必需）
│   ├── README.md                     ← 支柱体系概述
│   ├── INDEX.md                      ← 文档索引（快速查找）
│   ├── PILLARS_SYSTEM_STANDARD.md    ← 标准规范 ⭐
│   ├── AI_QUICK_START.md             ← AI 快速启动（5分钟恢复上下文）
│   └── AI_CONTEXT_KNOWLEDGE_BASE.md  ← AI 长期记忆库 ⭐⭐⭐
│
├── 01-product/                       ← 产品支柱
│   ├── README.md                     ← 支柱说明
│   ├── docs/                         ← 产品文档
│   │   ├── requirements/             ← 需求文档
│   │   ├── specifications/           ← 功能规格
│   │   └── user-stories/             ← 用户故事
│   ├── standards/                    ← 开发规范（指导性）
│   └── baseline/                     ← 基线（生产环境真相）
│       └── v{X.X.X}/                 ← 版本基线
│
├── 02-architecture/                  ← 架构支柱
│   ├── README.md
│   ├── docs/                         ← 架构文档
│   │   ├── database/                 ← 数据库架构
│   │   ├── system/                   ← 系统架构
│   │   └── technical/                ← 技术文档
│   ├── decisions/                    ← 架构决策记录 (ADR)
│   ├── diagrams/                     ← 架构图
│   └── baseline/                     ← 基线
│
├── 03-testing/                       ← 测试支柱
│   ├── README.md
│   ├── docs/                         ← 测试文档
│   │   ├── standards/                ← 测试标准
│   │   ├── guides/                   ← 测试指南
│   │   └── strategies/               ← 测试策略
│   ├── reports/                      ← 测试报告
│   └── baseline/                     ← 基线
│
├── 04-operations/                    ← 运维支柱
│   ├── README.md
│   ├── docs/                         ← 运维文档
│   │   ├── deployment/               ← 部署文档
│   │   ├── monitoring/               ← 监控文档
│   │   └── incidents/                ← 事件报告
│   ├── redlines/                     ← 红线规范（强制约束）⭐⭐⭐
│   │   ├── README.md                 ← 红线索引
│   │   ├── DATABASE_REDLINES.md      ← 数据库红线
│   │   ├── RELEASE_REDLINES.md       ← 版本发布红线
│   │   └── AI_DEVELOPMENT_REDLINES.md ← AI 开发红线
│   ├── scripts/                      ← 运维脚本
│   └── baseline/                     ← 基线
│
└── 05-iteration/                     ← 迭代支柱 ⭐⭐⭐
    ├── README.md                     ← 迭代支柱说明
    ├── CURRENT_VERSION.md            ← 🔥 当前版本状态（AI 必读）
    │
    ├── v{X.X.X}/                     ← 版本目录（扁平化结构）
    │   ├── README.md                 ← 版本概览
    │   ├── v{X.X.X}_REQUIREMENTS.md  ← 需求文档（必需，根文档）
    │   ├── v{X.X.X}_YYYY-MM-DD.md    ← 迭代日志
    │   ├── *_SPECIFICATIONS.md       ← 功能规格
    │   ├── *_STRATEGY.md             ← 技术方案
    │   ├── *_TEST_REPORT.md          ← 测试报告
    │   ├── DEPLOYMENT_CHECKLIST.md   ← 部署清单
    │   └── RELEASE_NOTES.md          ← 发布说明
    │
    └── archive/                      ← 过程文档归档
```

---

## 🎯 五大支柱职责

### 1. 产品支柱 (01-product)

**职责**: 产品需求、功能规格、用户体验

**核心文档**:
- `docs/requirements/` - 需求文档
- `docs/specifications/` - 功能规格说明
- `standards/` - 开发规范（指导性，非强制）
- `baseline/v{X.X.X}/` - 生产环境基线

**关键原则**:
- 需求文档是技术方案的源头
- 所有技术文档都应指向对应的需求文档
- 基线文档是生产环境的真相，可以更新

---

### 2. 架构支柱 (02-architecture)

**职责**: 系统架构、技术方案、架构决策

**核心文档**:
- `docs/database/` - 数据库架构和规范
- `docs/system/` - 系统架构文档
- `docs/technical/` - 技术文档
- `decisions/` - 架构决策记录 (ADR)
- `diagrams/` - 架构图和流程图

**ADR 标准格式**:
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

**关键原则**:
- 重要架构决策必须创建 ADR
- ADR 一旦接受，不可修改（只能废弃并创建新的）
- 数据库 schema 必须版本化管理

---

### 3. 测试支柱 (03-testing)

**职责**: 测试标准、测试报告、质量保障

**核心文档**:
- `docs/standards/` - 测试标准
- `docs/guides/` - 测试指南
- `docs/strategies/` - 测试策略
- `reports/` - 测试报告

**测试金字塔标准**:
```
     /\      E2E Tests (10-20%)
    /  \     - 核心业务流程
   /    \    - 真实用户场景
  /------\   
 /        \  Integration Tests (30-40%)
/          \ - API 集成测试
/------------\ - 数据库集成测试
              
              Unit Tests (40-60%)
              - 业务逻辑单元测试
              - 工具函数测试
```

**关键原则**:
- 所有新功能必须有对应的测试
- 关键业务流程必须有 E2E 测试
- 测试报告必须包含覆盖率和性能指标

---

### 4. 运维支柱 (04-operations)

**职责**: 部署运维、质量保障、红线规范

**核心文档**:
- `docs/deployment/` - 部署文档
- `docs/monitoring/` - 监控文档
- `docs/incidents/` - 事件报告
- `redlines/` - 红线规范（强制约束）⭐⭐⭐
- `scripts/` - 运维脚本

**红线体系**（详见后文）

**关键原则**:
- 红线是不可触碰的底线，违反必须立即拦截
- 所有红线必须有自动化检查机制
- 事件报告必须包含根因分析和预防措施

---

### 5. 迭代支柱 (05-iteration) ⭐⭐⭐

**职责**: 版本管理、开发日志、迭代记录

**定位**: 开发工作区 + 历史快照

**核心文档**:
- `CURRENT_VERSION.md` - 当前版本状态（AI 必读）
- `v{X.X.X}/` - 版本目录（扁平化结构）

**版本目录结构** (扁平化):
```
v{X.X.X}/
├── README.md                    # 版本概览（按支柱分类所有文档）
│
├── 🎯 产品支柱文档
├── v{X.X.X}_REQUIREMENTS.md     # 需求文档（必需，根文档）
├── *_SPECIFICATIONS.md          # 功能规格
│
├── 🏗️ 架构支柱文档
├── *_STRATEGY.md                # 技术方案
├── ADR-*.md                     # 架构决策记录
│
├── 🧪 测试支柱文档
├── *_TEST_REPORT.md             # 测试报告
│
└── ⚙️ 运维支柱文档
    ├── DEPLOYMENT_CHECKLIST.md  # 部署清单
    ├── RELEASE_NOTES.md         # 发布说明
    └── v{X.X.X}_YYYY-MM-DD.md   # 迭代日志
```

**工作流程**:
1. **开发中**: 所有文档集中在版本目录，扁平化结构
2. **打 tag 后**: 
   - 提取内容 → 复制到四大支柱（形成基线）
   - 版本目录保留完整快照 → 变为只读历史记录

**关键原则**:
- 迭代支柱 = 历史快照（不可变）
- 四大支柱 = 生产基线（可更新）
- 每个版本必须有 `{版本号}_REQUIREMENTS.md`（根文档）
- 打 tag 前必须完成文档归档

---

## 🚨 红线规范体系

### 红线定义

**红线**是不可触碰的底线规则，违反将触发**强制拦截机制**。

红线规范与开发规范的区别：
- **开发规范** (`01-product/standards/`): 推荐做法，指导性文档
- **红线规范** (`04-operations/redlines/`): 强制约束，违反立即拦截

### 通用红线类别

#### 1. 数据库使用红线 🔴

**核心规则**:
- 🔴 禁止硬编码数据库凭证
- 🔴 禁止跳过数据库健康检查
- 🔴 禁止手动修改生产数据库
- 🔴 数据库字段和字段映射绝对禁止猜测
- 🔴 必须先查询实际数据库结构

**拦截方式**:
- ✅ 启动时检查
- ✅ Git pre-commit hook
- ✅ CI/CD 管道检查
- ✅ 手动检查脚本

#### 2. 版本发布红线 🔴

**核心规则**:
- 🔴 打 tag 前必须备份数据库
- 🔴 推送 main 分支必须授权
- 🔴 打 tag 必须获得授权
- 🔴 打 tag 后必须归档文档
- 🔴 禁止删除已发布的 tag

**拦截方式**:
- ✅ Git pre-push hook（推送 main / tag）
- ✅ 手动检查脚本
- ✅ 发布前检查清单

#### 3. AI 开发红线 🔴

**核心规则**:
- 🔴 禁止改变现有架构和 import 路径
- 🔴 禁止删除或替换现有业务逻辑（只增量添加）
- 🔴 禁止创建新的配置文件（使用现有的）
- 🔴 临时测试文件使用后必须立即删除
- 🔴 每次开发都要基于现有业务逻辑

**拦截方式**:
- ✅ AI 自我检查（强制检查清单）
- ✅ 代码审查
- ✅ Git hooks（继承其他红线）

### 拦截机制

#### 1. Runtime 拦截（运行时）
- 服务启动时检查
- 每次请求时验证
- 检测到违规 → 返回 500 错误

#### 2. Git Hook 拦截（提交时）⭐⭐⭐
- `git commit` 前检查（Pre-Commit）
- `git push` 前检查（Pre-Push）
- `git commit` 后提醒（Post-Commit）
- 检测到违规 → 阻止提交/推送
- **详见**: [Git Hooks 拦截机制规范](./04-operations/redlines/GIT_HOOKS_ENFORCEMENT.md)

**Git Hooks 核心检查项**:
- ✅ 删除行数限制（≤36行）
- ✅ 代码覆盖拦截（>3行需交互式验证）
- ✅ 大量修改拦截（单文件>72行或总计>360行）
- ✅ Schema 备份验证（必须先查询实证）
- ✅ 数据库迁移验证（CHECK → EXECUTE → VERIFY）
- ✅ 版本号创建验证（需用户明确批准）
- ✅ 硬编码检测（禁止魔法数字）
- ✅ 分支保护（main/master 需授权）
- ✅ Tag 推送验证（必须备份数据库）

**安全机制**:
- 🔐 口令锁 - 批准文件必须包含特定口令
- ⏰ 时间锁 - 批准文件必须存在≥3秒
- 🎯 交互锁 - 随机确认码，AI 无法绕过（最高级别）

#### 3. CI/CD 拦截（构建时）
- Push 到分支时检查
- 创建 PR 时检查
- 检测到违规 → 构建失败

#### 4. 手动检查（开发时）
- 开发者随时运行
- 全面扫描代码和配置
- 提供修复建议

### 违规处理流程

1. **立即停止** - 停止当前操作
2. **回滚变更** - 恢复到符合规范的状态
3. **记录事件** - 创建事件报告
4. **通知团队** - 在团队通讯工具中通知
5. **复盘改进** - 分析原因，优化拦截机制

---

## 📋 版本发布流程

### 标准发布流程

```
┌─────────────────────────────────────────────────────────┐
│ 1. 准备阶段                                              │
│    ├─ 创建版本目录: 05-iteration/v{X.X.X}/              │
│    ├─ 创建需求文档: v{X.X.X}_REQUIREMENTS.md            │
│    └─ 更新 CURRENT_VERSION.md                           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. 开发阶段                                              │
│    ├─ 所有文档在版本目录（扁平化）                      │
│    ├─ 迭代日志: v{X.X.X}_YYYY-MM-DD.md                  │
│    ├─ 技术方案、测试报告、部署清单                      │
│    └─ 严格遵守红线规范                                  │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. 测试阶段                                              │
│    ├─ 单元测试（40-60% 覆盖率）                         │
│    ├─ 集成测试（30-40% 覆盖率）                         │
│    ├─ E2E 测试（核心业务流程）                          │
│    └─ UAT 测试（真实用户验收）                          │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 4. 发布前检查（必需）                                   │
│    ├─ ✅ 运行红线检查脚本                               │
│    ├─ ✅ 确认所有测试通过                               │
│    ├─ ✅ 备份数据库（快照）⭐                           │
│    ├─ ✅ 更新 RELEASE_NOTES.md                          │
│    └─ ✅ 获得发布授权                                   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 5. 打 Git Tag（需授权）                                 │
│    ├─ git tag v{X.X.X}                                  │
│    ├─ git push origin v{X.X.X}                          │
│    └─ 同时备份数据库 schema 快照                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 6. 文档归档（自动化）                                   │
│    ├─ 提取版本目录内容                                  │
│    ├─ 复制到四大支柱 baseline/v{X.X.X}/                │
│    │   ├─ 产品文档 → 01-product/baseline/v{X.X.X}/     │
│    │   ├─ 架构文档 → 02-architecture/baseline/v{X.X.X}/│
│    │   ├─ 测试文档 → 03-testing/baseline/v{X.X.X}/     │
│    │   └─ 运维文档 → 04-operations/baseline/v{X.X.X}/  │
│    └─ 标记版本目录为只读（历史快照）                    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 7. 发布完成                                              │
│    ├─ 更新 CURRENT_VERSION.md（指向新版本）            │
│    ├─ 通知团队                                          │
│    └─ 开始下一个版本                                    │
└─────────────────────────────────────────────────────────┘
```

### 关键检查清单

**发布前必检项** (Pre-Release Checklist):

```markdown
## 发布前检查清单

### 1. 代码质量
- [ ] 所有 linter 错误已修复
- [ ] 所有类型错误已修复
- [ ] 代码已通过 Code Review

### 2. 测试覆盖
- [ ] 单元测试覆盖率 ≥ 40%
- [ ] 集成测试已通过
- [ ] E2E 测试（核心流程）已通过
- [ ] UAT 测试已完成并验收

### 3. 红线检查
- [ ] 数据库红线检查通过
- [ ] 版本发布红线检查通过
- [ ] AI 开发红线检查通过

### 4. 数据库
- [ ] 数据库 schema 快照已创建
- [ ] 数据库迁移脚本已测试
- [ ] 数据库备份已完成 ⭐⭐⭐

### 5. 文档
- [ ] RELEASE_NOTES.md 已更新
- [ ] README.md 已更新（如有必要）
- [ ] API 文档已更新（如有必要）
- [ ] 迭代日志已完成

### 6. 授权
- [ ] 已获得推送 main 分支授权（如需）
- [ ] 已获得打 tag 授权 ⭐⭐⭐

### 7. 部署
- [ ] 环境变量已配置
- [ ] 构建测试已通过
- [ ] 回滚方案已准备
```

---

## 🤖 AI 助手使用指南

### 每次会话开始时（必须）

**必读文档** (按顺序):

1. **`AI_QUICK_START.md`** (5分钟) - 快速恢复上下文
2. **`05-iteration/CURRENT_VERSION.md`** - 了解当前版本状态
3. **`05-iteration/v{当前版本}/README.md`** - 版本概览
4. **`05-iteration/v{当前版本}/{版本号}_REQUIREMENTS.md`** - 需求文档（根）
5. **根据任务读取相关文档**

### 开发过程中

**文档查找优先级**:

1. **先查迭代支柱** - 当前版本目录（最新、最相关）
2. **再查对应支柱** - 架构/测试/运维支柱（标准、规范）
3. **最后查代码** - 使用搜索工具

**红线检查**（开发时随时检查）:

```markdown
## AI 自检清单

### 数据库操作
- [ ] 是否使用了正确的数据库？
- [ ] 是否避免了硬编码凭证？
- [ ] 是否正确使用了数据库表名？
- [ ] 是否查看了 DATABASE_SCHEMA.md？

### 架构变更
- [ ] 是否保持了现有架构不变？
- [ ] 是否避免了修改 import 路径？
- [ ] 是否创建了新的配置文件？（禁止）

### 业务逻辑
- [ ] 是否只增量添加，未删除现有逻辑？
- [ ] 是否验证了业务规则？
- [ ] 是否查看了相关需求文档？

### 文件操作
- [ ] 是否创建了临时测试文件？（需标记清理）
- [ ] 是否在任务完成后清理了临时文件？

### 文档更新
- [ ] 是否更新了迭代日志？
- [ ] 是否记录了重要决策？
- [ ] 是否更新了相关文档？
```

### 完成任务后

**必须操作**:

1. **更新迭代日志** - 记录今日工作
2. **清理临时文件** - 删除测试文件、调试脚本
3. **更新文档** - 如有新的规则、决策、问题
4. **自检红线** - 确认未违反任何红线

---

## 🚀 新项目初始化清单

### 方式一：使用初始化脚本（推荐）⭐

```bash
# 1. 复制初始化脚本到项目根目录
cp /path/to/init-pillars.sh ./

# 2. 执行初始化脚本
chmod +x init-pillars.sh
./init-pillars.sh

# 3. 脚本会自动创建：
#    - 完整的五大支柱目录结构
#    - 基础 README 文件
#    - 红线目录说明
```

### 方式二：手动创建目录

```bash
# 创建五大支柱主目录
mkdir -p __pillars__/{01-product,02-architecture,03-testing,04-operations,05-iteration}

# 产品支柱目录
mkdir -p __pillars__/01-product/{docs,standards,baseline}
mkdir -p __pillars__/01-product/docs/{requirements,specifications,user-stories}

# 架构支柱目录
mkdir -p __pillars__/02-architecture/{docs,decisions,diagrams,baseline}
mkdir -p __pillars__/02-architecture/docs/{database,system,technical}

# 测试支柱目录
mkdir -p __pillars__/03-testing/{docs,reports,baseline}
mkdir -p __pillars__/03-testing/docs/{standards,guides,strategies}

# 运维支柱目录
mkdir -p __pillars__/04-operations/{docs,redlines,scripts,baseline}
mkdir -p __pillars__/04-operations/docs/{deployment,monitoring,incidents}

# 迭代支柱目录
mkdir -p __pillars__/05-iteration/{archive}

echo "✅ 五大支柱目录结构创建完成！"
```

### 1. 创建支柱体系目录

选择上述方式之一创建目录结构。

### 2. 复制标准文档模板

从本框架复制以下文件：

- `__pillars__/README.md`
- `__pillars__/INDEX.md`
- `__pillars__/PILLARS_SYSTEM_STANDARD.md`
- `__pillars__/AI_QUICK_START.md`
- `__pillars__/01-product/README.md`
- `__pillars__/02-architecture/README.md`
- `__pillars__/03-testing/README.md`
- `__pillars__/04-operations/README.md`
- `__pillars__/04-operations/redlines/README.md`
- `__pillars__/04-operations/redlines/DATABASE_REDLINES.md`
- `__pillars__/04-operations/redlines/RELEASE_REDLINES.md`
- `__pillars__/04-operations/redlines/AI_DEVELOPMENT_REDLINES.md`
- `__pillars__/05-iteration/README.md`

### 3. 创建第一个版本

```bash
# 创建 v0.1.0 目录
mkdir __pillars__/05-iteration/v0.1.0
cd __pillars__/05-iteration/v0.1.0

# 创建必需文档
touch README.md
touch v0.1.0_REQUIREMENTS.md
touch v0.1.0_$(date +%Y-%m-%d).md
```

### 4. 配置 Git Hooks

```bash
# 安装 husky
npm install --save-dev husky

# 初始化 husky
npx husky install

# 创建 pre-commit hook
npx husky add .husky/pre-commit "node scripts/validation/check-database-redlines.js"

# 创建 pre-push hook
npx husky add .husky/pre-push "node scripts/validation/check-release-redlines.js"
```

### 5. 创建验证脚本和辅助工具

**验证脚本**:
```bash
mkdir -p scripts/validation
# 创建数据库红线检查脚本
# 创建发布红线检查脚本
```

**交互式验证脚本**（最高级别安全）:
```bash
mkdir -p scripts
cat > scripts/approve-overwrite.sh << 'EOF'
#!/bin/bash
# 生成随机6位数字确认码
CONFIRM_CODE=$(shuf -i 100000-999999 -n 1)

echo "🔐 安全确认（防止意外覆盖）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   请输入以下确认码以继续："
echo ""
echo "   ┌─────────────────┐"
echo "   │   $CONFIRM_CODE    │"
echo "   └─────────────────┘"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -n "确认码: "
read user_input

if [ "$user_input" = "$CONFIRM_CODE" ]; then
    echo "已通过外部验证" > .overwrite-approved
    echo "✅ 验证通过！"
    echo "现在可以执行: git commit -m '你的提交信息'"
else
    echo "❌ 确认码错误！"
    exit 1
fi
EOF

chmod +x scripts/approve-overwrite.sh
```

**推送 main 分支脚本**:
```bash
cat > scripts/push-main.sh << 'EOF'
#!/bin/bash
# 生成随机6位数字确认码
CONFIRM_CODE=$(shuf -i 100000-999999 -n 1)

echo "🔐 安全确认（防止意外推送到main）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   请输入以下确认码以继续推送到main："
echo ""
echo "   ┌─────────────────┐"
echo "   │   $CONFIRM_CODE    │"
echo "   └─────────────────┘"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -n "确认码: "
read user_input

if [ "$user_input" = "$CONFIRM_CODE" ]; then
    echo "已通过外部验证" > .push-main-approved
    echo "✅ 验证通过！"
    git push origin main
    rm -f .push-main-approved
else
    echo "❌ 确认码错误！"
    exit 1
fi
EOF

chmod +x scripts/push-main.sh
```

参考现有项目创建：
- `scripts/validation/check-database-redlines.js`
- `scripts/validation/check-release-redlines.js`
- `scripts/approve-overwrite.sh` ⭐（交互式验证）
- `scripts/push-main.sh` ⭐（推送 main 验证）

### 6. 更新项目 README

在项目根目录 `README.md` 中添加支柱体系链接:

```markdown
## 📚 项目文档

- [支柱体系](__pillars__/README.md) - 项目知识库和文档中心
- [支柱体系标准](__pillars__/PILLARS_SYSTEM_STANDARD.md) - 支柱体系规范
- [AI 快速启动](__pillars__/AI_QUICK_START.md) - AI 助手必读
- [当前版本](__pillars__/05-iteration/CURRENT_VERSION.md) - 当前开发状态
```

### 7. 初始化 AI 上下文文档

创建 `__pillars__/AI_CONTEXT_KNOWLEDGE_BASE.md`:

```markdown
# AI 上下文知识库

> **用途**: AI 助手的长期记忆，记录所有核心业务逻辑和开发规则  
> **更新**: 每次重要对话后更新

---

## 🔴 关键红线

[从标准文档复制红线内容]

---

## 📋 核心业务规则

[记录项目特有的业务规则]

---

## 🗄️ 数据库配置

[记录数据库配置信息]

---

## 🧪 测试规范

[记录测试要求]

---

## 🔧 常见问题和解决方案

[记录 FAQ]
```

### 8. 团队培训

- [ ] 召开支柱体系培训会
- [ ] 讲解五大支柱的职责
- [ ] 演示版本发布流程
- [ ] 强调红线规范
- [ ] 演示 AI 助手使用

---

## 📝 最佳实践

### DO ✅

1. ✅ 每次重要对话后更新支柱文档
2. ✅ 用简洁清晰的语言
3. ✅ 包含示例和代码片段
4. ✅ 记录"为什么"而不只是"做什么"
5. ✅ 保持文档结构化
6. ✅ 开发时所有文档放在迭代支柱当前版本目录
7. ✅ 打 tag 后立即归档到四大支柱
8. ✅ 严格遵守红线规范
9. ✅ 临时文件使用后立即清理
10. ✅ 重要决策创建 ADR 记录

### DON'T ❌

1. ❌ 不要写流水账
2. ❌ 不要过度详细
3. ❌ 不要重复代码（引用文件位置即可）
4. ❌ 不要忘记更新 AI_CONTEXT_KNOWLEDGE_BASE.md
5. ❌ 不要在已归档的版本目录中修改文档
6. ❌ 不要跳过发布前检查
7. ❌ 不要在未授权的情况下打 tag
8. ❌ 不要猜测数据库字段（必须查文档实证）
9. ❌ 不要让性能优化影响业务逻辑
10. ❌ 不要删除或替换现有业务逻辑（只增量添加）

---

## 🎓 支柱体系核心理念

### 1. 开发在迭代支柱，生产在四大支柱

**迭代支柱**:
- 开发工作区（活跃）
- 历史快照（只读）
- 扁平化结构（方便查找）

**四大支柱**:
- 生产基线（可更新）
- 权威知识来源
- 分类清晰（按职责）

### 2. 历史看迭代快照，真相看四大基线

**迭代快照**:
- 记录"当时发生了什么"
- 不可修改（历史记录）
- 用于回顾和审计

**四大基线**:
- 维护"生产环境的真相"
- 可以更新（修正错误）
- 用于日常开发

### 3. 红线是底线，规范是指南

**红线**:
- 不可触碰
- 强制拦截
- 违反必须立即处理

**规范**:
- 推荐做法
- 指导性质
- 灵活调整

### 4. 文档先行，代码随后

**文档先行**:
- 需求文档是源头
- 架构方案是指导
- 测试标准是保障

**代码随后**:
- 根据文档编写代码
- 保持代码和文档同步
- 代码变更必须更新文档

### 5. AI 是助手，人是主导

**AI 助手**:
- 快速恢复上下文
- 自动化重复工作
- 提供建议和方案

**人类主导**:
- 最终决策权
- 质量把关
- 架构设计

---

## 📈 支柱体系成熟度模型

### Level 0: 无文档
- ❌ 没有系统化文档
- ❌ 知识散落在代码和聊天记录中
- ❌ 新人上手困难
- ❌ AI 无法快速恢复上下文

### Level 1: 基础文档
- ✅ 有 README 和基本说明
- ✅ 关键决策有记录
- ⚠️ 文档分散，查找困难
- ⚠️ 没有统一标准

### Level 2: 支柱体系初期
- ✅ 五大支柱目录已建立
- ✅ 核心文档已创建
- ✅ 红线规范已定义
- ⚠️ 文档更新不及时
- ⚠️ 拦截机制未完善

### Level 3: 支柱体系成熟
- ✅ 文档完整且及时更新
- ✅ 红线拦截机制完善
- ✅ 版本发布流程规范
- ✅ AI 上下文管理良好
- ✅ 团队协作高效

### Level 4: 支柱体系卓越
- ✅ 文档自动化程度高
- ✅ 知识库持续优化
- ✅ 最佳实践不断积累
- ✅ 跨项目经验复用
- ✅ 成为团队文化

---

## 📊 支柱体系的价值

### 短期价值（立即见效）
- ✅ 减少重复工作
- ✅ 统一团队理解
- ✅ 快速问题定位
- ✅ AI 快速恢复上下文

### 中期价值（几周后）
- ✅ 知识积累和沉淀
- ✅ 决策追溯和审计
- ✅ 降低沟通成本
- ✅ 提高开发效率

### 长期价值（几个月后）
- ✅ 新人快速上手
- ✅ AI 助手持续记忆
- ✅ 项目经验复用
- ✅ 质量持续提升

---

## 🔗 适用场景

### 适合使用支柱体系的项目

1. **中长期项目** - 开发周期 > 3 个月
2. **团队协作项目** - 团队成员 ≥ 2 人
3. **复杂业务项目** - 业务逻辑复杂，需要文档支撑
4. **AI 辅助开发项目** - 需要 AI 助手快速恢复上下文
5. **需要知识传承的项目** - 团队成员可能变动

### 不适合使用支柱体系的项目

1. **一次性脚本** - 用完即弃的小工具
2. **个人练习项目** - 纯学习目的，不需要维护
3. **极短期项目** - 开发周期 < 1 周
4. **简单 CRUD 项目** - 业务逻辑极简单

---

## 🔗 相关文档

### 核心文档
- [Git Hooks 拦截机制规范](./04-operations/redlines/GIT_HOOKS_ENFORCEMENT.md) 
- [数据库使用红线](./04-operations/redlines/DATABASE_REDLINES.md)
- [版本发布红线](./04-operations/redlines/RELEASE_REDLINES.md)
- [AI 开发红线](./04-operations/redlines/AI_DEVELOPMENT_REDLINES.md)

### 问题反馈
如果您在使用本框架时遇到问题，请：
1. 参考源项目的实际应用案例
2. 查看 `PILLARS_SYSTEM_STANDARD.md` 了解详细规范
3. 查看 `GIT_HOOKS_ENFORCEMENT.md` 了解 Git Hooks 配置
4. 根据项目实际情况灵活调整

### 持续改进
本框架基于实际项目经验提炼，欢迎：
- 提出改进建议
- 分享最佳实践

---

## 📞 支持与反馈

### 问题反馈
如果您在使用本框架时遇到问题，请：
1. 参考源项目的实际应用案例
2. 查看 `PILLARS_SYSTEM_STANDARD.md` 了解详细规范
3. 根据项目实际情况灵活调整

### 持续改进
本框架基于实际项目经验提炼，欢迎：
- 提出改进建议
- 分享最佳实践
- 贡献案例研究

---

**版本**: v1.0  
**创建时间**: 2025-12-16  
**维护者**: 基于实际项目实践提炼  
**许可**: 可自由用于任何项目

---

## 附录：核心文件模板

### A. README.md 模板

```markdown
# {项目名称} - 支柱体系

> **项目**: {项目名称}  
> **版本**: v{X.X.X}  
> **技术栈**: {主要技术栈}  
> **核心功能**: {核心功能列表}

---

## 🎯 项目简介

{项目简介}

---

## 📚 五大支柱

### [01-product](./01-product/) 产品支柱
- 产品需求、功能规格、用户体验设计
- 开发规范（指导性）

### [02-architecture](./02-architecture/) 架构支柱
- 系统架构、数据库设计、技术方案
- 架构决策记录 (ADR)

### [03-testing](./03-testing/) 测试支柱
- 测试标准、测试策略、测试报告
- 质量保障体系

### [04-operations](./04-operations/) 运维支柱
- 部署运维、监控、质量保障
- 🔴 红线规范（强制约束）

### [05-iteration](./05-iteration/) 迭代支柱
- 版本管理、迭代记录、开发日志
- 📍 [当前版本: v{X.X.X}](./05-iteration/CURRENT_VERSION.md)

---

## 🚀 快速开始

### 给开发者
1. 阅读 [支柱体系标准](./PILLARS_SYSTEM_STANDARD.md)
2. 查看 [当前版本状态](./05-iteration/CURRENT_VERSION.md)
3. 阅读 [需求文档](./05-iteration/v{X.X.X}/v{X.X.X}_REQUIREMENTS.md)

### 给 AI 助手
1. **必读**: [AI 快速启动](./AI_QUICK_START.md)
2. **必读**: [AI 长期记忆库](./AI_CONTEXT_KNOWLEDGE_BASE.md)
3. **必读**: [当前版本](./05-iteration/CURRENT_VERSION.md)
4. **必检**: [红线规范](./04-operations/redlines/)

---

## 🔴 红线提醒

### 数据库使用红线
- 🔴 禁止硬编码数据库凭证
- 🔴 禁止跳过数据库健康检查

### 版本发布红线
- 🔴 打 tag 前必须备份数据库
- 🔴 推送 main 分支必须授权

### AI 开发红线
- 🔴 禁止改变现有架构
- 🔴 禁止删除或替换现有业务逻辑

详见: [红线规范目录](./04-operations/redlines/)

---

**📌 提示**: 所有开发工作请遵循支柱体系标准，确保文档和代码同步更新。
```

### B. AI_QUICK_START.md 模板

```markdown
# AI 快速启动指南

> **用途**: AI 助手 5 分钟快速恢复项目上下文  
> **更新**: 每次重要变更后更新

---

## 🎯 项目概览

**项目名称**: {项目名称}  
**当前版本**: v{X.X.X}  
**技术栈**: {技术栈}  
**核心功能**: {核心功能}

---

## 📋 当前状态

**开发状态**: {开发中/测试中/已发布}  
**当前任务**: {当前主要任务}  
**阻塞问题**: {如有}

---

## 🔴 关键红线（必须遵守）

1. 🔴 {红线1}
2. 🔴 {红线2}
3. 🔴 {红线3}

详见: [红线规范](./04-operations/redlines/)

---

## 📚 必读文档

1. [当前版本状态](./05-iteration/CURRENT_VERSION.md)
2. [需求文档](./05-iteration/v{X.X.X}/v{X.X.X}_REQUIREMENTS.md)
3. [数据库架构](./02-architecture/docs/database/DATABASE_SCHEMA.md)

---

## 🔧 开发环境

**数据库**: {数据库类型}  
**部署平台**: {部署平台}  
**关键配置**: {关键配置说明}

---

## 💡 快速命令

```bash
# 开发
{开发命令}

# 测试
{测试命令}

# 部署
{部署命令}
```

---

**更新时间**: {日期}
```

### C. CURRENT_VERSION.md 模板

```markdown
# 当前版本状态

> **版本**: v{X.X.X}  
> **状态**: {开发中/测试中/已发布}  
> **更新时间**: {日期}

---

## 📋 版本信息

**版本号**: v{X.X.X}  
**开始时间**: {日期}  
**预计完成**: {日期}  
**负责人**: {负责人}

---

## 🎯 版本目标

{版本主要目标和功能}

---

## 📊 开发进度

- [ ] 需求分析
- [ ] 技术方案
- [ ] 开发实现
- [ ] 单元测试
- [ ] 集成测试
- [ ] UAT 测试
- [ ] 发布准备

---

## 🔗 相关文档

- [需求文档](./v{X.X.X}/v{X.X.X}_REQUIREMENTS.md)
- [技术方案](./v{X.X.X}/)
- [测试报告](./v{X.X.X}/)

---

## 📝 开发日志

最新日志: [v{X.X.X}_{日期}.md](./v{X.X.X}/v{X.X.X}_{日期}.md)

---

**更新时间**: {日期}
```

---

**本框架结束**

请根据项目实际情况灵活调整和扩展。
