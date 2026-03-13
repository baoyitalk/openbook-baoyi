# 🐛 Bug 清单 & 反思

---

## Bug #1：商品列表无法滚动（反复出现 3 次）

### 问题描述
商品列表区域设置了固定高度，但页面上商品不会溢出容器，没有滚动条，无法触发滚动加载更多。

### 根本原因（两层问题叠加）

**原因 A：CSS Grid 容器设固定 height 会压缩子项**
- 给 `display: grid` 的容器直接设 `height: 510px`，grid 布局会自动压缩行高让所有子项塞进容器内
- grid 子项不会溢出容器，所以 `overflow-y: auto` 永远不会生效
- **正确做法**：滚动容器和 grid 布局必须分离——外层普通 div 设固定高度 + overflow，内层 grid 自然撑开

**原因 B：首页数据量不足以溢出容器**
- 每页只加载 8 个商品，3 列布局下 = 3 行（3+3+2），总高度 ≈ 480px
- 容器高度 510px，内容刚好放得下，不会产生滚动条
- **正确做法**：每页加载 12 个商品（3 列 x 4 行），确保首页内容一定超出容器

### 修复方案
1. 结构拆分：外层 `.product-scroll`（固定高度 510px + overflow-y: auto）→ 内层 `.product-grid`（display: grid，自然撑开）
2. 每页商品数从 8 改为 12

### 反思 & 教训
- **不要在 grid/flex 容器上直接设固定高度来做滚动**，这是 CSS 布局的基本常识。grid/flex 会压缩子项适应容器，必须用额外的滚动包裹层
- **改完 CSS 必须验证"内容量 > 容器高度"**，否则 overflow 永远不会触发
- **每次改动后必须在浏览器中实际滚动测试**，不能只看"页面渲染了"就认为没问题
- 这个 bug 反复出现 3 次（max-height 420→320→55vh→510px），说明没有抓住根因就反复调数值是无效的，必须先理解布局机制

---

## Bug #2：onScroll 绑定错误（已修复）

### 问题描述
滚动商品列表时，节流回调不执行，日志面板没有任何滚动检测输出。

### 根本原因
`onScroll` 直接绑定了 `throttledScroll` 而不是 `handleScroll`，导致原始滚动计数和节流开关逻辑被跳过。

### 修复方案
`onScroll={handleScroll}`，在 handleScroll 内部根据 throttleEnabled 决定调用 throttledScroll 还是直接调用 checkScrollBottom。

### 反思
- 绑定事件处理函数时，要确认绑的是"入口函数"而不是"内部实现函数"

---

## Bug #3：缺少 calcColumns 函数（已修复）

### 问题描述
编译报错，calcColumns 未定义。

### 根本原因
resize 防抖回调中使用了 calcColumns，但忘记在组件外部定义这个工具函数。

### 修复方案
在 App.tsx 顶部、组件外部定义 `calcColumns(width: number): number`。

### 反思
- 写代码时引用的函数必须确保已定义，不能"先用后补"然后忘记补

---

## Bug #4：useDebounce 泛型类型不兼容（已修复）

### 问题描述
TypeScript 编译报错，useDebounce 的泛型参数推断失败。

### 根本原因
useDebounce 的回调签名用了具体的泛型约束，但实际传入的 async 函数参数类型不匹配。

### 修复方案
回调签名改为 `(...args: unknown[]) => void`，内部用 `as` 断言取值。

### 反思
- 自定义 Hook 的泛型设计要考虑实际使用场景，过度约束反而导致类型推断失败
- 面试项目中，类型安全和实用性要平衡，不要为了"完美泛型"增加复杂度

---

## Bug #5：React key 重复警告（Encountered two children with the same key）

### 问题描述
控制台大量红色警告："Encountered two children with the same key, '33'"，滚动加载多页后出现。

### 根本原因
React 18+ StrictMode 下 `useEffect` 会执行两次（mount → unmount → mount），导致 `loadProducts` 被调用两次。第二次调用时 `loadingRef.current` 已被第一次重置为 false，于是同一页数据被追加两次，产生重复 id 的商品。

### 修复方案
`setProducts` 追加时按 id 去重：
```ts
const existingIds = new Set(prev.map((item) => item.id));
const newItems = data.filter((item) => !existingIds.has(item.id));
return [...prev, ...newItems];
```

### 反思
- StrictMode 双调用是 React 18+ 的特性，写 useEffect 里的异步操作必须考虑幂等性
- 列表追加数据时，永远要做去重保护，不能假设"不会重复调用"

---

## 通用反思清单

| 序号 | 教训 | 检查点 |
|------|------|--------|
| 1 | grid/flex 容器不能直接做滚动容器 | 需要滚动时，必须用额外包裹层 |
| 2 | 改 CSS 高度后必须验证内容是否溢出 | 打开浏览器，实际滚动测试 |
| 3 | 不要反复调数值碰运气 | 先理解布局机制，再动手改 |
| 4 | 事件绑定要绑入口函数 | 检查 onXxx 绑定的是哪个函数 |
| 5 | 引用的函数/变量必须已定义 | 写完后全局搜索确认 |
| 6 | 泛型设计要匹配实际使用 | 先写调用代码，再设计泛型 |
