---
tags:
  - 资深全栈面试
---
## React 合成事件（SyntheticEvent）— 第一性原理拆解

---

### 一句话定义

你在 React 里写的 `onClick`、`onChange`、`onScroll` 拿到的事件对象，**不是浏览器原生的 Event**，而是 React 自己包了一层的 **SyntheticEvent**。

---

### 为什么要包一层？

浏览器之间事件 API 有差异（尤其早期 IE vs Chrome vs Firefox）。React 的思路：

> 我帮你抹平差异，你写一套代码，所有浏览器都能跑。

```
你写的代码                    React 内部                    浏览器
─────────                   ──────────                   ────────
onClick={handleClick}  →  SyntheticEvent 包装层  →  原生 DOM Event
                          （统一接口、跨浏览器）
```

---

### 合成事件 vs 原生事件 对比

| 维度 | 原生事件 (Native Event) | 合成事件 (SyntheticEvent) |
|------|----------------------|--------------------------|
| **绑定方式** | `el.addEventListener('click', fn)` | `<div onClick={fn}>` |
| **绑定位置** | 直接绑在目标 DOM 元素上 | React 17+ 绑在 **root 容器**上（事件委托） |
| **事件对象** | 浏览器原生 `Event` | React 包装的 `SyntheticEvent` |
| **跨浏览器** | 各浏览器有差异 | React 抹平差异，API 统一 |
| **事件池** | 无 | React 16 有事件池复用（React 17 已移除） |
| **阻止冒泡** | `e.stopPropagation()` 阻止 DOM 冒泡 | `e.stopPropagation()` 阻止 React 合成事件冒泡，**不影响原生** |
| **获取原生事件** | 就是它自己 | `e.nativeEvent` |
| **执行顺序** | 先执行（在目标元素上） | 后执行（因为委托在 root 上） |

---

### 事件委托机制 — ASCII 图

```
原生事件绑定（传统方式）：每个元素各绑一个监听器
┌──────────────────────────────┐
│  <ul>                        │
│    <li onclick="fn1">A</li>  │  ← 监听器1
│    <li onclick="fn2">B</li>  │  ← 监听器2
│    <li onclick="fn3">C</li>  │  ← 监听器3
│    ... 10000个li = 10000个监听器 😱
│  </ul>                       │
└──────────────────────────────┘

React 合成事件（事件委托）：只在 root 上绑一个监听器
┌──────────────────────────────┐
│  <div id="root">  ← 唯一监听器（捕获所有事件）
│    <ul>                      │
│      <li>A</li>              │  ← 无监听器
│      <li>B</li>              │  ← 无监听器
│      <li>C</li>              │  ← 无监听器
│      ... 10000个li，0个监听器 ✅
│    </ul>                     │
│  </div>                      │
└──────────────────────────────┘

点击 li 时的流程：
  1. 原生事件冒泡到 root
  2. React 根据 event.target 找到对应的 Fiber 节点
  3. 沿 Fiber 树向上收集所有 onClick 处理函数
  4. 创建 SyntheticEvent，依次调用收集到的处理函数
```

万人通讯录 10000 个列表项，如果用原生事件要绑 10000 个监听器。React 事件委托只需 1 个。

---

### 执行顺序的坑（面试常问）

```jsx
useEffect(() => {
  document.getElementById('btn').addEventListener('click', () => {
    console.log('原生事件');  // ① 先执行
  });
}, []);

return <button id="btn" onClick={() => {
  console.log('合成事件');    // ② 后执行
}}>点我</button>
```

输出顺序：`原生事件` → `合成事件`

原因：原生监听器直接绑在 button 上，冒泡到 button 时就触发了。合成事件委托在 root 上，要等冒泡到 root 才触发。

---

### 在咱们项目中的体现

```jsx
// VirtualList.jsx 的 onScroll
<div className="list-container" onScroll={onScroll}>
```

这个 `onScroll` 就是合成事件。React 实际上在 root 容器上监听 scroll，当事件冒泡上来后，React 找到对应 Fiber，创建 SyntheticEvent，调用你的 `onScroll` 处理函数。

搜索框的 `onChange` 也一样：

```jsx
<input onChange={(e) => setKeyword(e.target.value)} />
```

这里的 `e` 是 SyntheticEvent，`e.target` 是 React 帮你保留的引用，`e.nativeEvent` 才是浏览器原生的 InputEvent。

---

### 面试话术

> "React 的合成事件是对原生事件的跨浏览器封装。核心机制是事件委托——React 17 之后把所有事件监听器绑在 root 容器上而不是每个 DOM 元素上，通过 event.target 和 Fiber 树定位到具体组件，再创建 SyntheticEvent 分发。好处是减少内存占用（万级列表只需一个监听器）、统一 API、方便 React 控制事件优先级。需要注意的是合成事件和原生事件混用时的执行顺序问题——原生先触发，合成后触发，stopPropagation 互不影响。"