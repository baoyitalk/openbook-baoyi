## 第一性原理拆解：Promise & Async/Await & Generator

### 核心问题：如何优雅地处理异步操作？

---

## 一、异步的演进历程

```
回调函数 → Promise → Generator → async/await
   ↓          ↓          ↓           ↓
 回调地狱    链式调用    可暂停     同步写法
```

---

## 二、Promise

### 本质：一个代表"未来值"的容器

```
┌─────────────────────────────────────────────────┐
│               Promise 状态机                     │
├─────────────────────────────────────────────────┤
│                                                 │
│   pending（等待中）                              │
│       │                                         │
│       ├──→ fulfilled（已成功）→ 调用 then       │
│       │                                         │
│       └──→ rejected（已失败）→ 调用 catch       │
│                                                 │
│   注意：状态一旦改变，不可逆转                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Promise 的核心方法

| 方法 | 作用 | 特点 |
|------|------|------|
| `Promise.all` | 全部成功才成功 | 一个失败就失败 |
| `Promise.race` | 第一个完成的结果 | 不管成功失败 |
| `Promise.allSettled` | 等待全部完成 | 返回所有结果 |
| `Promise.any` | 第一个成功的结果 | 全失败才失败 |

### 经典面试代码：手写 Promise

```javascript
class MyPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        
        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onFulfilledCallbacks.forEach(fn => fn());
            }
        };
        
        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };
        
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
    
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
        onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e };
        
        const promise2 = new MyPromise((resolve, reject) => {
            if (this.state === 'fulfilled') {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
            
            if (this.state === 'rejected') {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
            
            if (this.state === 'pending') {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        });
        
        return promise2;
    }
    
    catch(onRejected) {
        return this.then(null, onRejected);
    }
    
    static resolve(value) {
        return new MyPromise(resolve => resolve(value));
    }
    
    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }
    
    static all(promises) {
        return new MyPromise((resolve, reject) => {
            const results = [];
            let count = 0;
            
            promises.forEach((p, i) => {
                Promise.resolve(p).then(value => {
                    results[i] = value;
                    if (++count === promises.length) {
                        resolve(results);
                    }
                }, reject);
            });
        });
    }
    
    static race(promises) {
        return new MyPromise((resolve, reject) => {
            promises.forEach(p => {
                Promise.resolve(p).then(resolve, reject);
            });
        });
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('循环引用'));
    }
    
    if (x instanceof MyPromise) {
        x.then(resolve, reject);
    } else {
        resolve(x);
    }
}
```

---

## 三、Iterator 和 Iterable

### 本质：统一的遍历接口

```javascript
// 可迭代协议：对象有 [Symbol.iterator] 方法
// 迭代器协议：有 next() 方法，返回 { value, done }

// 内置可迭代对象
// String, Array, TypedArray, Map, Set, arguments, NodeList

// 手写迭代器
class MyIterator {
    constructor(data) {
        this.data = data;
        this.index = 0;
    }
    
    [Symbol.iterator]() {
        return this;
    }
    
    next() {
        if (this.index < this.data.length) {
            return { value: this.data[this.index++], done: false };
        }
        return { value: undefined, done: true };
    }
}

const it = new MyIterator(['a', 'b', 'c']);
for (const v of it) {
    console.log(v);  // a, b, c
}
```

### 让普通对象可迭代

```javascript
const obj = { name: 'John', age: 20 };

// 方法1：Object.entries
for (const [key, value] of Object.entries(obj)) {
    console.log(key, value);
}

// 方法2：添加迭代器
obj[Symbol.iterator] = function* () {
    for (const key of Object.keys(this)) {
        yield [key, this[key]];
    }
};
```

---

## 四、Generator（生成器）

### 本质：可暂停的函数

```javascript
function* generator() {
    console.log('1');
    yield 'a';        // 暂停点1
    console.log('2');
    yield 'b';        // 暂停点2
    console.log('3');
    return 'c';
}

const gen = generator();
gen.next();  // 打印 '1'，返回 { value: 'a', done: false }
gen.next();  // 打印 '2'，返回 { value: 'b', done: false }
gen.next();  // 打印 '3'，返回 { value: 'c', done: true }
```

### yield* 委托

```javascript
function* gen() {
    yield 1;
    yield* [2, 3, 4];  // 展开可迭代对象
    yield 5;
}

console.log([...gen()]);  // [1, 2, 3, 4, 5]
```

### Generator 实现异步（async/await 的前身）

```javascript
function* asyncTask() {
    const data1 = yield fetch('/api/1');
    const data2 = yield fetch('/api/2');
    return [data1, data2];
}

// 需要执行器来自动运行
function run(generator) {
    const gen = generator();
    
    function next(data) {
        const result = gen.next(data);
        if (result.done) return result.value;
        result.value.then(data => next(data));
    }
    
    next();
}
```

---

## 五、async/await

### 本质：Generator + 自动执行器 的语法糖

```javascript
// async 函数返回 Promise
async function fn() {
    return 1;
}
fn().then(v => console.log(v));  // 1

// await 暂停执行，等待 Promise 完成
async function getData() {
    const res = await fetch('/api');  // 暂停，等待
    const data = await res.json();    // 继续暂停
    return data;
}
```

### 错误处理

```javascript
// 方式1：try/catch
async function fn() {
    try {
        const res = await fetch('/api');
        return res;
    } catch (err) {
        console.log('Error:', err);
    }
}

// 方式2：.catch()
async function fn() {
    const res = await fetch('/api').catch(err => {
        console.log('Error:', err);
        return null;
    });
    return res;
}
```

### async/await vs Promise

```javascript
// Promise 链式
function getData() {
    return fetch('/api/1')
        .then(res => res.json())
        .then(data => fetch('/api/2?id=' + data.id))
        .then(res => res.json());
}

// async/await 同步写法
async function getData() {
    const res1 = await fetch('/api/1');
    const data1 = await res1.json();
    const res2 = await fetch('/api/2?id=' + data1.id);
    const data2 = await res2.json();
    return data2;
}
```

---

## 六、经典面试题：红绿灯

```javascript
// 红灯3秒，绿灯2秒，黄灯1秒，循环
function delay(fn, time) {
    return new Promise(resolve => {
        setTimeout(() => {
            fn();
            resolve();
        }, time);
    });
}

async function light() {
    await delay(() => console.log('红灯'), 3000);
    await delay(() => console.log('绿灯'), 2000);
    await delay(() => console.log('黄灯'), 1000);
    await light();  // 递归循环
}

light();
```

---

## 七、并发控制

### 串行执行

```javascript
async function serial(tasks) {
    const results = [];
    for (const task of tasks) {
        results.push(await task());
    }
    return results;
}
```

### 并行执行

```javascript
async function parallel(tasks) {
    return Promise.all(tasks.map(task => task()));
}
```

### 并发限制

```javascript
async function limitConcurrency(tasks, limit) {
    const results = [];
    const executing = [];
    
    for (const task of tasks) {
        const p = Promise.resolve().then(() => task());
        results.push(p);
        
        if (limit <= tasks.length) {
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            
            if (executing.length >= limit) {
                await Promise.race(executing);
            }
        }
    }
    
    return Promise.all(results);
}
```

---

## 总结

```
┌─────────────────────────────────────────────────────────────────┐
│                   异步编程核心                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Promise ─→ 状态容器（pending/fulfilled/rejected）              │
│           │  .then() 链式调用                                   │
│           │  .catch() 错误处理                                  │
│           │  Promise.all/race/allSettled/any                   │
│                                                                 │
│  Iterator ─→ 统一遍历接口                                       │
│            │  [Symbol.iterator]() 返回迭代器                    │
│            └  next() 返回 { value, done }                       │
│                                                                 │
│  Generator ─→ 可暂停函数                                        │
│             │  function* / yield                                │
│             │  yield* 委托其他可迭代对象                         │
│             └  .next() / .return() / .throw()                   │
│                                                                 │
│  async/await ─→ Generator 语法糖                                │
│               │  async 函数返回 Promise                         │
│               │  await 暂停等待 Promise                         │
│               └  try/catch 处理错误                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

演进关系：
回调 → Promise（解决回调地狱）→ Generator（可暂停）→ async/await（最优雅）
```

**核心记忆：Promise 管状态，Generator 管暂停，async/await 是最佳实践。**