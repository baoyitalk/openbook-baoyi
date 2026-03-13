# Bug 清单

## Bug #1：暴力渲染耗时显示异常（82896ms）
- 现象：搜索过滤后，暴力渲染耗时显示几万毫秒
- 根因：`startTimeRef` 只在组件首次挂载时记录一次，后续 data 变化没有重置，导致计算的是从首次挂载到当前的总时间
- 修复：每次渲染时重置 `startTimeRef.current = performance.now()`，useEffect 中计算差值才是真实的单次渲染耗时
- 反思：性能计时要在正确的时机重置起点

---

## Bug #2：VirtualList 计时只测首次渲染，搜索时数据不更新
- 现象：虚拟列表显示"首次渲染 316.5ms"，14 条 DOM 比暴力渲染 10000 条的 541ms 还慢，搜索后数据不变
- 根因：`useEffect(, [])` 空依赖，只在首次挂载时计时一次，后续 data 变化不会重新计时
- 修复：改为 `useEffect(, [data])`，每次 data 变化都重新计时，和 BruteList 统一逻辑
- 反思：对比组件的计时逻辑必须统一，否则数据没有可比性

---

## Bug #3：滚动帧耗时指标反而暴力渲染更低
- 现象：加了滚动帧耗时后，暴力渲染 0.4ms vs 虚拟列表 0.9ms，暴力渲染看起来更好
- 根因：暴力渲染滚动时不触发 React 重渲染，浏览器只做原生 CSS 滚动；虚拟列表滚动时要 setState → 重新计算 → React 重渲染
- 修复：去掉滚动帧耗时指标，保留渲染耗时（861ms vs 12ms）和 DOM 节点数（10000 vs 19）作为核心对比
- 反思：选指标要选能体现优势的维度。虚拟列表的优势在初始渲染速度和内存占用，不在滚动帧耗时

---

## Bug #4：VirtualList 渲染耗时包含了 BruteList 的渲染时间（计时污染）
- 现象：VirtualList 只渲染 ~20 个 DOM 节点，但显示渲染耗时 448ms，和 BruteList 的 10000 个 DOM 耗时几乎一样
- 根因：`startTimeRef.current = performance.now()` 写在组件函数体顶部，App 重渲染时两个子组件函数体依次执行，但 `useEffect` 在**所有组件 DOM commit 完成后**才统一执行。VirtualList 的 useEffect 测到的时间差 = 自己函数体执行 → 所有组件 DOM commit 完成，包含了 BruteList 渲染 10000 个 DOM 的时间
- 复现步骤：
  1. 打开页面，观察 VirtualList 渲染耗时
  2. VirtualList 只有 ~20 个 DOM 节点，但耗时显示 400ms+，和 BruteList 几乎一样
  3. 注释掉 BruteList 组件后，VirtualList 耗时降到 <10ms，证明计时被污染
- 修复方案：使用 `React.Profiler` 组件的 `onRender` 回调精确测量每个组件自己的渲染耗时，这是 React 官方提供的精确计时方式，不会被同一渲染周期内其他组件的 DOM 操作污染
- 反思：`useEffect` 的执行时机是所有组件 DOM 更新完成后，不适合用来测量单个组件的渲染耗时；`React.Profiler` 的 `actualDuration` 才是精确的单组件渲染耗时

---

## Bug #5：Profiler onRender 中直接 setState 导致无限循环（Maximum update depth exceeded）
- 现象：同时渲染 BruteList + VirtualList（5000 条数据）时，报错 `Maximum update depth exceeded`，页面崩溃
- 根因：Profiler 的 `onRender` 回调中直接调用 `setRenderTime(actualDuration.toFixed(1))`，形成同步死循环：
  - onRender 触发 → `setRenderTime` → 组件 re-render → Profiler 再次触发 onRender → `setRenderTime` → 无限循环
  - `actualDuration` 每次渲染都是不同的数值，所以 `prev === val` 的去重也无法打破循环
- 修复方案：用 `queueMicrotask` 将 `setState` 延迟到微任务队列执行，打破 Profiler onRender → setState → re-render 的同步调用链
  ```js
  const handleRender = useCallback((_id, phase, actualDuration) => {
    const val = actualDuration.toFixed(1);
    queueMicrotask(() => setState(val));
  }, []);
  ```
- 反思：Profiler 的 onRender 回调在 React commit 阶段同步执行，在里面直接 setState 等于在 commit 阶段触发新的更新，必然死循环。任何在 commit 阶段的回调（onRender、ref callback 等）中做 setState 都要异步化

---

## Bug #6：组件渲染互相污染 — 滚动 VirtualList 触发 BruteList 重渲染（1052 次）
- 现象：滚动虚拟列表时，暴力渲染面板的 Profiler 显示被触发了 1052 次更新渲染，两个组件不独立
- 根因：
  1. App 中 FPS 计时器每秒 `setFps` → App 重渲染 → 两个子组件都重渲染
  2. `fps` 作为 prop 传入子组件，每秒变化导致子组件 props 变化，即使 `data` 和 `itemHeight` 没变
  3. 每次父组件重渲染都会触发子组件的 Profiler 回调，产生额外的异步 setState
- 修复方案：
  1. 移除 `fps` prop — FPS 已在 App 顶部搜索栏显示，无需重复传入子组件
  2. 用 `React.memo` 包裹 BruteList 和 VirtualList，只在 `data` 或 `itemHeight` 真正变化时才重渲染
  3. 这样 App 因 FPS 更新重渲染时，memo 会浅比较 props，发现 data/itemHeight 没变就跳过子组件渲染
- 反思：
  1. 父组件的高频 state 更新（如 FPS 计时器）会导致所有未 memo 的子组件无意义重渲染
  2. 对比演示组件必须互相独立，不能因为一个组件的操作影响另一个的渲染统计
  3. 不要把全局指标（FPS）作为 prop 传入局部组件，应该在全局位置统一展示

---

## Bug #7：Profiler onRender + queueMicrotask 形成异步无限循环
- 现象：页面加载后，BruteList 的 Profiler 不断触发更新渲染（React DevTools 显示 7+ 次 commit），组件永远在重渲染
- 根因：`queueMicrotask(() => setState(val))` 虽然打破了 Bug #5 的同步死循环，但形成了异步循环：
  - onRender 触发 → queueMicrotask → setState(新的 actualDuration) → 组件 re-render → onRender 再次触发 → queueMicrotask → setState(又一个不同的 actualDuration) → 无限循环
  - 每次渲染的 `actualDuration` 都不同（因为渲染内容/时机不同），所以 setState 永远设置新值，永远触发重渲染
- 修复方案：用 `dataChangedRef` 在渲染阶段检测 data 是否真正变化
  ```js
  const prevDataRef = useRef(data);
  const dataChangedRef = useRef(false);
  // 渲染阶段检测（在 onRender 之前执行）
  if (prevDataRef.current !== data) {
    prevDataRef.current = data;
    dataChangedRef.current = true;
  }
  // onRender 中只在 mount 或 data 变化时 setState
  if (phase === "mount") { ... }
  else if (dataChangedRef.current) {
    dataChangedRef.current = false;
    queueMicrotask(() => setUpdateTime(val));
  }
  ```
- 反思：`queueMicrotask` 只能打破同步循环，不能打破异步循环。必须从语义上判断"这次渲染是否值得记录"，而不是无脑每次都 setState

---

## Bug #8：filteredData 未 memoize，React.memo 被击穿
- 现象：搜索状态下（filterText 非空），FPS 每秒更新触发 App 重渲染，`contacts.filter(...)` 每次返回新数组引用，子组件的 `React.memo` 浅比较失败，BruteList 和 VirtualList 仍然被无意义重渲染
- 根因：`filteredData` 在组件函数体内直接计算，没有用 `useMemo` 缓存。当 `filterText` 不变但 App 因 FPS 更新重渲染时，`filter()` 返回新引用 → `React.memo` 的 `data` prop 浅比较不等 → 子组件重渲染
- 修复：用 `useMemo(() => ..., [filterText])` 包裹 filteredData 计算，保证 filterText 不变时返回同一引用
- 反思：`React.memo` 只做浅比较，如果父组件每次渲染都创建新的对象/数组引用作为 prop，memo 就形同虚设。传给 memo 组件的 prop 必须保证引用稳定（useMemo / useCallback）

---

## Bug #9：FPS 计时器在 App 中导致 App 每秒重渲染，污染子组件
- 现象：即使没有任何用户操作，App 每秒因 `setFps` 重渲染一次，子组件的 Profiler 不断被触发
- 根因：FPS 用 `useState` + `useEffect` + `requestAnimationFrame` 实现在 App 中，`setFps` 每秒触发 App 重渲染，即使子组件有 `React.memo`，也会因为 `filteredData` 引用变化（Bug #8）或其他 prop 变化而被击穿
- 修复方案：将 FPS 从 App 的 hook 改为独立的 `FpsBadge` 组件，放在各子组件（BruteList / VirtualList）内部。`setFps` 只触发 `FpsBadge` 自身重渲染，不影响父组件和兄弟组件
- 反思：高频 setState（如 FPS、动画计数器）绝不能放在父组件中，否则会导致整棵子树重渲染。应该用独立组件隔离 state 更新的影响范围

---

## Bug #10：更新渲染耗时始终显示 0ms（搜索后不更新）
- 现象：搜索过滤后，"更新渲染"始终显示 0ms，没有记录到实际的更新渲染耗时
- 根因：Bug #7 的修复方案 `dataChangedRef` 在渲染阶段（函数体）设置 `dataChangedRef.current = true`，但在 React 并发模式下，渲染阶段可能被中断/丢弃，ref 变异可能被"幽灵渲染"污染——渲染阶段设了 true，但该渲染被丢弃，onRender 不执行，下次真正渲染时 ref 状态已经不对
- 修复方案：改用 `currentDataRef` + `lastRecordedDataRef` 双 ref 方案，在 onRender 回调（commit 阶段）中比较：
  ```js
  const currentDataRef = useRef(data);
  currentDataRef.current = data; // 幂等赋值，并发安全
  const lastRecordedDataRef = useRef(null);
  
  // onRender 中比较
  if (phase === "mount") {
    lastRecordedDataRef.current = currentDataRef.current;
    queueMicrotask(() => setMountTime(val));
  } else if (currentDataRef.current !== lastRecordedDataRef.current) {
    lastRecordedDataRef.current = currentDataRef.current;
    queueMicrotask(() => setUpdateTime(val));
  }
  ```
- 反思：渲染阶段（函数体）的 ref 变异在并发模式下不可靠，因为渲染可能被丢弃。应该在 commit 阶段（onRender、useEffect、ref callback）中做状态判断和变异

---

## Bug #11：FpsBadge 组件放在 `.js` 文件中导致构建失败
- 现象：`vite build` 报错 `ParseError`，指向 `useFps.js` 第 28 行的 JSX `<span>`
- 根因：`FpsBadge` 从 hook 重构为组件后包含 JSX，但文件扩展名仍是 `.js`。Vite 的 Rollup 默认只对 `.jsx` 文件启用 JSX 转换
- 修复：将 `src/hooks/useFps.js` 移动到 `src/components/FpsBadge.jsx`，更新 BruteList 和 VirtualList 的 import 路径
- 反思：包含 JSX 的文件必须用 `.jsx` 扩展名，这是 Vite/esbuild 的默认约定。重构时改变了文件内容的性质（hook → 组件），要同步更新文件位置和扩展名

---

## Bug #12：虚拟列表滚动时"更新渲染"始终 0ms + 渲染场景命名混乱
- 现象：虚拟列表滚动时，"更新渲染"始终显示 0ms，但实际上每次滚动都触发了 React 重渲染
- 根因：
  1. `handleRender` 中只检测 `data` 引用变化，滚动时 data 没变（同一数组引用），所以被跳过
  2. "更新渲染"这个名字含糊不清——搜索和滚动都是 Profiler 的 `"update"` phase，但触发源不同，应该区分
- 修复方案：
  1. 将"更新渲染"拆为"搜索渲染"和"滚动渲染"两个独立指标
  2. 搜索渲染：data 引用变化时记录（和之前逻辑一样）
  3. 滚动渲染：data 没变但触发了 update → 用 ref 暂存最新 actualDuration + 500ms 防抖后 setState
  4. 暴力渲染的滚动渲染显示 "N/A"（纯 CSS 滚动，不触发 React 重渲染）
- 防抖原因：滚动是高频事件，每帧都可能触发 onRender，如果每次都 setState 会形成异步循环（和 Bug #7 一样）。500ms 防抖确保滚动停止后才更新 UI，显示最后一次滚动渲染的耗时
- 反思：
  1. 性能指标的命名要精确，"更新渲染"太笼统，面试时说不清楚
  2. 不同触发源的渲染要分开计量，否则会遗漏重要的性能数据
  3. 高频场景（滚动）的 Profiler 数据不能直接 setState，必须防抖或节流

---

## Bug #13：onScroll 无节流，每次滚动事件都 setState
- 现象：快速滚动时，每个 scroll 事件都触发 `setScrollTop`，一帧内可能触发多次无意义的 setState + re-render
- 根因：`useVirtualList` 的 `onScroll` 直接 `setScrollTop(e.currentTarget.scrollTop)`，没有任何节流
- 修复：用 `requestAnimationFrame` 节流，每帧最多 setState 一次：
  ```js
  const onScroll = useCallback((e) => {
    pendingScrollTopRef.current = e.currentTarget.scrollTop;
    if (rafIdRef.current) return; // 已有 rAF 排队，跳过
    rafIdRef.current = requestAnimationFrame(() => {
      setScrollTop(pendingScrollTopRef.current);
      rafIdRef.current = null;
    });
  }, []);
  ```
- 反思：滚动是高频事件（一帧可能触发多次），rAF 节流比 setTimeout 更合适，因为 rAF 和浏览器渲染帧对齐

---

## Bug #14：不支持动态高度，只能固定 itemHeight
- 现象：所有列表项高度必须相同，无法处理不同高度的行
- 根因：`useVirtualList` 只接受固定 `itemHeight`，startIndex 用简单除法计算
- 修复：新增 `getItemHeight(index)` 参数，用前缀和数组 `prefixHeights[]` 预计算累计高度，二分查找定位 startIndex：
  ```js
  // 前缀和：O(n) 预处理
  const prefixHeights = useMemo(() => {
    const arr = new Array(data.length + 1);
    arr[0] = 0;
    for (let i = 0; i < data.length; i++)
      arr[i + 1] = arr[i] + getItemHeight(i);
    return arr;
  }, [data, getItemHeight]);
  
  // 二分查找：O(log n) 定位
  const findStartIndex = (scrollTop) => { /* 二分 prefixHeights */ };
  ```
- 反思：动态高度是虚拟列表面试高频考点，前缀和 + 二分查找是标准解法

---

## Bug #15：无 scrollToIndex API，缺少滚动定位能力
- 现象：无法编程式跳转到指定索引位置
- 根因：hook 没有暴露 containerRef 和滚动定位方法
- 修复：hook 返回 `scrollToIndex(index)` 和 `containerRef`，VirtualList 增加"回到顶部"按钮演示
- 反思：scrollToIndex 是虚拟列表的基础 API，面试时经常被追问实现方式

---

## Bug #16：VirtualList scrollDebounceRef 未在 unmount 时清理
- 现象：组件卸载后 setTimeout 回调仍可能执行，尝试 setState 已卸载的组件
- 根因：`scrollDebounceRef` 的 setTimeout 没有在 useEffect cleanup 中清除
- 修复：增加 `useEffect(() => () => clearTimeout(scrollDebounceRef.current), [])`
- 反思：所有异步操作（setTimeout、rAF、fetch）都必须在 unmount 时清理，这是 React 资源管理的基本要求

---

## 通用反思清单
1. 改代码前先理解现有逻辑
2. 每次只改一个点，改完验证
3. 面试项目不要搞太复杂
4. 高频 setState 要用独立组件隔离，不能放在父组件
5. 渲染阶段的 ref 变异在并发模式下不可靠，状态判断应在 commit 阶段
6. 重构改变文件性质时，同步更新文件扩展名和位置
7. 性能指标命名要精确，不同触发源的渲染要分开计量
8. 滚动节流用 rAF 而非 setTimeout，和浏览器渲染帧对齐
9. 动态高度用前缀和 + 二分查找，是面试标准解法
10. 所有异步操作（setTimeout/rAF/fetch）必须在 unmount 时清理
