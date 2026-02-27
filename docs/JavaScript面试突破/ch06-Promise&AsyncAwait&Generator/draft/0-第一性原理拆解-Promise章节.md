# 第一性原理拆解：Promise & Async/Await & Generator

## 元问题：这一章到底在解决什么问题？

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         第一性原理追问链                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Q1: 为什么需要 Promise？                                                │
│      ↓                                                                  │
│  A1: 因为回调函数有缺陷（回调地狱、控制反转、错误分散）                    │
│      ↓                                                                  │
│  Q2: 为什么会有回调函数？                                                │
│      ↓                                                                  │
│  A2: 因为 JavaScript 是单线程，需要异步处理耗时操作                       │
│      ↓                                                                  │
│  Q3: 为什么 JavaScript 是单线程？                                        │
│      ↓                                                                  │
│  A3: 因为 JS 诞生于浏览器，操作 DOM 需要避免多线程同步问题                │
│                                                                         │
│  ═══════════════════════════════════════════════════════════════════   │
│                                                                         │
│  根本原因：单线程 + 需要处理耗时操作 = 必须异步                           │
│  核心矛盾：异步代码的可读性、可控性、可维护性                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 一、知识点拓扑图：本章五个主题的关系

```
                    ┌─────────────────┐
                    │   异步编程问题   │
                    │  （回调地狱）    │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │         Promise              │
              │   （状态容器 + 链式调用）     │
              └──────────────┬───────────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │  Iterator   │   │  Generator  │   │ async/await │
    │ （迭代协议） │   │ （可暂停函数）│   │（语法糖）   │
    └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
           │                 │                 │
           └─────────────────┼─────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   实战应用      │
                    │ （红绿灯效果）   │
                    └─────────────────┘
```

**关系说明**：
1. **Promise** 是基础，解决回调问题
2. **Iterator** 是迭代协议，为 Generator 提供基础
3. **Generator** 是可暂停函数，可以用于异步控制流
4. **async/await** 是 Promise + Generator 的语法糖，最终形态
5. **红绿灯效果** 是综合应用，检验理解程度

---

## 二、逐个击破：五个主题的第一性原理拆解

### 2.1 如何模拟实现 Promise？

#### 本质问题：Promise 到底是什么？

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Promise 的本质                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   Promise = 状态机 + 观察者模式 + 链式调用                               │
│                                                                         │
│   ┌─────────────┐                                                       │
│   │   状态机    │  pending → fulfilled / rejected                       │
│   └─────────────┘  （状态只能改变一次，不可逆）                          │
│                                                                         │
│   ┌─────────────┐                                                       │
│   │  观察者模式  │  then/catch 注册回调，状态改变时通知                   │
│   └─────────────┘                                                       │
│                                                                         │
│   ┌─────────────┐                                                       │
│   │  链式调用   │  then 返回新 Promise，实现链式                         │
│   └─────────────┘                                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 核心实现逻辑

```javascript
class MyPromise {
    constructor(executor) {
        this.state = 'pending';      // 状态
        this.value = undefined;       // 成功值
        this.reason = undefined;      // 失败原因
        this.onFulfilledCallbacks = []; // 成功回调队列
        this.onRejectedCallbacks = [];  // 失败回调队列

        const resolve = (value) => {
            if (this.state !== 'pending') return; // 状态锁定
            this.state = 'fulfilled';
            this.value = value;
            this.onFulfilledCallbacks.forEach(fn => fn()); // 通知观察者
        };

        const reject = (reason) => {
            if (this.state !== 'pending') return;
            this.state = 'rejected';
            this.reason = reason;
            this.onRejectedCallbacks.forEach(fn => fn());
        };

        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onFulfilled, onRejected) {
        // 返回新 Promise 实现链式调用
        return new MyPromise((resolve, reject) => {
            if (this.state === 'fulfilled') {
                const result = onFulfilled(this.value);
                resolve(result);
            } else if (this.state === 'rejected') {
                const result = onRejected(this.reason);
                reject(result);
            } else {
                // pending 状态，注册回调
                this.onFulfilledCallbacks.push(() => {
                    const result = onFulfilled(this.value);
                    resolve(result);
                });
                this.onRejectedCallbacks.push(() => {
                    const result = onRejected(this.reason);
                    reject(result);
                });
            }
        });
    }
}
```

#### 面试要点

| 考点 | 关键理解 |
|------|----------|
| 状态不可逆 | `if (this.state !== 'pending') return` |
| 异步回调 | 使用回调队列存储，状态改变时执行 |
| 链式调用 | `then` 返回新 Promise |
| 错误处理 | executor 用 try-catch 包裹 |

---

### 2.2 Iterator 和 Iterable

#### 本质问题：为什么需要迭代协议？

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    迭代协议的本质                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   问题：不同数据结构（Array、Map、Set、String）如何统一遍历？            │
│                                                                         │
│   解决：定义统一的迭代协议                                               │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  可迭代协议 (Iterable)                                          │   │
│   │  对象必须实现 [Symbol.iterator] 方法                            │   │
│   │  返回一个迭代器对象                                             │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                          ↓                                              │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  迭代器协议 (Iterator)                                          │   │
│   │  对象必须实现 next() 方法                                       │   │
│   │  返回 { value: any, done: boolean }                             │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 核心概念

```javascript
// 可迭代对象的本质：实现 [Symbol.iterator] 方法
const myIterable = {
    data: ['a', 'b', 'c'],
    [Symbol.iterator]() {
        let index = 0;
        const data = this.data;
        return {
            next() {
                return index < data.length
                    ? { value: data[index++], done: false }
                    : { value: undefined, done: true };
            }
        };
    }
};

// 可以使用 for...of
for (const item of myIterable) {
    console.log(item); // 'a', 'b', 'c'
}
```

#### 内置可迭代对象

| 类型 | 是否可迭代 | 说明 |
|------|-----------|------|
| Array | ✅ | 原生支持 |
| String | ✅ | 按字符迭代 |
| Map | ✅ | 迭代键值对 |
| Set | ✅ | 迭代值 |
| Object | ❌ | 需要手动实现或用 Object.entries() |
| arguments | ✅ | 类数组对象 |
| NodeList | ✅ | DOM 集合 |

---

### 2.3 Generator 生成器

#### 本质问题：Generator 解决什么问题？

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Generator 的本质                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   普通函数：运行到底，不能暂停                                           │
│   Generator：可以暂停和恢复的函数                                        │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  function* generate() {                                         │   │
│   │      console.log('第一段');                                     │   │
│   │      yield 1;  // 暂停点1                                       │   │
│   │      console.log('第二段');                                     │   │
│   │      yield 2;  // 暂停点2                                       │   │
│   │      console.log('第三段');                                     │   │
│   │      return 3;                                                  │   │
│   │  }                                                              │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   关键特性：                                                            │
│   1. function* 声明                                                     │
│   2. yield 暂停并返回值                                                 │
│   3. next() 恢复执行                                                    │
│   4. 返回迭代器对象                                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 执行流程图

```
gen = generate()     // 不执行，返回迭代器
        │
        ▼
gen.next()  ────────→  执行到 yield 1 ────→ 返回 { value: 1, done: false }
        │                    │
        │                    │ 暂停
        ▼                    ▼
gen.next()  ────────→  执行到 yield 2 ────→ 返回 { value: 2, done: false }
        │                    │
        │                    │ 暂停
        ▼                    ▼
gen.next()  ────────→  执行到 return 3 ───→ 返回 { value: 3, done: true }
```

#### yield* 委托

```javascript
function* generator() {
    yield 1;
    yield* ['a', 'b', 'c'];  // 委托给数组的迭代器
    yield 2;
}

for (let value of generator()) {
    console.log(value);  // 1, 'a', 'b', 'c', 2
}
```

---

### 2.4 async/await

#### 本质问题：async/await 是什么？

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    async/await 的本质                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   async/await = Promise + Generator 的语法糖                            │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  async function f() {                                           │   │
│   │      const result = await promise;                              │   │
│   │      return result;                                             │   │
│   │  }                                                              │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                          ↓ 等价于                                       │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  function f() {                                                 │   │
│   │      return promise.then(result => {                            │   │
│   │          return result;                                         │   │
│   │      });                                                        │   │
│   │  }                                                              │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   关键特性：                                                            │
│   1. async 函数总是返回 Promise                                         │
│   2. await 暂停执行，等待 Promise resolve                               │
│   3. 用 try/catch 处理错误                                              │
│   4. 让异步代码看起来像同步代码                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 对比：Promise vs async/await

```javascript
// Promise 写法
function fetchData() {
    return fetch('/api/user')
        .then(res => res.json())
        .then(user => fetch(`/api/orders/${user.id}`))
        .then(res => res.json())
        .catch(err => console.error(err));
}

// async/await 写法
async function fetchData() {
    try {
        const res1 = await fetch('/api/user');
        const user = await res1.json();
        const res2 = await fetch(`/api/orders/${user.id}`);
        const orders = await res2.json();
        return orders;
    } catch (err) {
        console.error(err);
    }
}
```

#### 错误处理

```javascript
async function f() {
    try {
        const response = await new Promise((resolve, reject) => {
            throw new Error('test err');
        });
    } catch (err) {
        console.log(err);  // Error: test err
    }
}
```

---

### 2.5 红绿灯效果（综合应用）

#### 本质问题：如何用异步控制顺序执行？

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    红绿灯问题分析                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   需求：红灯3秒 → 绿灯2秒 → 黄灯1秒 → 循环                              │
│                                                                         │
│   本质：顺序执行 + 延时 + 循环                                          │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  红灯 ──3s──→ 绿灯 ──2s──→ 黄灯 ──1s──→ 红灯 ...               │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 实现方案

```javascript
// 延时函数
const delay = (callback, time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            callback();
            resolve();
        }, time);
    });
};

// 红绿灯函数
async function light() {
    await delay(() => console.log('red'), 3000);
    await delay(() => console.log('green'), 2000);
    await delay(() => console.log('yellow'), 1000);
    await light();  // 递归实现循环
}

light();
```

#### 关键点解析

| 要点 | 说明 |
|------|------|
| delay 返回 Promise | 让 await 能够等待 |
| setTimeout 在 Promise 内 | 延时后 resolve |
| 递归调用 light() | 实现无限循环 |
| await 保证顺序 | 红 → 绿 → 黄 依次执行 |

---

## 三、知识点关联图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         异步编程演进史                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   回调函数 ──────→ Promise ──────→ Generator ──────→ async/await       │
│      │               │               │                  │               │
│      │               │               │                  │               │
│   问题：          解决：           提供：            最终形态：          │
│   回调地狱        链式调用         可暂停函数        同步写法            │
│   控制反转        状态容器         迭代器协议        异步执行            │
│   错误分散        统一catch        yield暂停         try/catch          │
│                                                                         │
│   ═══════════════════════════════════════════════════════════════════   │
│                                                                         │
│   Iterator 是基础协议，Generator 实现了 Iterator                        │
│   async/await 是 Promise + Generator 的语法糖                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 四、面试高频考点总结

### 4.1 必须掌握

| 主题 | 核心考点 | 面试频率 |
|------|----------|----------|
| Promise | 手写实现、状态机、链式调用原理 | ⭐⭐⭐⭐⭐ |
| async/await | 与 Promise 关系、错误处理、执行顺序 | ⭐⭐⭐⭐⭐ |
| Generator | yield 执行流程、与 Iterator 关系 | ⭐⭐⭐ |
| Iterator | 迭代协议、Symbol.iterator | ⭐⭐⭐ |

### 4.2 常见面试题

1. **Promise 相关**
   - 手写 Promise
   - Promise.all / Promise.race 实现
   - Promise 执行顺序（微任务）

2. **async/await 相关**
   - async 函数返回什么？
   - await 后面不是 Promise 会怎样？
   - 如何并行执行多个 await？

3. **综合应用**
   - 实现 sleep 函数
   - 实现红绿灯效果
   - 实现请求重试

---

## 五、学习路径建议

```
第一阶段：理解 Promise
    ↓
第二阶段：掌握 async/await
    ↓
第三阶段：了解 Iterator/Generator
    ↓
第四阶段：综合应用（红绿灯、并发控制等）
    ↓
第五阶段：源码级理解（手写 Promise）
```

**核心原则**：先会用，再理解原理，最后能手写实现。
