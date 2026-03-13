---
tags:
  - 资深全栈面试
---
diff 算法跟 Fiber 架构是**直接关联**的，不是 setState/Hooks 的范畴。来理清这条链路：

---

### 完整流程：谁触发谁

```
setState / useTransition        ← 触发更新（Hooks 范畴）
       │
       ▼
  Scheduler 调度               ← 决定优先级、何时执行（Fiber 调度范畴）
       │
       ▼
  Reconciler 协调（diff）       ← 比较新旧 Fiber 树，标记增删改（Fiber 核心）
       │                          ↑ key 在这一步起作用
       ▼
  Commit 阶段                  ← 把标记的变更一次性写入真实 DOM
```

---

### 各自的职责

| 层级 | 负责什么 | key 在这里？ |
|------|---------|-------------|
| **Hooks / setState** | 告诉 React "数据变了，要更新" | ❌ 不涉及 key |
| **Scheduler** | 排队、分优先级、时间切片 | ❌ 不涉及 key |
| **Reconciler (diff)** | 比较新旧 Fiber 树，决定哪些节点复用/创建/删除 | ✅ **key 在这里用** |
| **Commit** | 操作真实 DOM | ❌ 已经决定好了，照做就行 |

---

### 关键点

**diff 是 Fiber Reconciler 的核心工作**。React 16 之前的 Stack Reconciler 也有 diff，但它是一口气跑完不能中断的。Fiber 架构把 Reconciler 重写了：

```
Stack 架构的 diff：
  遍历整棵树 ──────────────────────→ 完成（不可中断）

Fiber 架构的 diff：
  处理节点A → 检查时间 → 处理节点B → 检查时间 → 让出 → 恢复 → 处理节点C ...
  （可中断，每个 Fiber 节点是一个工作单元）
```

所以 diff 算法本身（比较逻辑、key 匹配、Map 查找）是 **Reconciler 的逻辑**，而 Fiber 架构让这个 diff 过程变成了**可中断的**。两者是包含关系：

> **Fiber 架构 ⊃ Reconciler ⊃ diff 算法 ⊃ key 匹配**

---

### 一句话

setState/Hooks 只是"发信号说要更新"，diff 是 Fiber Reconciler 里"比较新旧树决定怎么更新"的核心步骤，key 就是 diff 这一步用来识别节点身份的。