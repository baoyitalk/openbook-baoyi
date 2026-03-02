
# 为什么需要Promise


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




# Promise与回调函数的关系

Promise是基于回调函数的
看一个经典的使用回调函数的例子:: [x1003-回调函数模拟异步读取数据](x1003-回调函数模拟异步读取数据.md)






什么是回调函数::把函数作为参数传给另一个函数，让它在合适时机调用



## Promise依次获取3个接口



### 案例1：回调版

```
// 场景： 依次获取3个接口

  
  

// 回调函数方式实现 依次获取3个接口

  

function getUser(callback) { // 主函数getUser

setTimeout(() => callback({id:1, name: '张三'}), 1000)

}

function getOrders(userId, callback) { // 主函数getOrders

setTimeout(() => {

callback(['订单1', '订单2'])

}, 1000);

}

function getDetail(orderId, callback) {

setTimeout(() => {

callback({price: 100})

}, 1000);

}

  
  

// 使用： 嵌套地狱

getUser((user) => { // 注意 user这个参数是在主函数回传的 这就是控制反转了

console.log(user)

getOrders(user.id, (orders) => { // 为了演示暂时不用非空校验了

console.log(orders)

getDetail(orders[0], (detail) => {

console.log(detail)

})

})

})

```

执行结果

```
{ id: 1, name: '张三' }

[ '订单1', '订单2' ]

{ price: 100 }

  

[Done] exited with code=0 in 3.073 seconds

```




注意：
setTimeout为什么要包一层箭头函数::[x1005-setTimeout为什么要包一层箭头函数](x1005-setTimeout为什么要包一层箭头函数.md)






拆解1： 对应关系

| 主函数         | 接收的回调函数               |
| ----------- | --------------------- |
| `getUser`   | `(user) => { ... }`   |
| `getOrders` | `(orders) => { ... }` |
| `getDetail` | `(detail) => { ... }` |
拆解2： 执行顺序

1秒后：getUser 调用回调 → 打印 user
      ↓
2秒后：getOrders 调用回调 → 打印 orders
      ↓
3秒后：getDetail 调用回调 → 打印 detail



拆解3:

为什么是3秒后 getDetail

0秒：调用 getUser，开始等 1 秒
     ↓
1秒：getUser 的 setTimeout 到期，执行回调，调用 getOrders，开始等 1 秒
     ↓
2秒：getOrders 的 setTimeout 到期，执行回调，调用 getDetail，开始等 1 秒
     ↓
3秒：getDetail 的 setTimeout 到期，执行回调，打印 detail






### 案例2：Promise版
```js
function getUser() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id: 1, name: '张三' }), 1000) // 模拟成功拿到数据-调用回调函数将数据回传给回调函数
  })
}

function getOrders(userId) {
  return new Promise(resolve => {
    setTimeout(() => resolve(['订单1', '订单2']), 1000) // 模拟成功拿到数据-调用回调函数将数据回传给回调函数
  })
}

function getDetail(orderId) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ price: 100 }), 1000) // 模拟成功拿到数据-调用回调函数将数据回传给回调函数
  })
}

// 使用 —— 链式调用
getUser()
  .then(user => {
    console.log(user)
    return getOrders(user.id)
  })
  .then(orders => {
    console.log(orders)
    return getDetail(orders[0])
  })
  .then(detail => {
    console.log(detail)
  })
```


### 案例3:  async/ await 版

更直观
```js
async function main() {
  const user = await getUser()
  console.log(user)
  
  const orders = await getOrders(user.id)
  console.log(orders)
  
  const detail = await getDetail(orders[0])
  console.log(detail)
}

main()

```



## 外部使用主函数时回调函数怎么传给主函数
then括号里的参数是 传回调函数 这个回调函数的参数必须是变量不是具体值

**传给 then () 的回调函数，它的参数确实是「变量」，没有具体值**，这个参数的值是由 Promise 自动填充的。

### 一句话讲透（结合你熟悉的代码）

你写 `then(user => console.log(user))` 时，`user` 就是一个 “占位用的变量”（相当于 “空盒子”），你不知道它具体是啥值 —— 直到 Promise 状态变成 `fulfilled`、调用 `resolve(具体值)` 时，这个 “空盒子” 才会被自动装进 `resolve` 传的结果（比如你代码里的 `{id:1, name: '张三'}`）。

### 举 3 个直观例子（对应你之前的代码）

#### 箭头函数（最常用，参数是变量）

javascript

运行

```
getUser().then(user => { // user 是变量，无具体值
  console.log(user); // 等 Promise 完成，user 才会变成 {id:1, name: '张三'}
});
```

- 你写这段代码时，`user` 只是 “约定好的变量名”，你可以随便改（比如叫 `res`、`data`），只要前后一致就行：
    
    javascript
    
    运行
    
    ```
    getUser().then(res => console.log(res)); // res 也是变量，和 user 本质一样
    ```
    

匿名函数（参数也是变量）
具名函数（参数还是变量）



### 关键区分（避免踩坑）

- ✅ 正确：传给 then () 的是「带变量参数的函数」（变量只是占位）
    
    javascript
    
    运行
    
    ```
    then( (变量) => { 处理变量 } )
    ```
    
- ❌ 错误：传给 then () 时，直接给参数赋具体值（这就不是回调了，会报错）
    
    javascript
    
    运行
    
    ```
    getUser().then( (user = {id:1}) => {} ); // 没必要，也不符合回调逻辑
    getUser().then( console.log({id:1}) ); // 错！这是直接执行代码，不是函数
    ```
    

### 总结

你抓得特别准：传给 then () 的回调函数，它的参数就是「无具体值的变量」—— 这个变量的作用是 “占位”，等待 Promise 执行完成后，自动接收 `resolve()` 传递的具体结果。

简单记：回调函数的参数是 “等着装结果的空盒子”，Promise 完成后，会把结果自动放进这个盒子里，你再用这个盒子里的内容做事。需要我用你之前的 getUser 代码，写一个 “参数赋值全过程” 的注释版，帮你更直观看到变量怎么拿到具体值吗？

---




# 加上错误处理依次获取3个接口

明白，从最简单的对比开始：



**场景：依次请求 3 个接口**

**回调版：**

```javascript
function getUser(callback) {
  setTimeout(() => callback({ id: 1, name: '张三' }), 1000)
}

function getOrders(userId, callback) {
  setTimeout(() => callback(['订单1', '订单2']), 1000)
}

function getDetail(orderId, callback) {
  setTimeout(() => callback({ price: 100 }), 1000)
}

// 使用 —— 嵌套地狱
getUser((user) => {
  console.log(user)
  getOrders(user.id, (orders) => {
    console.log(orders)
    getDetail(orders[0], (detail) => {
      console.log(detail)
    })
  })
})
```

**Promise 版：**

```javascript
function getUser() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id: 1, name: '张三' }), 1000)
  })
}

function getOrders(userId) {
  return new Promise(resolve => {
    setTimeout(() => resolve(['订单1', '订单2']), 1000)
  })
}

function getDetail(orderId) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ price: 100 }), 1000)
  })
}

// 使用 —— 链式调用
getUser()
  .then(user => {
    console.log(user)
    return getOrders(user.id)
  })
  .then(orders => {
    console.log(orders)
    return getDetail(orders[0])
  })
  .then(detail => {
    console.log(detail)
  })
```

**async/await 版（更直观）：**

```javascript
async function main() {
  const user = await getUser()
  console.log(user)

  const orders = await getOrders(user.id)
  console.log(orders)

  const detail = await getDetail(orders[0])
  console.log(detail)
}

main()
```

---

**直观对比：**

```
回调版：        )))}}}  ← 右边一堆括号
Promise版：    .then().then().then()  ← 平的
await版：      一行一行 ← 像同步代码
```

---

**加上错误处理再看：**

**回调版：**

```javascript
getUser((err, user) => {
  if (err) return console.error(err)
  getOrders(user.id, (err, orders) => {
    if (err) return console.error(err)
    getDetail(orders[0], (err, detail) => {
      if (err) return console.error(err)
      console.log(detail)
    })
  })
})
```

**Promise 版：**

```javascript
getUser()
  .then(user => getOrders(user.id))
  .then(orders => getDetail(orders[0]))
  .then(detail => console.log(detail))
  .catch(err => console.error(err))  // 一处搞定
```

---

**一眼看出差距了吧？**

回调：每层都要处理错误，嵌套深
Promise：错误冒泡，统一 catch，代码扁平




---



# 回调函数的控制反转体现在哪里

![](images/Pasted%20image%2020260227193848.png)
我发现 外部调用主函数 没有直接给 回调函数传参 是在 主函数内部 动态把参数传给 回调函数的

对，你观察得很准。

```javascript
// 调用时：回调没有传参
getUser(callback)

// 内部实现：拿到数据后，把参数"塞"给回调
function getUser(callback) {
  fetch('/api/user')
    .then(res => res.json())
    .then(data => {
      callback(data)  // 这里才传参
    })
}
```



## 本质就是"控制反转"

你把函数交出去，什么时候调、传什么参数，都由主函数决定。

```javascript
// 数组的 forEach 也是这个套路
[1, 2, 3].forEach(callback)

// 内部大概是这样
function forEach(callback) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this)  // 内部决定传 item, index, array
  }
}
```

## 所以回调的参数签名是"约定"

```javascript
// 你得知道主函数会传什么
element.addEventListener('click', (event) => { })  // 传 event
setTimeout(() => { }, 1000)                         // 不传参
arr.map((item, index) => { })                       // 传 item, index
fs.readFile(path, (err, data) => { })              // Node 风格：err 在前
```

这也是回调的一个痛点——参数结构得查文档或看源码才知道。Promise 和 async/await 让这个更直观一些。