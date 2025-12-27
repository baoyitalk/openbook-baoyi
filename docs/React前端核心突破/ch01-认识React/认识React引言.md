## 第一性原理拆解：React 认识篇

### 核心问题：React 是什么？为什么选择它？

---

## 一、编程范式基础

### 声明式 vs 命令式

```
┌─────────────────────────────────────────────────────────┐
│  命令式（HOW）：告诉计算机怎么做                         │
│  声明式（WHAT）：告诉计算机想要什么                      │
└─────────────────────────────────────────────────────────┘
```

```javascript
// 命令式：一步步告诉怎么做
const arr = [1, 2, 3, 4, 5];
const doubled = [];
for (let i = 0; i < arr.length; i++) {
    doubled.push(arr[i] * 2);
}

// 声明式：只描述想要什么
const doubled = arr.map(x => x * 2);
```

**React 是声明式的**：你只需描述 UI 应该是什么样子，React 负责怎么更新 DOM。

```jsx
// 声明式 UI
function App({ count }) {
    return <div>Count: {count}</div>;
}
// 你不需要写：当 count 变化时，找到 div，更新它的 textContent...
```

### 函数式编程

```
┌─────────────────────────────────────────────────────────┐
│  函数式编程特点：                                        │
│  • 纯函数：相同输入 → 相同输出，无副作用                 │
│  • 不可变数据：不直接修改数据，返回新数据                │
│  • 函数是一等公民：可作为参数和返回值                    │
└─────────────────────────────────────────────────────────┘
```

```javascript
// 纯函数
const add = (a, b) => a + b;  // 相同输入永远返回相同结果

// 不可变更新
const newState = { ...state, count: state.count + 1 };  // 不修改原对象

// 高阶函数
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);  // map 接收函数作为参数
```

**React 推崇函数式**：组件是纯函数，props 输入 → UI 输出。

---

## 二、什么是 React？

```
┌─────────────────────────────────────────────────────────┐
│  React = 用于构建用户界面的 JavaScript 库                │
├─────────────────────────────────────────────────────────┤
│  核心特点：                                              │
│  • 声明式 UI：描述目标状态，自动更新                     │
│  • 组件化：UI 拆分为独立、可复用的组件                   │
│  • Virtual DOM：高效更新真实 DOM                         │
│  • 单向数据流：数据从父流向子                            │
│  • Learn Once, Write Anywhere：Web/Native/Server        │
└─────────────────────────────────────────────────────────┘
```

---

## 三、MVC vs MVVM

### MVC（Model-View-Controller）

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│     用户操作                                             │
│        ↓                                                │
│   ┌─────────┐     更新      ┌─────────┐                │
│   │  View   │ ←────────────│  Model  │                 │
│   └─────────┘               └─────────┘                │
│        ↓                         ↑                      │
│        └───→ Controller ─────────┘                      │
│                                                         │
└─────────────────────────────────────────────────────────┘

• Model：数据和业务逻辑
• View：用户界面
• Controller：处理用户输入，协调 Model 和 View
```

### MVVM（Model-View-ViewModel）

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ┌─────────┐  双向绑定  ┌───────────┐      ┌─────────┐│
│   │  View   │ ←───────→ │ ViewModel │ ←──→ │  Model  ││
│   └─────────┘            └───────────┘      └─────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘

• ViewModel：View 的抽象，负责数据绑定
• 数据变化自动更新视图，视图变化自动更新数据
```

### 对比

| 特性 | MVC | MVVM |
|------|-----|------|
| 数据流向 | 单向/手动 | 双向自动绑定 |
| View 更新 | Controller 操作 | 自动同步 |
| 代表框架 | 传统后端框架 | Vue (双向)、React (单向) |

**注意**：React 严格来说不是 MVVM，它是单向数据流 + 声明式视图。

---

## 四、React vs Vue vs Angular

### 相同点

```
• 支持 Virtual DOM
• 组件化开发
• 响应式/声明式 UI
• 核心库与路由、状态管理分离
• 支持 JSX 或模板
```

### 核心差异

| 特性 | React | Vue | Angular |
|------|-------|-----|---------|
| 定位 | 库（只做UI） | 渐进式框架 | 完整框架 |
| 语法 | JSX（JS为主） | 模板（HTML为主） | 模板 + TypeScript |
| 数据绑定 | 单向 | 双向可选 | 双向 |
| 状态管理 | 社区（Redux等） | Vuex/Pinia | Service + 依赖注入 |
| 学习曲线 | 中等 | 低 | 高 |
| 渲染优化 | 手动（memo等） | 自动依赖追踪 | 脏检查 + 变更检测 |

### 代码对比

```jsx
// React - JSX，一切皆 JS
function Counter() {
    const [count, setCount] = useState(0);
    return (
        <button onClick={() => setCount(count + 1)}>
            {count}
        </button>
    );
}
```

```vue
<!-- Vue - 模板语法，更接近 HTML -->
<template>
    <button @click="count++">{{ count }}</button>
</template>
<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>
```

```typescript
// Angular - 装饰器 + TypeScript
@Component({
    selector: 'app-counter',
    template: `<button (click)="increment()">{{ count }}</button>`
})
export class CounterComponent {
    count = 0;
    increment() { this.count++; }
}
```

---

## 五、React 的优缺点

### 优点

```
✅ 声明式 UI，代码可预测，易调试
✅ 组件化，复用性强
✅ Virtual DOM，性能好
✅ 生态丰富，社区活跃
✅ 跨平台（React Native）
✅ 灵活，与现有项目易整合
```

### 缺点

```
❌ 只是 UI 库，路由/状态管理需要社区方案
❌ 约束少，代码风格容易不统一
❌ JSX 学习成本
❌ setState 异步更新，需要理解批量更新机制
❌ 手动优化（memo, useCallback 等）
```

---

## 六、React 18 新特性

### 1. 新的 Root API

```jsx
// React 17
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// React 18
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### 2. 自动批量更新（Automatic Batching）

```jsx
// React 17：异步函数中不会批量更新
setTimeout(() => {
    setCount(c => c + 1);  // 触发一次渲染
    setFlag(f => !f);       // 又触发一次渲染
}, 1000);

// React 18：自动批量更新
setTimeout(() => {
    setCount(c => c + 1);
    setFlag(f => !f);       // 只触发一次渲染！
}, 1000);

// 如果需要立即更新
import { flushSync } from 'react-dom';
flushSync(() => setCount(c => c + 1));  // 立即渲染
flushSync(() => setFlag(f => !f));       // 立即渲染
```

### 3. startTransition（过渡更新）

```jsx
import { startTransition, useState } from 'react';

function App() {
    const [input, setInput] = useState('');
    const [list, setList] = useState([]);
    
    const handleChange = (e) => {
        // 紧急更新：用户输入
        setInput(e.target.value);
        
        // 非紧急更新：可以被中断
        startTransition(() => {
            setList(generateList(e.target.value));  // 大量计算
        });
    };
    
    return (
        <>
            <input value={input} onChange={handleChange} />
            <List items={list} />
        </>
    );
}
```

### 4. Suspense 支持 SSR

```jsx
// React 18：SSR 中可以使用 Suspense
import { Suspense, lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <HeavyComponent />
        </Suspense>
    );
}
```

### 5. useId（生成唯一 ID）

```jsx
import { useId } from 'react';

function Form() {
    const id = useId();
    return (
        <>
            <label htmlFor={id}>Name:</label>
            <input id={id} />
        </>
    );
}
```

### 6. useDeferredValue

```jsx
import { useDeferredValue, useState } from 'react';

function App() {
    const [input, setInput] = useState('');
    const deferredInput = useDeferredValue(input);
    
    return (
        <>
            <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
            />
            {/* 使用延迟值，不阻塞输入 */}
            <List query={deferredInput} />
        </>
    );
}
```

---

## 七、项目文件结构

### 按功能/路由组织（推荐）

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.js
│   ├── dashboard/
│   └── settings/
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── App.js
```

### 按类型组织

```
src/
├── components/
├── pages/
├── hooks/
├── services/
├── store/
├── utils/
└── App.js
```

---

## 总结

```
┌─────────────────────────────────────────────────────────────────┐
│                    React 认识篇总结                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  编程范式                                                       │
│  ├── 声明式：描述"是什么"，而非"怎么做"                         │
│  └── 函数式：纯函数 + 不可变数据 + 函数是一等公民               │
│                                                                 │
│  React 核心                                                     │
│  ├── UI 库，专注视图层                                          │
│  ├── 组件化 + 声明式 + Virtual DOM                              │
│  └── 单向数据流                                                 │
│                                                                 │
│  框架对比                                                       │
│  ├── React：灵活，JSX，手动优化                                 │
│  ├── Vue：渐进式，模板，自动追踪                                │
│  └── Angular：完整框架，TypeScript，学习曲线高                  │
│                                                                 │
│  React 18 重点                                                  │
│  ├── createRoot：新的渲染入口                                   │
│  ├── 自动批量更新：异步中也批量                                 │
│  ├── startTransition：区分紧急/非紧急更新                       │
│  ├── Suspense SSR：服务端渲染支持                               │
│  └── useId / useDeferredValue：新 Hooks                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**核心记忆：React 是声明式 UI 库，组件化 + Virtual DOM + 单向数据流，React 18 重点是并发渲染。**