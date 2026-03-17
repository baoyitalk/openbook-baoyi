---
tags:
  - js面试突破
---

# async定义 

async/await 实际上是Promise的语法糖， 它可以用一种更舒适的方式使用Promise，更易于理解和使用。
async关键字放在函数前面，表达这个函数总是返回一个Promise，其他值将自动包装在一个resolved的Promise中。

## 案例：
```js
async function f() {
    return 1;
}

f().then((v) => console.log(v));
console.log('f', f())
```

输出结果
![](images/Pasted%20image%2020260302102344.png)

## 函数内容使用await一定要使用async
```js
// 情况1：在函数内部用 await（需要 async）
async function foo() {
  const data = await fetch("/api/data");  // ✅ 需要 async
  return data;
}

// 情况2：在函数外部用 await（不需要 async）
const data = await delay(...);  // ✅ 不需要 async（顶层 await）
```


## async修饰的函数得到Promise数据如何解包

await
.then
Promise.resolve 三种方法


[Promise解包拿到普通数据](./x1014-async修饰函数拿到Promise数据解包.md)




# await定义

await关键字可以暂停函数的执行，直到Promise的状态已敲定，然后Promise的结果继续执行。
相比Promise.then 它显得更为优雅。如果在非async中使用，会报语法错误。
await 只等 **fulfilled**，不等 rejected。

## await存在的打印结果
```js
// await必须拿到结果 是 fullfied才往下执行

async function f() {

let promise = new Promise((resolve, reject) => {

setTimeout(() => {

resolve("done!")

}, 2000)

})

let result = await promise; //等待，直到Promise resolve（*）

console.log(result)

  

}

  

f();

```


## 对比没有await的结果 打印的是 pending状态


```js
// ❌ 没有 await - 错误示范

async function f1() {

let promise = new Promise((resolve) => {

setTimeout(() => resolve("done!"), 1000)

})

let result = promise; // 没写 await

console.log(result) // 打印什么？

}

  

f1();

// 立即输出：Promise {<pending>} ← 拿到的是 Promise 对象，不是结果！

```


## 错误处理


await需要 try/catch 
Promise支持双回调直接用一个catch捕获
案例1：对比 Promise.then 与 async/await
```js
// .then() - 基于回调的错误处理
// 原理：Promise 有两个出口（fulfilled/rejected），可以分别注册回调
promise.then(
    value => console.log("成功", value),  // fulfilled 回调
    error => console.log("失败", error)   // rejected 回调
);

// 或者用 .catch()（本质是 .then(null, onRejected) 的语法糖）
promise
    .then(value => console.log("成功", value))
    .catch(error => console.log("失败", error));

// await - 基于异常的错误处理
// 原理：rejected 的 Promise 会抛出异常，必须用 try/catch
async function test() {
    try {
        let value = await promise; // fulfilled -> 返回值
        console.log("成功", value);
    } catch (error) {              // rejected -> 抛异常
        console.log("失败", error);
    }
}

```


案例2：


```js
// 错误处理

  

async function fn() {

try {

let res = await new Promise((resolve, reject) => {

throw new Error('test err')

}))

} catch (err) {

console.log(err);

}

}

  

fn() // ReferenceError: resolve is not defined

```
拆解案例2：

fetch返回的是Promise
```js
// 这个例子只是为了演示"await 能捕获 Promise 错误"
// 但实际上，你不会手动 new Promise 来抛错

// 真实场景：
async function realWorld() {
  try {
    // await 的是别人返回的 Promise
    const user = await fetch('/api/user');  // fetch 返回 Promise
    const data = await user.json();         // .json() 返回 Promise
    return data;
  } catch (err) {
    console.log(err);  // 捕获网络错误、解析错误等
  }
}

```


## await 工作机制

接收99%场景都是 Promise结构 返回正常数据

```js
// await 接收 Promise，返回 Promise 的结果值

const promise = fetch('/api/user');  // Promise 对象
const result = await promise;        // 等待 Promise 完成，拿到结果数据

// 等价于
promise.then(result => {
  // result 就是数据
});

```

# async修饰的函数需要return吗


## 不必须

```javascript
async function f() {
  await something();
  // 没有 return
}

f(); // 返回 Promise {<fulfilled>: undefined}
```

## 规则

```javascript
// 1. 不写 return → 返回 Promise.resolve(undefined)
async function a() {
  await xxx;
}
a() // Promise {<fulfilled>: undefined}

// 2. return 普通值 → 自动包装成 fulfilled Promise
async function b() {
  return 'hello';
}
b() // Promise {<fulfilled>: 'hello'}

// 3. return Promise → 直接返回这个 Promise
async function c() {
  return Promise.resolve('hi');
}
c() // Promise {<fulfilled>: 'hi'}

// 4. 抛错 → 返回 rejected Promise
async function d() {
  throw new Error('oops');
}
d() // Promise {<rejected>: Error: oops}
```

## 实际场景

```javascript
// 不需要返回值，只是为了用 await
async function saveData() {
  await db.connect();
  await db.save(data);
  await db.close();
  // 不 return，调用者也不关心返回值
}

// 需要返回值
async function getData() {
  const res = await fetch('/api');
  return res.json(); // 返回数据给调用者
}
```

## 核心

**async 函数永远返回 Promise**，不管你写不写 return。

- 写了 return → Promise 包装你的返回值
- 不写 return → Promise 包装 undefined





# await 与Promise.then区别

**核心结论：`await` 是 `.then()` 的语法糖，提供了更好的可读性和控制流，但本质上都是处理 Promise。现代开发优先用 `await`，除非有特殊需求。**


[x1010-async await底层是Promise吗](./x1010-async%20await底层是Promise吗.md)

```
// Promise 的本质：一个状态机
let promise = new Promise((resolve, reject) => {
    // pending -> fulfilled 或 rejected
});

// .then() 是 Promise 原型上的方法
// 作用：注册回调函数，当状态改变时执行
promise.then(onFulfilled, onRejected);
```
**本质：`.then()` 是回调注册机制，返回新的 Promise，支持链式调用**



```
// await 是语法糖（syntactic sugar）
// 本质：暂停 async 函数执行，等待 Promise 完成

async function test() {
    let result = await promise; // 暂停在这里，等 promise 完成
    console.log(result);        // promise 完成后继续执行
}

```

**本质：`await` 是语法层面的暂停/恢复机制，让异步代码看起来像同步**



| 维度             | Promise.then                                  | await                 |
| -------------- | --------------------------------------------- | --------------------- |
| **本质**         | 回调注册机制                                        | 语法糖（编译成 .then）        |
| **执行模型**       | 注册回调，不阻塞                                      | 暂停函数，等待完成             |
| **代码风格**       | 链式调用、回调嵌套                                     | 顺序执行、类同步              |
| **返回值**        | 返回新的 Promise                                  | 返回 Promise 的解析值       |
| **错误处理**       | `.then(onFulfilled, onRejected)` 或 `.catch()` | `try/catch`           |
| **双回调支持**      | ✅ 支持 `.then(success, fail)`                   | ❌ 不支持，必须 try/catch    |
| **作用域**        | 每个回调独立作用域                                     | 同一函数作用域               |
| **变量访问**       | 需要闭包或传递参数                                     | 直接访问上层变量              |
| **条件分支**       | 嵌套复杂                                          | 自然的 if/else           |
| **循环处理**       | 需要 reduce/递归                                  | 直接用 for/while         |
| **并发执行**       | `Promise.all()`                               | `await Promise.all()` |
| **使用限制**       | 任何地方都能用                                       | 只能在 async 函数内         |
| **调试**         | 调用栈复杂                                         | 调用栈清晰                 |
| **性能**         | 略快（原生）                                        | 略慢（需编译）               |
| **浏览器支持**      | ES6 (2015)                                    | ES8 (2017)            |
| **可读性**        | 链式调用较难读                                       | 接近同步代码，易读             |
| **错误传播**       | `.catch()` 捕获整个链                              | `try/catch` 捕获块内      |
| **返回 Promise** | 自动返回                                          | async 函数自动包装          |
| **顺序保证**       | 需要链式调用                                        | 天然顺序执行                |

使用场景

|场景|推荐|原因|
|---|---|---|
|现代项目|`await`|可读性、可维护性更好|
|简单单次调用|都可以|差别不大|
|复杂业务逻辑|`await`|条件、循环更自然|
|需要并发|`await Promise.all()`|更清晰|
|顶层代码（非函数内）|`.then()`|await 需要 async 函数|
|老项目/不支持 async|`.then()`|兼容性|
|需要双回调|`.then(s, f)`|await 不支持|
|库/框架开发|`.then()`|更灵活|




# async await底层是Promise吗

不完全是   [x1010-async await底层是Promise吗](x1010-async%20await底层是Promise吗.md)

## async/await 的底层是：

1. **语法层面**：语法糖，编译成 Generator + Promise
2. **执行层面**：Generator 提供暂停/恢复，Promise 管理异步
3. **本质**：自动执行的 Generator + Promise 包装器

[底层关系图](./x1010-async%20await底层是Promise吗.md)




# async await可以取代Promise吗 


完全不能 

只是覆盖了 Promise的 链式调用 ，他们之间要经常混合使用


[x1012-async await只是覆盖了Promise链式调用](x1012-async%20await只是覆盖了Promise链式调用.md) ^7e58xt






# 如何使用async 实现delay函数


delay函数定义如下：

```
delay((str) => str, 3000, 'Hello world').then(res => console.log(res))
```

![](images/Pasted%20image%2020260302145708.png)



```
// 1. sleep 返回一个对象
const sleep = (cb, time, args) => ({
  then: (callback) => {  // 这个 then 会被 await 调用
    setTimeout(() => callback(args), time);
  }
});

// 2. 当 await 遇到这个对象时
await sleep(cb, time, args);
// 相当于：
sleep(cb, time, args).then(...)  // await 会调用 then 方法
```





## 为什么要写then

好问题！这是个关键点。

### `then` 是什么？

`then` 是 **Promise 的方法**，但这里 `sleep` 返回的不是真正的 Promise，而是一个**模仿 Promise 的对象**。

### 为什么要写 `then`？

因为代码里用了 `await`：

```javascript
const delay = async (cb, time, args) => {
  return await sleep(cb, time, args);  // await 需要对象有 then 方法
};
```

`await` 会去找对象的 `then` 方法来执行。

### 执行流程

```javascript
// 1. sleep 返回一个对象
const sleep = (cb, time, args) => ({
  then: (callback) => {  // 这个 then 会被 await 调用
    setTimeout(() => callback(args), time);
  }
});

// 2. 当 await 遇到这个对象时
await sleep(cb, time, args);
// 相当于：
sleep(cb, time, args).then(...)  // await 会调用 then 方法
```

### 对比真正的 Promise

```javascript
// 真正的 Promise
new Promise((resolve) => {
  setTimeout(() => resolve("Hello"), 3000);
}).then((res) => console.log(res));

// 模仿的 Promise（这个例子）
({
  then: (cb) => {
    setTimeout(() => cb("Hello"), 3000);
  }
}).then((res) => console.log(res));
```

### 简单理解

`then` 就是一个**约定的方法名**：
- Promise 有 `then` 方法
- `await` 会调用对象的 `then` 方法
- 所以要让对象能被 `await`，就得给它加个 `then` 方法

这种有 `then` 方法的对象叫 **thenable**（可then的对象）。




## 调用链路


```
// 【辅助函数】sleep - 创建可等待对象
const sleep = (cb, time, args) => ({
  //          ^^  ^^^^  ^^^^
  //          |    |     └─ 传给回调的参数
  //          |    └─ 延迟时间
  //          └─ 回调函数（作为参数传入）
  
  then: (cb) => {
    //   ^^
    //   注意：这里的 cb 是 then 的参数，会覆盖外层的 cb
    //   实际上这里应该用别的名字，比如 callback
    
    setTimeout(() => cb(args), time);
    //         ^^^^^^^^^^^^^^
    //         【调用点1】setTimeout 调用这个箭头函数
    //                  ^^^^^^^^
    //                  【调用点2】箭头函数内部调用 cb(args)
  }
});

// 【主函数】delay - 对外接口
const delay = async (cb, time, args) => {
  //                 ^^  ^^^^  ^^^^
  //                 └─ 回调函数（作为参数传入）
  
  return await sleep(cb, time, args);
  //           ^^^^^^^^^^^^^^^^^^^^^
  //           【调用点3】delay 调用 sleep
};

// 【使用】
delay(
  (str) => str,           // 【回调函数定义】传给 delay 的 cb
  //^^^^^^^^^
  //这个函数会被传递到 sleep，最终被 setTimeout 调用
  
  3000,                   // 延迟时间
  "Hello world"           // 参数
  
).then(
  (res) => console.log(res)  // 【结果处理函数】
  //       ^^^^^^^^^^^^^^^^^^
  //       【调用点4】then 内部调用 console.log
);
```


```
用户调用 delay
    ↓
delay 调用 sleep
    ↓
sleep 返回对象 { then: ... }
    ↓
用户调用 .then()
    ↓
then 内部调用 setTimeout
    ↓
3秒后，setTimeout 调用箭头函数 () => cb(args)
    ↓
箭头函数调用 cb(args)
    ↓
cb 就是 (str) => str，执行后返回 "Hello world"
    ↓
返回值传给 .then() 的回调
    ↓
执行 console.log(res)
    ↓
输出：Hello world
```

| 函数                          | 角色     | 在哪被调用        | 调用了谁             |
| --------------------------- | ------ | ------------ | ---------------- |
| `(str) => str`              | 回调函数   | setTimeout 内 | 无                |
| `sleep`                     | 辅助函数   | delay 内      | 无（返回对象）          |
| `delay`                     | 主函数    | 用户代码         | sleep            |
| `setTimeout`                | 浏览器API | then 内       | `() => cb(args)` |
| `(res) => console.log(res)` | 结果处理函数 | Promise 机制   | console.log      |



## delay拿到的数据是 普通数据还是 Promise


| 位置       | 表达式                | 接收什么        | 返回什么       |
| -------- | ------------------ | ----------- | ---------- |
| delay 内部 | `await sleep(...)` | thenable 对象 | 普通数据       |
| delay 函数 | `async function`   | -           | Promise 对象 |
| 外部调用     | `await delay(...)` | Promise 对象  | 普通数据       |
| 外部调用     | `delay(...)`       | -           | Promise 对象 |


不一定非要用async



