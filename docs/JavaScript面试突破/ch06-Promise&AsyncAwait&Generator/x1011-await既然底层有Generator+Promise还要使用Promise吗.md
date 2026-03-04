
必须要用Promise

# 好问题！不是重复，而是配合使用

---

## 为什么 async/await 里还要用 Promise？

### 原因1：某些场景 Promise 更合适

```javascript
// ❌ 用 await 很笨拙
async function fetchAll() {
  const user = await fetchUser();
  const posts = await fetchPosts();
  const comments = await fetchComments();
  // 串行执行，慢！总共 3 秒
}

// ✅ 用 Promise.all 更好
async function fetchAll() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);
  // 并行执行，快！总共 1 秒
}
```

**Promise.all 无法用纯 await 替代！**

---

### 原因2：需要 Promise 的特殊方法

```javascript
// Promise.race - 竞速
async function fetchWithTimeout() {
  const result = await Promise.race([
    fetch('/api/data'),
    new Promise((_, reject) => 
      setTimeout(() => reject('超时'), 5000)
    )
  ]);
  return result;
}

// Promise.allSettled - 等所有完成（不管成功失败）
async function fetchMultiple() {
  const results = await Promise.allSettled([
    fetch('/api/user'),
    fetch('/api/posts'),
    fetch('/api/comments')
  ]);

  results.forEach(result => {
    if (result.status === 'fulfilled') {
      console.log('成功:', result.value);
    } else {
      console.log('失败:', result.reason);
    }
  });
}

// Promise.any - 任意一个成功就返回
async function fetchFromMultipleSources() {
  const data = await Promise.any([
    fetch('https://api1.com/data'),
    fetch('https://api2.com/data'),
    fetch('https://api3.com/data')
  ]);
  return data;
}
```

**这些 Promise 方法无法用 await 替代！**

---

## 实际场景对比

### 场景1：并行请求

```javascript
// ❌ 错误：串行执行（慢）
async function loadPage() {
  const user = await fetch('/api/user');
  const posts = await fetch('/api/posts');
  const ads = await fetch('/api/ads');
  // 总耗时：3 秒（1+1+1）
}

// ✅ 正确：并行执行（快）
async function loadPage() {
  const [user, posts, ads] = await Promise.all([
    fetch('/api/user'),
    fetch('/api/posts'),
    fetch('/api/ads')
  ]);
  // 总耗时：1 秒（同时进行）
}
```

---

### 场景2：超时控制

```javascript
// 需要 Promise 来实现超时
async function fetchWithTimeout(url, timeout = 5000) {
  return await Promise.race([
    fetch(url),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('请求超时')), timeout)
    )
  ]);
}

// 使用
try {
  const data = await fetchWithTimeout('/api/slow', 3000);
} catch (error) {
  console.log(error.message);  // '请求超时'
}
```

**纯 await 无法实现超时！**

---

### 场景3：容错处理

```javascript
// 多个请求，有的失败也继续
async function loadPageData() {
  const results = await Promise.allSettled([
    fetch('/api/user'),
    fetch('/api/posts'),
    fetch('/api/ads')
  ]);

  const user = results[0].status === 'fulfilled' 
    ? results[0].value 
    : null;
  
  const posts = results[1].status === 'fulfilled' 
    ? results[1].value 
    : [];
  
  const ads = results[2].status === 'fulfilled' 
    ? results[2].value 
    : [];

  return { user, posts, ads };
}
```

**即使某个请求失败，其他请求的数据也能拿到！**

---

### 场景4：重试逻辑

```javascript
// 需要手动创建 Promise
function fetchWithRetry(url, retries = 3) {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        return resolve(response);
      } catch (error) {
        if (i === retries - 1) {
          return reject(error);
        }
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    }
  });
}

// 使用
const data = await fetchWithRetry('/api/data', 3);
```

---

## 什么时候用 Promise？什么时候用 await？

### 用 await 的场景

```javascript
// 1. 简单的顺序操作
async function simple() {
  const response = await fetch('/api');
  const data = await response.json();
  return data;
}

// 2. 需要中间结果
async function withIntermediateResult() {
  const user = await fetchUser();
  const posts = await fetchPosts(user.id);  // 依赖 user
  return posts;
}

// 3. 错误处理
async function withErrorHandling() {
  try {
    const data = await fetch('/api');
    return data;
  } catch (error) {
    console.error(error);
  }
}
```

---

### 用 Promise 的场景

```javascript
// 1. 并行操作
const [a, b, c] = await Promise.all([
  fetchA(),
  fetchB(),
  fetchC()
]);

// 2. 竞速
const fastest = await Promise.race([
  fetchFromServer1(),
  fetchFromServer2()
]);

// 3. 容错
const results = await Promise.allSettled([
  mayFail1(),
  mayFail2()
]);

// 4. 任意成功
const data = await Promise.any([
  trySource1(),
  trySource2(),
  trySource3()
]);

// 5. 手动控制
const promise = new Promise((resolve, reject) => {
  // 复杂的异步逻辑
  setTimeout(() => resolve('done'), 1000);
});
await promise;
```

---

## 混合使用的实际例子

### 例子1：页面加载

```javascript
async function loadPage() {
  try {
    // 并行加载关键数据
    const [user, config] = await Promise.all([
      fetch('/api/user').then(r => r.json()),
      fetch('/api/config').then(r => r.json())
    ]);
  
    // 根据用户数据加载个性化内容
    const posts = await fetch(`/api/posts/${user.id}`)
      .then(r => r.json());
  
    // 非关键数据可以失败
    const [ads, recommendations] = await Promise.allSettled([
      fetch('/api/ads').then(r => r.json()),
      fetch('/api/recommendations').then(r => r.json())
    ]);
  
    return {
      user,
      config,
      posts,
      ads: ads.status === 'fulfilled' ? ads.value : [],
      recommendations: recommendations.status === 'fulfilled' 
        ? recommendations.value 
        : []
    };
  } catch (error) {
    console.error('页面加载失败:', error);
    throw error;
  }
}
```

---

### 例子2：文件上传

```javascript
async function uploadFiles(files) {
  // 限制并发数量
  const limit = 3;
  const results = [];

  for (let i = 0; i < files.length; i += limit) {
    const batch = files.slice(i, i + limit);
  
    // 每批并行上传
    const batchResults = await Promise.allSettled(
      batch.map(file => uploadFile(file))
    );
  
    results.push(...batchResults);
  }

  return results;
}

async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  return response.json();
}
```

---

### 例子3：数据预加载

```javascript
class DataCache {
  constructor() {
    this.cache = new Map();
  }

  async get(key, fetcher) {
    // 如果缓存中有，直接返回
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
  
    // 如果正在加载，等待同一个 Promise
    if (this.cache.has(`loading:${key}`)) {
      return await this.cache.get(`loading:${key}`);
    }
  
    // 创建新的 Promise
    const promise = fetcher();
    this.cache.set(`loading:${key}`, promise);
  
    try {
      const data = await promise;
      this.cache.set(key, data);
      this.cache.delete(`loading:${key}`);
      return data;
    } catch (error) {
      this.cache.delete(`loading:${key}`);
      throw error;
    }
  }
}

// 使用
const cache = new DataCache();

async function loadUser(id) {
  return cache.get(`user:${id}`, () => 
    fetch(`/api/user/${id}`).then(r => r.json())
  );
}
```

---

## 为什么不能完全用 await 替代 Promise？

### 1. await 是串行的

```javascript
// 这样写是串行的（慢）
async function bad() {
  const a = await fetchA();  // 等 1 秒
  const b = await fetchB();  // 再等 1 秒
  const c = await fetchC();  // 再等 1 秒
  // 总共 3 秒
}

// 必须用 Promise.all 才能并行（快）
async function good() {
  const [a, b, c] = await Promise.all([
    fetchA(),
    fetchB(),
    fetchC()
  ]);
  // 总共 1 秒
}
```

---

### 2. await 不能竞速

```javascript
// 想要"谁快用谁"，必须用 Promise.race
async function fetchFastest() {
  return await Promise.race([
    fetch('https://api1.com/data'),
    fetch('https://api2.com/data'),
    fetch('https://api3.com/data')
  ]);
}

// 纯 await 做不到！
```

---

### 3. await 不能容错

```javascript
// 想要"有的失败也继续"，必须用 Promise.allSettled
async function fetchAll() {
  const results = await Promise.allSettled([
    fetch('/api/user'),
    fetch('/api/posts'),
    fetch('/api/ads')
  ]);

  // 即使某个失败，其他的数据也能拿到
  return results;
}

// 用 try/catch 做不到这个效果
async function bad() {
  try {
    const user = await fetch('/api/user');
    const posts = await fetch('/api/posts');  // 如果这里失败
    const ads = await fetch('/api/ads');      // 这个就不会执行
  } catch (error) {
    // user 的数据也拿不到了
  }
}
```

---

## 总结

### async/await 和 Promise 的关系

```
async/await
    ↓
是 Promise 的语法糖（让代码更易读）
    ↓
但不能完全替代 Promise
    ↓
需要配合使用
```

---

### 使用原则

| 场景 | 用什么 | 原因 |
|------|--------|------|
| 简单顺序操作 | await | 代码清晰 |
| 并行操作 | Promise.all + await | 性能好 |
| 竞速 | Promise.race + await | 无法用纯 await |
| 容错 | Promise.allSettled + await | 无法用纯 await |
| 任意成功 | Promise.any + await | 无法用纯 await |
| 超时控制 | Promise.race + await | 无法用纯 await |
| 手动控制 | new Promise | 复杂逻辑 |

---

### 最佳实践

```javascript
async function bestPractice() {
  // 1. 能并行的就并行
  const [a, b] = await Promise.all([
    fetchA(),
    fetchB()
  ]);

  // 2. 有依赖的就串行
  const c = await fetchC(a.id);

  // 3. 可以失败的用 allSettled
  const [d, e] = await Promise.allSettled([
    fetchD(),
    fetchE()
  ]);

  // 4. 需要超时用 race
  const f = await Promise.race([
    fetchF(),
    timeout(5000)
  ]);

  return { a, b, c, d, e, f };
}
```

---

**所以不是重复，而是：**
- async/await 让代码更易读
- Promise 提供了 await 做不到的功能
- 两者配合使用才是最佳实践

明白了吗？