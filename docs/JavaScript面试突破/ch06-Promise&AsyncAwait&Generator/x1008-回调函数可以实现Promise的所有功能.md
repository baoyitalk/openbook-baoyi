

既然回调函数可以实现所有Promise为何还要用Promise


|场景|回调|Promise|
|---|---|---|
|串行|嵌套|.then 链|
|并行|手动计数|Promise.all|
|竞速|手动标记|Promise.race|
|超时|手动标记|Promise.race|
|重试|递归回调|循环 await|
|取消|很难|AbortController|

好，你说得对，继续挖：

---

**视觉只是表象，真正的问题是：**

**1. 并行怎么办？**

同时请求 3 个接口，全部完成后再执行：

**回调版：**

```javascript
let count = 0
let results = []

function done() {
  if (count === 3) {
    console.log(results)  // 终于齐了
  }
}

getUser((user) => {
  results[0] = user
  count++
  done()
})

getOrders((orders) => {
  results[1] = orders
  count++
  done()
})

getDetail((detail) => {
  results[2] = detail
  count++
  done()
})
```

**Promise 版：**

```javascript
Promise.all([getUser(), getOrders(), getDetail()])
  .then(([user, orders, detail]) => {
    console.log(user, orders, detail)
  })
```

---

**2. 竞速怎么办？**

3 个接口谁先返回用谁：

**回调版：**

```javascript
let finished = false

getFromAPI1((data) => {
  if (!finished) {
    finished = true
    console.log(data)
  }
})

getFromAPI2((data) => {
  if (!finished) {
    finished = true
    console.log(data)
  }
})

getFromAPI3((data) => {
  if (!finished) {
    finished = true
    console.log(data)
  }
})
```

**Promise 版：**

```javascript
Promise.race([getFromAPI1(), getFromAPI2(), getFromAPI3()])
  .then(data => console.log(data))
```

---

**3. 超时控制怎么办？**

请求超过 3 秒就放弃：

**回调版：**

```javascript
let done = false

setTimeout(() => {
  if (!done) {
    done = true
    console.log('超时了')
  }
}, 3000)

fetchData((data) => {
  if (!done) {
    done = true
    console.log(data)
  }
})
```

**Promise 版：**

```javascript
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject('超时了'), ms)
  })
}

Promise.race([fetchData(), timeout(3000)])
  .then(data => console.log(data))
  .catch(err => console.log(err))
```

---

**4. 重试机制怎么办？**

失败了重试 3 次：

**回调版：**

```javascript
function fetchWithRetry(callback, retries = 3) {
  fetchData((err, data) => {
    if (err) {
      if (retries > 0) {
        fetchWithRetry(callback, retries - 1)
      } else {
        callback(err, null)
      }
    } else {
      callback(null, data)
    }
  })
}
```

**Promise 版：**

```javascript
async function fetchWithRetry(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchData()
    } catch (e) {
      if (i === retries - 1) throw e
    }
  }
}
```

---

**本质区别：**

| 场景 | 回调 | Promise |
|------|------|---------|
| 串行 | 嵌套 | .then 链 |
| 并行 | 手动计数 | Promise.all |
| 竞速 | 手动标记 | Promise.race |
| 超时 | 手动标记 | Promise.race |
| 重试 | 递归回调 | 循环 await |
| 取消 | 很难 | AbortController |

---

**一句话：**

> 回调能实现，但你得自己造轮子。Promise 把这些模式内置了。

就像你能用汇编写网站，但你不会。