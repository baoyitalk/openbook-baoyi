---
number headings: auto
---


## 0.1 案例

```js
const p = new Promise((resolve, reject) => {

setTimeout(() => {

Math.random()>0.5 ? resolve('成功') : reject('失败');

}, 1000);

});

p.then(res=>console.log(res)).catch(err=>console.log(err));
```



| 英文状态        | 中文状态 | 核心含义        | 触发条件                          | 对应行为                            | 关键特性                   |
| ----------- | ---- | ----------- | ----------------------------- | ------------------------------- | ---------------------- |
| `pending`   | 等待中  | 异步任务执行中，无结果 | 新建 `new Promise` 时的初始状态       | 仅等待，无回调执行                       | 唯一可转变的初始状态             |
| `fulfilled` | 已成功  | 异步任务完成，返回结果 | 调用 `resolve(结果)`              | 触发 `.then()` 第一个回调              | 状态不可逆，多次 resolve 仅首次有效 |
| `rejected`  | 已失败  | 异步任务出错，返回异常 | 调用 `reject(错误)` 或代码抛出 `throw` | 触发 `.catch()` 或 `.then()` 第二个回调 | 状态不可逆，多次 reject 仅首次有效  |
## 0.2 核心规则（精简版）

1. 状态仅能 `pending→fulfilled` / `pending→rejected`，不可逆；
2. `resolve/reject` 的参数会传给对应回调；
3. 未捕获的 `rejected` 会触发控制台报错。


## 0.3 总结

1. Promise 只有 3 种状态，核心是 `pending` 向另外两种状态的不可逆转变；
2. `resolve`/`reject` 是状态转变的唯一触发方式，对应 `.then()`/`.catch()` 回调执行；
3. 状态一旦确定，后续调用 `resolve/reject` 均无效。


