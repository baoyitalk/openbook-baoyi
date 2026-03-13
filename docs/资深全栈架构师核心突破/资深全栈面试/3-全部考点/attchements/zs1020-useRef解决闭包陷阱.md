---
tags:
  - 资深全栈面试
---


好，从最底层开始拆。

**第一步：什么是闭包？**

函数能记住它被创建时所在的环境（变量）。就这么简单。
闭包环境inner函数不仅捕获还锁住了外层outer函数作用域的变量count，而且记住的时第一次创建时的所在环境的变量

```js
function outer() {
  let count = 0;          // outer 的局部变量
  function inner() {
    console.log(count);   // inner 能访问 count —— 这就是闭包
  }
  return inner;
}

const fn = outer();
fn(); // 0  —— outer 已经执行完了，但 fn 还能访问 count
```

^29jn85

`inner` 函数"关住"了 `count` 这个变量，即使 `outer` 执行完了，`count` 也不会被垃圾回收。这个"关住"就是闭包（closure = 封闭）。

**第二步：为什么会变成"陷阱"？**

闭包记住的是**创建那一刻**的变量值，不会自动更新。

```js
let count = 0;

const fn = () => {
  console.log(count);  // fn 闭包捕获了 count
};

setTimeout(fn, 1000);  // 1秒后执行 fn

count = 5;             // 在这1秒内 count 变了
// 1秒后打印：5 ✅ —— 这里没问题，因为 count 是同一个引用
```

上面没问题，因为 `count` 是外层作用域的同一个变量。但 React 函数组件不一样：

**第三步：React 函数组件的特殊性**

React 每次渲染，都会**重新执行**整个函数组件，产生**全新的局部变量**：

```js
function App() {
  const [count, setCount] = useState(0);
  // 每次渲染，这里的 count 都是一个全新的常量
  // 第1次渲染：count = 0
  // 第2次渲染：count = 1
  // 第3次渲染：count = 2
  // 它们是不同的变量！

  const handleClick = () => {
    setTimeout(() => {
      console.log(count);  // 闭包捕获的是"这次渲染"的 count
    }, 3000);
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

操作流程：
1. count=0 时点击按钮 → `setTimeout` 里的闭包捕获了 count=0
2. 快速点 3 次 setCount → count 变成 3，组件重渲染了 3 次
3. 3 秒后 `setTimeout` 执行 → 打印 **0**，不是 3

这就是**闭包陷阱**：`setTimeout` 的回调函数记住的是它被创建时那次渲染的 `count`（值为 0），而不是最新的 `count`（值为 3）。

**第四步：为什么防抖节流特别容易踩这个坑？**

防抖节流的本质就是 `setTimeout`。你传给 `setTimeout` 的回调函数，闭包捕获的永远是创建时的变量快照：

```js
// 错误写法
function useDebounce(fn, delay) {
  const debouncedFn = useCallback((...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);  // fn 是第一次渲染时传入的，闭包锁死了旧值
    }, delay);
  }, []);  // 依赖数组为空，fn 永远是第一次的
  return debouncedFn;
}
```

**第五步：useRef 为什么能解决？**

`useRef` 返回的对象在组件整个生命周期中**始终是同一个引用**，不会因为重渲染而创建新的：

```js
const ref = useRef(0);
// 第1次渲染：ref = { current: 0 }  ← 同一个对象
// 第2次渲染：ref = { current: 0 }  ← 还是同一个对象
// ref 永远是同一个盒子，你只是换盒子里的东西
```

所以解决方案：

```js
function useDebounce(fn, delay) {
  const callbackRef = useRef(fn);
  
  // 每次渲染都把最新的 fn 塞进 ref 这个"盒子"
  useEffect(() => { callbackRef.current = fn; }, [fn]);

  const debouncedFn = useCallback((...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callbackRef.current(...args);  // 从盒子里取，永远是最新的
    }, delay);
  }, [delay]);

  return debouncedFn;
}
```

**一句话总结：**

闭包陷阱 = 函数记住了旧变量 + React 每次渲染创建新变量 → 异步回调里拿到过期数据。解法是用 `useRef` 当一个不变的盒子，每次渲染往里塞最新值，回调里从盒子取。