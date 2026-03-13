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
| 7 | 条件日志在高频场景下会"消失" | 关键业务日志无条件打印 |
| 8 | 日志面板截断会丢失早期日志 | 排查时先看 DevTools Console |
| 9 | 改了日志文本要同步改匹配逻辑 | 全局搜索旧文本确认无遗漏 |
| 10 | scroll 事件是"已滚动"通知，不能阻塞滚动 | 要阻塞滚动用 wheel/touchmove + passive:false |
| 11 | 面试演示用视觉反馈比真卡顿更好 | 闪烁频率 + 统计数据 = 直观对比 |

---

## Bug #6：关闭节流后看不到曝光埋点日志

### 问题描述
切换关闭节流后滚动商品列表，日志面板只有 `[无节流] 滚动检测` 日志，看不到曝光埋点信息。

### 根本原因（两层问题叠加）

**原因 A：曝光日志有条件门槛，只打印一次就"消失"了**
- 曝光埋点日志只在 `newlyExposed.length > 0` 时才打印
- 切换时 `exposedIdsRef.current.clear()` 清空了已曝光集合，但第一次 `checkScrollBottom` 调用就把当前所有可见商品全部记录了
- 之后如果没有滚动到新商品区域，就不会有新增曝光，曝光日志就不再出现

**原因 B：无节流时日志刷屏，唯一的曝光日志被淹没**
- 关闭节流后每次 scroll 事件都执行 `checkScrollBottom`，产生大量 `滚动检测` 日志
- 唯一的一条曝光日志（第一次调用时打印的）很快被后续日志推出可视区域
- 日志面板只保留最近 50 条（`.slice(-50)`），曝光日志可能已经被截掉

**原因 C（附带）：闭包陷阱**
- `checkScrollBottom` 中的 `throttleEnabled` 是 state 值，在节流回调闭包中可能是旧值
- 已通过 `throttleEnabledRef` 修复，用 `useRef` 跟踪最新值

### 修复方案
1. 曝光日志从"有新增才打印"改为"每次都打印当前状态"（无条件打印）
2. 日志面板的高亮匹配从 `曝光埋点` 同步改为 `曝光检测`

### 反思 & 教训
- **条件日志在高频场景下容易"消失"**：如果日志只在特定条件下打印，而其他日志刷得很快，用户很容易错过。高频场景下的关键业务日志应该无条件打印
- **日志面板的 `.slice(-50)` 截断会丢失早期日志**：无节流时每秒可能产生几十条日志，50 条缓冲区几秒就满了。排查"没有日志"时，先看浏览器 DevTools Console 的原始输出
- **改了日志文本要同步改匹配逻辑**：曝光日志从 `曝光埋点` 改为 `曝光检测`，日志面板的 CSS 高亮匹配也要同步更新，否则高亮样式失效
- **排查"没有日志"时，先区分"没执行"还是"执行了但没显示"**：应该先在 DevTools Console 里看原始 console.log 输出，日志面板有过滤逻辑和截断逻辑，不能完全代表实际执行情况

---

## Bug #7：heavyCompute 无法让滚动卡顿（体感无差异）

### 问题描述
关闭节流后滚动依然丝滑，heavyCompute 50 万次循环没有起到让用户体感到"不节流 = 卡顿"的效果。

### 根本原因
**浏览器 scroll 事件默认是 passive: true**

- React 的 `onScroll` 和浏览器默认的 scroll 监听都是 passive listener
- passive: true 意味着浏览器不需要等 JS 事件处理器执行完就能继续滚动
- 滚动在合成器线程（compositor thread）处理，JS 主线程阻塞完全不影响滚动流畅度
- 所以无论 heavyCompute 循环多少次（10万、50万、500万），滚动都不会卡

### 修复方案
改用 `addEventListener` 手动绑定 scroll 事件，设置 `{ passive: false }`：

```jsx
// 去掉 JSX 上的 onScroll={handleScroll}
// 改用 useEffect 手动绑定
useEffect(() => {
  const el = listRef.current;
  if (!el) return;
  const handler = (e) => handleScrollRef.current(e);
  el.addEventListener("scroll", handler, { passive: false });
  return () => el.removeEventListener("scroll", handler);
}, []);
```

passive: false 后，浏览器必须等事件处理器执行完毕才能更新滚动位置：
- 关闭节流 → 每次 scroll 都执行 heavyCompute → 滚动明显卡顿
- 开启节流 → 300ms 一次 → 滚动流畅

### 反思 & 教训
- **理解浏览器事件模型是前端基本功**：passive listener 是浏览器性能优化的核心机制，不理解它就无法正确模拟性能问题
- **React 的 onScroll 是 passive 的**：React 17+ 对 scroll/wheel/touchmove 等事件默认使用 passive listener，无法通过 JSX 属性改变
- **要阻塞滚动必须用 passive: false**：这是唯一能让 JS 阻塞影响滚动流畅度的方式
- **之前反复调 heavyCompute 循环次数（10万→50万→500万+reflow）都是无效的**：根因不在计算量，而在事件监听模式。不理解根因就反复调参数，和 Bug #1 反复调 CSS 高度是同一个错误模式

---

## Bug #8：passive: false 对 scroll 事件无效，滚动仍然丝滑

### 问题描述
按 Bug #7 的方案改用 `addEventListener("scroll", handler, { passive: false })`，但关闭节流后滚动依然丝滑，无节流反而比有节流更流畅。

### 根本原因
**scroll 事件是在滚动已经发生后触发的，不是滚动发生前**

- `passive: false` 的作用是告诉浏览器"我可能会调用 preventDefault()"，让浏览器等 JS 执行完再决定是否滚动
- 但 `scroll` 事件本身不能被 `preventDefault()`，它是滚动位置变化后的通知事件
- 真正能阻塞滚动的是 `wheel`（鼠标滚轮）和 `touchmove`（触摸）事件 + `passive: false`
- 所以对 scroll 事件设 passive: false 没有任何效果

### 修复方案
**放弃"让滚动卡顿"的思路，改用视觉反馈让节流效果肉眼可见：**

1. 每次 `checkScrollBottom` 执行时，给商品列表容器加一个短暂的红色边框闪烁（80ms）
2. 无节流时：每次 scroll 都执行 → 疯狂闪烁红色（像警报灯）
3. 开启节流时：300ms 一次 → 偶尔闪一下，几乎感觉不到
4. 配合统计条数据（原始触发 200 次 vs 实际执行 5 次，节省 97%），效果直观

代码改动：
- 回退 passive: false 和 addEventListener，恢复简单的 `onScroll={handleScroll}`
- 新增 `flashActive` state + `flash-overlay` CSS class
- 每次 checkScrollBottom 执行时 setFlashActive(true)，80ms 后自动关闭

### 反思 & 教训
- **scroll 事件 ≠ wheel/touchmove 事件**：scroll 是"已滚动"的通知，wheel/touchmove 是"将要滚动"的请求。passive: false 只对后者有意义
- **面试演示不需要真的让页面卡顿**：用视觉反馈（闪烁频率）+ 数据对比（统计条）来展示节流效果，比真的卡顿更直观、更好解释
- **方案选择要考虑复杂度**：监听 wheel + passive: false 虽然能真的卡住滚动，但代码复杂（wheel 触发时 scrollTop 还没更新，需要额外处理），面试时不好解释
