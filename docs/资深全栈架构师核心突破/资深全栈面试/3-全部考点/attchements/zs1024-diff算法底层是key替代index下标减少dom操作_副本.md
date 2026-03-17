---
tags:
  - 资深全栈面试
---
## diff 算法中 key 的作用 — 第一性原理拆解

---

### 第零步：diff 要解决什么问题？

React 每次 setState 后生成一棵新虚拟 DOM 树。

> 旧树 N 节点 vs 新树 M 节点，通用树 diff = O(N³)，万条数据直接爆炸。

React 策略：**只比同层级节点**，O(N³) → O(N)。但同层级有多个子节点（列表）时，怎么知道谁对应谁？这就是 key 的活。

---

### 第一步：没有 key — 按下标逐个硬比

搜索前 `[Alice, Bob, Carol]`，搜索后删了 Alice 变成 `[Bob, Carol]`：

```
旧列表（按下标）            新列表（按下标）         操作
┌─────────────────┐      ┌─────────────────┐
│ index=0  Alice  │ ──→  │ index=0  Bob    │   Alice≠Bob  → 销毁Alice，创建Bob
│ index=1  Bob    │ ──→  │ index=1  Carol  │   Bob≠Carol  → 销毁Bob，创建Carol
│ index=2  Carol  │ ──→  │ (空)            │   Carol没了  → 销毁Carol
└─────────────────┘      └─────────────────┘

合计：3次销毁 + 2次创建 = 5次DOM操作
```

Bob 和 Carol 明明还活着，却被杀了重建。浪费。

---

### 第二步：有 key — 按身份证匹配

给每人一个唯一 key（如 `id`）：

```
旧列表（按 key）            新列表（按 key）          操作
┌──────────────────┐      ┌──────────────────┐
│ key="a"  Alice   │      │                  │    key="a" 新树没有 → 仅销毁Alice
│ key="b"  Bob     │ ───→ │ key="b"  Bob     │    key="b" 匹配！    → 复用，不动
│ key="c"  Carol   │ ───→ │ key="c"  Carol   │    key="c" 匹配！    → 复用，不动
└──────────────────┘      └──────────────────┘

合计：1次销毁 + 0次创建 = 1次DOM操作
```

从 5 次 → 1 次，差 5 倍。万条数据时差距更恐怖。

---

### 第三步：key 匹配的内部流程（Map 查找）

React 内部用的是 Map，不是遍历：

```
第1步：旧 Fiber 子节点建 Map
┌─────────────────────────────┐
│  Map {                      │
│    "a" → FiberNode(Alice)   │
│    "b" → FiberNode(Bob)     │
│    "c" → FiberNode(Carol)   │
│  }                          │
└─────────────────────────────┘

第2步：遍历新列表，逐个查 Map
  新[0] key="b" → Map.get("b") → 命中！复用 FiberNode(Bob)
  新[1] key="c" → Map.get("c") → 命中！复用 FiberNode(Carol)

第3步：Map 中剩余的 key="a" → 没被匹配 → 标记删除
```

时间复杂度：建 Map O(N) + 查 Map O(M) = **O(N+M)**，接近线性。

---

### 第四步：为什么不能用 index 当 key？

用 `index` 当 key 等于没给 key，因为位置变了 key 就变了：

```
场景：在头部插入 Dave

旧列表                      新列表
┌────────────────────┐    ┌────────────────────┐
│ key=0  Alice       │    │ key=0  Dave ← 新的 │   key=0: Alice→Dave  → 销毁重建
│ key=1  Bob         │    │ key=1  Alice       │   key=1: Bob→Alice   → 销毁重建
│ key=2  Carol       │    │ key=2  Bob         │   key=2: Carol→Bob   → 销毁重建
│                    │    │ key=3  Carol       │   key=3: 新增        → 创建
└────────────────────┘    └────────────────────┘

用 index 当 key：4次操作（全部重建）

用唯一 id 当 key：
  key="d" Dave  → 新增1个
  key="a" Alice → 复用（移动位置）
  key="b" Bob   → 复用（移动位置）
  key="c" Carol → 复用（移动位置）
  实际DOM操作：1次创建 + 移动
```

---

### 第五步：在咱们项目中的体现

```jsx
// VirtualList.jsx — 用 item.id 做 key ✅
{visibleData.map(item => (
  <div key={item.id} className="list-item">
    {item.name} - {item.phone}
  </div>
))}
```

搜索过滤时，`visibleData` 从 10000 条变成比如 50 条。因为用了 `item.id`：
- React 通过 key 发现那 50 条在旧树里已经存在 → **复用 Fiber 节点**
- 其余 9950 条在新树里没出现 → 标记删除
- 不会出现"明明同一个人却被销毁重建"的浪费

如果用 `index` 做 key：
- 旧 index=0 是 Alice，新 index=0 可能是 Zack → 全部判定为"不同节点" → 全部销毁重建

---

### 一句话总结

> **key 是虚拟 DOM 节点的身份证。没有它，React 只能按位置硬比，位置一变就全废。有了它，React 用 Map O(1) 查找精准复用，只动真正变了的节点。**

---

### 面试话术

> "diff 算法对列表子节点默认按下标比较，复杂度虽然是 O(N) 但会产生大量无效的销毁重建。key 的作用是给每个节点一个稳定身份，React 内部用 Map 做旧节点索引，新列表遍历时 O(1) 查找复用。所以 key 必须用业务唯一 id，不能用 index，否则插入/删除/排序时 key 跟着位置变，等于没给。在我们的万人通讯录项目里，搜索过滤后列表大幅缩短，用 id 做 key 让 React 精准复用存活节点，避免了上万次无效 DOM 操作。"