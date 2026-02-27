# 为什么需要 Promise？

## 面试高频指数：⭐⭐⭐⭐⭐

---

## 一、第一性原理追问

```
Q: 为什么需要 Promise？
    ↓
A: 因为回调函数有缺陷
    ↓
Q: 为什么会有回调函数？
    ↓
A: 因为 JavaScript 单线程，需要异步
    ↓
Q: 为什么 JavaScript 是单线程？
    ↓
A: 因为操作 DOM 需要避免多线程同步问题
```

**根本原因**：JavaScript 单线程 + 需要处理耗时操作 = 必须异步

---

## 二、回调函数与异步的关系（重要澄清）

### 2.0 核心概念：回调 ≠ 异步

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    回调函数 vs 异步：两个独立概念                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   回调函数：一种编程模式（把函数作为参数传递）                            │
│   异步：一种执行方式（不阻塞主线程）                                     │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │   回调可以是同步的：  [1,2,3].map(x => x * 2)                   │   │
│   │   回调可以是异步的：  setTimeout(() => {}, 1000)                │   │
│   │                                                                 │   │
│   │   异步可以用回调：    fs.readFile(path, callback)               │   │
│   │   异步可以用Promise： fetch(url).then(...)                      │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   结论：回调是"通知机制"，异步是"执行方式"，它们可以组合使用             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 同步回调 vs 异步回调

```javascript
// 同步回调：立即执行，阻塞后续代码
const result = [1, 2, 3].map(x => {
    console.log('处理:', x);  // 立即执行
    return x * 2;
});
console.log('完成');  // 等 map 执行完才执行

// 输出顺序：处理:1 → 处理:2 → 处理:3 → 完成


// 异步回调：延迟执行，不阻塞后续代码
setTimeout(() => {
    console.log('1秒后');  // 延迟执行
}, 1000);
console.log('立即执行');  // 先执行

// 输出顺序：立即执行 → (1秒后) 1秒后
```

### 为什么异步常用回调？

```
问题：异步操作完成后，如何通知主程序？

方案一：轮询（低效）
    while (!done) { check(); }  // 浪费 CPU

方案二：回调（高效）
    doAsync(callback);  // 完成后自动调用

结论：回调是异步通知的最自然方式
```

### 关系图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                        ┌─────────────┐                                  │
│                        │   回调函数   │                                  │
│                        └──────┬──────┘                                  │
│                               │                                         │
│              ┌────────────────┼────────────────┐                        │
│              │                │                │                        │
│              ▼                ▼                ▼                        │
│       ┌──────────┐     ┌──────────┐     ┌──────────┐                   │
│       │ 同步回调  │     │ 异步回调  │     │ 事件回调  │                   │
│       └──────────┘     └──────────┘     └──────────┘                   │
│              │                │                │                        │
│              ▼                ▼                ▼                        │
│       map/filter       setTimeout        addEventListener              │
│       forEach          fs.readFile       onClick                       │
│       reduce           fetch             onLoad                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### async/await 是同步还是异步？（重要！）

**答案：async/await 是异步的，但写法看起来像同步**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    async/await 的本质                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   async/await = 异步操作 + 同步写法                                      │
│                                                                         │
│   它是"语法糖"，让异步代码看起来像同步代码，但本质还是异步！              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 证明：async/await 是异步的

```javascript
async function test() {
    console.log('1. async 函数开始');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('3. await 之后');  // 1秒后才执行
}

console.log('0. 开始');
test();
console.log('2. async 函数调用后');  // 不等 test() 完成就执行

// 输出顺序：
// 0. 开始
// 1. async 函数开始
// 2. async 函数调用后  ← 证明没有阻塞！
// (1秒后)
// 3. await 之后
```

#### 关键理解

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   同步代码：阻塞后续代码执行                                             │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  const data = syncFetch('/api');  // 假设需要3秒                │   │
│   │  console.log('后续代码');          // 3秒后才执行，页面卡死      │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   async/await：不阻塞后续代码（函数外部）                               │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  async function getData() {                                     │   │
│   │      const data = await fetch('/api');  // 等待，但不阻塞外部   │   │
│   │      console.log('函数内后续');          // 等 fetch 完成后执行  │   │
│   │  }                                                              │   │
│   │  getData();                                                     │   │
│   │  console.log('函数外后续');              // 立即执行！不等待     │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   await 只暂停 async 函数内部的执行，不阻塞主线程！                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 一句话总结

> **async/await 是异步操作的同步写法。**
> - "异步操作"：不阻塞主线程，后台执行
> - "同步写法"：代码从上到下，看起来像同步
>
> 它解决的是"异步代码难以阅读"的问题，不是把异步变成同步。

---

## 三、回调函数的三大问题

### 2.1 回调地狱（Callback Hell）

```javascript
// 需求：依次加载 Vue → React
loadScript("https://unpkg.com/vue@3/dist/vue.global.js", function (error, script) {
    if (error) {
        console.log(error);
    } else {
        console.log("loading Vue");
        loadScript("https://unpkg.com/react@18/umd/react.development.js", function (error, script) {
            if (error) {
                console.log(error);
            } else {
                console.log("loading React");
                // 继续嵌套...
            }
        });
    }
});
```

**问题**：代码横向发展，形成金字塔，难以阅读和维护。

### 2.2 控制反转（Inversion of Control）

```javascript
// 把回调交给第三方
thirdPartyLib.doSomething(data, callback);

// 你不知道：
// - 回调什么时候执行？
// - 会执行几次？
// - 会不会不执行？
```

**问题**：失去对代码执行的控制权。

### 2.3 错误处理分散

```javascript
getUser(userId, (err, user) => {
    if (err) { handleError(err); return; }
    getOrders(user.id, (err, orders) => {
        if (err) { handleError(err); return; }
        getOrderDetail(orders[0].id, (err, detail) => {
            if (err) { handleError(err); return; }
            // 错误处理代码比业务代码还多！
        });
    });
});
```

**问题**：每一层都要处理错误，代码冗余。

---

## 三、Promise 如何解决这些问题

### 3.1 链式调用解决回调地狱

```javascript
loadScript("https://unpkg.com/vue@3/dist/vue.global.js")
    .then((script) => {
        console.log("loading Vue");
        return loadScript("https://unpkg.com/react@18/umd/react.development.js");
    })
    .then((script) => console.log("loading React"))
    .catch((error) => console.log(error));
```

**优点**：代码垂直发展，线性流程，清晰易读。

### 3.2 状态容器解决控制反转

```javascript
const promise = thirdPartyLib.doSomething(data);

// 控制权在你手里
promise.then(result => {
    // 你决定怎么处理
});

// Promise 的保证：
// 1. 回调只会被调用一次
// 2. 状态一旦改变就不会再变
// 3. 即使已经 resolve，后添加的 then 也会执行
```

### 3.3 统一 catch 解决错误分散

```javascript
getUser(userId)
    .then(user => getOrders(user.id))
    .then(orders => getOrderDetail(orders[0].id))
    .catch(err => {
        // 任何一步出错都会到这里
        console.error('出错了:', err);
    });
```

---

## 四、Promise 的本质

### 4.1 状态机模型

```
           pending（等待中）
               │
    ┌──────────┴──────────┐
    ↓                     ↓
fulfilled（成功）    rejected（失败）
    │                     │
    ↓                     ↓
调用 then 的          调用 catch
第一个回调            或 then 的第二个回调
```

**关键特性**：状态只能改变一次，不可逆。

### 4.2 Promise 的构造

```javascript
const promise = new Promise(function(resolve, reject) {
    // executor 函数，立即执行

    // 成功时调用 resolve(value)
    // 失败时调用 reject(error)
});
```

### 4.3 为什么 then 能链式调用？

```javascript
// then() 返回一个新的 Promise
promise
    .then(value => {
        return newValue;  // 返回值被包装成 Promise
    })
    .then(newValue => {
        // 可以继续 then
    });
```

---

## 五、代码对比

### 回调写法

```javascript
const loadScript = (src, callback) => {
    let script = document.createElement("script");
    script.src = src;
    script.onload = () => callback(null, script);
    script.onerror = () => callback(new Error(`Script load error for ${src}`));
    document.head.append(script);
};
```

### Promise 写法

```javascript
const loadScript = (src) => {
    return new Promise(function (resolve, reject) {
        let script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.head.append(script);
    });
};
```

---

## 六、面试回答模板

> "Promise 的出现是为了解决 JavaScript 异步编程中回调函数的三大问题：
>
> 1. **回调地狱**：多层嵌套导致代码难以阅读和维护，Promise 通过链式调用让代码线性化；
>
> 2. **控制反转**：把回调交给第三方意味着失去控制权，Promise 作为状态容器让控制权回归；
>
> 3. **错误处理分散**：每层回调都要处理错误，Promise 通过错误冒泡机制实现统一的 catch 处理。
>
> 本质上，Promise 是一个代表'未来值'的状态容器，结合观察者模式，让异步代码的编写更加优雅和可控。"

---

## 七、思维导图

```
为什么需要 Promise？
│
├── 根本原因：JavaScript 单线程
│   └── 不能同步等待 I/O 操作
│
├── 直接原因：回调函数的缺陷
│   ├── 回调地狱 → 代码难以维护
│   ├── 控制反转 → 失去执行控制权
│   └── 错误分散 → 难以统一处理
│
└── Promise 的解决方案
    ├── 链式调用 → 代码线性化
    ├── 状态容器 → 控制权回归
    └── 错误冒泡 → 统一错误处理
```

---

## 八、追问：回调函数还有存在的必要吗？

### 答案：当然有！回调函数依然是 JavaScript 的基石

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    回调 vs Promise：不是替代，是演进                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   回调函数是底层机制，Promise 是上层抽象                                 │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                     async/await                                 │   │
│   │                         ↑                                       │   │
│   │                      Promise                                    │   │
│   │                         ↑                                       │   │
│   │                     回调函数  ← 底层基础                         │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.1 回调函数依然必要的场景

#### 场景一：事件监听（最常见）

```javascript
// DOM 事件必须用回调
button.addEventListener('click', function() {
    console.log('clicked!');
});

// 这里用 Promise 反而不合适，因为：
// 1. 事件可能触发多次
// 2. Promise 只能 resolve 一次
```

#### 场景二：数组方法

```javascript
// map、filter、forEach 等都是回调
const doubled = [1, 2, 3].map(x => x * 2);
const evens = [1, 2, 3, 4].filter(x => x % 2 === 0);

// 这些是同步操作，不需要 Promise
```

#### 场景三：简单的一次性异步

```javascript
// 简单场景，回调更直接
setTimeout(() => {
    console.log('1秒后');
}, 1000);

// 不需要包装成 Promise（除非要链式调用）
```

#### 场景四：Node.js 底层 API

```javascript
// Node.js 很多 API 仍然是回调风格
const fs = require('fs');
fs.readFile('file.txt', 'utf8', (err, data) => {
    // 回调风格
});

// 虽然有 fs.promises，但回调版本性能更好
```

### 8.2 什么时候用 Promise？

| 场景 | 推荐方案 | 原因 |
|------|----------|------|
| 单次事件监听 | 回调 | 简单直接 |
| 多次事件监听 | 回调 | Promise 只能 resolve 一次 |
| 数组操作 | 回调 | 同步操作，不需要 Promise |
| 多个异步串行 | Promise | 避免回调地狱 |
| 多个异步并行 | Promise.all | 统一处理结果 |
| 复杂异步流程 | async/await | 代码最清晰 |

### 8.3 本质理解

```javascript
// Promise 内部还是用回调实现的！
const promise = new Promise((resolve, reject) => {
    // resolve 和 reject 就是回调函数
    setTimeout(() => {
        resolve('done');  // 这里调用的是回调
    }, 1000);
});

// then 里面传的也是回调
promise.then(value => {
    console.log(value);  // 这个函数就是回调
});
```

### 8.4 总结

> **回调函数是 JavaScript 异步的基础设施，Promise 是建立在回调之上的抽象层。**
>
> - 回调解决的是"如何在异步完成后执行代码"
> - Promise 解决的是"如何优雅地组织多个异步操作"
>
> 它们是**互补关系**，不是**替代关系**。就像汇编语言和高级语言的关系——高级语言更好用，但底层还是汇编。

---

## 参考资料

- [Promise - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Promise - JavaScript.info](https://zh.javascript.info/promise-basics)
