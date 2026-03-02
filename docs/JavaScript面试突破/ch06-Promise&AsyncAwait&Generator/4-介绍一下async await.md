---
tags:
  - 异步
  - async
  - await
---

# async定义

async/await 实际上是Promise的语法糖， 它可以用一种更舒适的方式使用Promise，更易于理解和使用。
async关键字放在函数前面，表达这个函数总是返回一个Promise，其他值将自动包装在一个resolved的Promise中。

```js
async function f() {
    return 1;
}

f().then((v) => console.log(v));
console.log('f', f())
```

输出结果
![](images/Pasted%20image%2020260302102344.png)



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


