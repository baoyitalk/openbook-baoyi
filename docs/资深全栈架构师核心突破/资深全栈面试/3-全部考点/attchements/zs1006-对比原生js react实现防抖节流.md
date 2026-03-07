---
tags:
  - 资深全栈面试
aliases:
  - 防抖节流用原生js与Hooks实现
---
# 好！我从头讲，保证你懂

---

# 先忘掉 React，看原生 JS

## 普通网页（不用 React）

```html
<!DOCTYPE html>
<html>
<body>
  <input id="search" type="text">
  <div id="result"></div>

  <script>
    // 防抖函数
    function debounce(fn, delay) {
      let timer = null;
      return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
      };
    }
  
    // 搜索函数
    function search(keyword) {
      console.log('搜索:', keyword);
      document.getElementById('result').innerText = '搜索: ' + keyword;
    }
  
    // 创建防抖版本的搜索函数（只创建一次）
    const debouncedSearch = debounce(search, 500);
  
    // 绑定事件（只绑定一次）
    document.getElementById('search').addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });
  </script>
</body>
</html>
```

^fphwjk

**关键：**
- `debouncedSearch` **只创建一次**
- 事件监听器**只绑定一次**
- 无论你输入多少次，都是**同一个函数**
- 防抖正常工作

---

# React 的问题：函数组件会重复执行

```javascript
function Search() {
  const [keyword, setKeyword] = useState('');

  console.log('组件执行了');  // 每次渲染都会打印

  // ❌ 这行代码每次渲染都会执行
  const debouncedSearch = debounce((value) => {
    console.log('搜索:', value);
  }, 500);

  return (
    <input 
      value={keyword}
      onChange={(e) => {
        setKeyword(e.target.value);  // 触发重新渲染
        debouncedSearch(e.target.value);
      }}
    />
  );
}
```

**发生了什么：**

```
1. 首次渲染
   - 执行 Search 函数
   - 创建 debouncedSearch1
 
2. 你输入 "a"
   - setKeyword("a")
   - 触发重新渲染
   - 再次执行 Search 函数  ← 关键
   - 创建 debouncedSearch2  ← 新的函数
 
3. 你输入 "b"
   - setKeyword("ab")
   - 触发重新渲染
   - 再次执行 Search 函数
   - 创建 debouncedSearch3  ← 又是新的函数
```

---

# 对比：原生 JS vs React

## 原生 JS

```javascript
// 这段代码只执行一次
const debouncedSearch = debounce(search, 500);

// 无论触发多少次事件，都是同一个函数
input.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);  // 同一个函数
});
```

## React（不用 useCallback）

```javascript
function Search() {
  // ❌ 这段代码每次渲染都执行
  const debouncedSearch = debounce((value) => {
    console.log('搜索:', value);
  }, 500);

  // 每次渲染，debouncedSearch 都是新的函数
  return <input onChange={(e) => debouncedSearch(e.target.value)} />;
}
```

---

# 为什么 React 会重复执行？

## 原生 JS：代码只执行一次

```javascript
// 页面加载时执行一次
const debouncedSearch = debounce(search, 500);

// 之后无论发生什么，debouncedSearch 都不会重新创建
```

## React：函数组件每次渲染都执行

```javascript
function Search() {
  const [keyword, setKeyword] = useState('');

  // 每次渲染，这个函数从头到尾执行一遍
  const debouncedSearch = debounce(...);  // 每次都创建新的

  return <input />;
}

// 渲染 1 次 → Search 函数执行 1 次
// 渲染 2 次 → Search 函数执行 2 次
// 渲染 3 次 → Search 函数执行 3 次
```

---

# 实际测试：看看到底创建了几个函数

## 不用 useCallback

```javascript
function Search() {
  const [keyword, setKeyword] = useState('');

  const debouncedSearch = debounce((value) => {
    console.log('搜索:', value);
  }, 500);

  // 打印函数的内存地址（每次不一样说明是新函数）
  console.log('debouncedSearch:', debouncedSearch);

  return (
    <input 
      value={keyword}
      onChange={(e) => {
        setKeyword(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}
```

**控制台输出：**

```
// 首次渲染
debouncedSearch: ƒ (...args) { ... }  // 地址: 0x1234

// 输入 "a"，触发重新渲染
debouncedSearch: ƒ (...args) { ... }  // 地址: 0x5678  ← 新的函数

// 输入 "b"，触发重新渲染
debouncedSearch: ƒ (...args) { ... }  // 地址: 0x9abc  ← 又是新的函数
```

**每次都是新函数，地址不一样**

---

## 用 useCallback

```javascript
function Search() {
  const [keyword, setKeyword] = useState('');

  const debouncedSearch = useCallback(
    debounce((value) => {
      console.log('搜索:', value);
    }, 500),
    []
  );

  console.log('debouncedSearch:', debouncedSearch);

  return (
    <input 
      value={keyword}
      onChange={(e) => {
        setKeyword(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}
```

**控制台输出：**

```
// 首次渲染
debouncedSearch: ƒ (...args) { ... }  // 地址: 0x1234

// 输入 "a"，触发重新渲染
debouncedSearch: ƒ (...args) { ... }  // 地址: 0x1234  ← 同一个函数

// 输入 "b"，触发重新渲染
debouncedSearch: ƒ (...args) { ... }  // 地址: 0x1234  ← 还是同一个函数
```

**始终是同一个函数，地址一样**

---

# 用图解释

## 原生 JS

```
页面加载
  ↓
创建 debouncedSearch（只创建一次）
  ↓
用户输入 "a" → 调用 debouncedSearch（同一个函数）
  ↓
用户输入 "b" → 调用 debouncedSearch（同一个函数）
  ↓
用户输入 "c" → 调用 debouncedSearch（同一个函数）
```

## React 不用 useCallback

```
首次渲染
  ↓
创建 debouncedSearch1
  ↓
用户输入 "a" → setKeyword → 重新渲染
  ↓
创建 debouncedSearch2（新的函数）
  ↓
用户输入 "b" → setKeyword → 重新渲染
  ↓
创建 debouncedSearch3（新的函数）
  ↓
用户输入 "c" → setKeyword → 重新渲染
  ↓
创建 debouncedSearch4（新的函数）
```

## React 用 useCallback

```
首次渲染
  ↓
创建 debouncedSearch（useCallback 缓存）
  ↓
用户输入 "a" → setKeyword → 重新渲染
  ↓
返回缓存的 debouncedSearch（同一个函数）
  ↓
用户输入 "b" → setKeyword → 重新渲染
  ↓
返回缓存的 debouncedSearch（同一个函数）
  ↓
用户输入 "c" → setKeyword → 重新渲染
  ↓
返回缓存的 debouncedSearch（同一个函数）
```

---

# 核心区别

## 原生 JS

```javascript
// 这段代码只执行一次
const debouncedSearch = debounce(search, 500);

// 之后 debouncedSearch 永远不变
```

## React 不用 useCallback

```javascript
function Search() {
  // 这段代码每次渲染都执行
  const debouncedSearch = debounce(search, 500);

  // 每次渲染，debouncedSearch 都是新的
}
```

## React 用 useCallback

```javascript
function Search() {
  // useCallback 会缓存函数
  const debouncedSearch = useCallback(
    debounce(search, 500),
    []
  );

  // 每次渲染，返回缓存的函数（同一个）
}
```

---

# 再说一遍：为什么原生 JS 不需要 useCallback？

**因为原生 JS 的代码只执行一次**

```javascript
// 这段代码只在页面加载时执行一次
const debouncedSearch = debounce(search, 500);

// 之后无论发生什么，debouncedSearch 都不会重新创建
// 所以不需要 useCallback
```

**React 的函数组件每次渲染都执行**

```javascript
function Search() {
  // 每次渲染，这个函数从头到尾执行一遍
  const debouncedSearch = debounce(search, 500);  // 每次都创建新的

  // 所以需要 useCallback 来缓存
}
```

---

# 简单类比

## 原生 JS = 你只买一次菜

```javascript
// 买一次菜
const vegetables = ['白菜', '萝卜'];

// 之后一直用这些菜
cook(vegetables);  // 用同一批菜
cook(vegetables);  // 用同一批菜
cook(vegetables);  // 用同一批菜
```

## React 不用 useCallback = 每次做饭都买新菜

```javascript
function Cook() {
  // 每次做饭都买新菜
  const vegetables = ['白菜', '萝卜'];  // 新的菜

  return <div>做饭</div>;
}

// 做饭 1 次 → 买菜 1 次
// 做饭 2 次 → 买菜 2 次
// 做饭 3 次 → 买菜 3 次
```

## React 用 useCallback = 买一次菜，一直用

```javascript
function Cook() {
  // useCallback = 把菜放冰箱，一直用
  const vegetables = useCallback(['白菜', '萝卜'], []);

  return <div>做饭</div>;
}

// 做饭 1 次 → 用冰箱里的菜
// 做饭 2 次 → 用冰箱里的菜
// 做饭 3 次 → 用冰箱里的菜
```

---

# 现在讲 useState、useRef、useCallback 的区别

## useState：存数据，改变会触发渲染

```javascript
const [count, setCount] = useState(0);

setCount(1);  // 触发重新渲染，UI 更新
```

**用途：**
- 需要显示在页面上的数据
- 改变时需要更新 UI

---

## useRef：存数据，改变不触发渲染

```javascript
const countRef = useRef(0);

countRef.current = 1;  // 不触发重新渲染，UI 不更新
```

**用途：**
- 不需要显示在页面上的数据
- DOM 元素的引用
- 计数器、标记位

---

## useCallback：缓存函数

```javascript
const handleClick = useCallback(() => {
  console.log('点击');
}, []);

// 每次渲染，handleClick 都是同一个函数
```

**用途：**
- 防抖、节流函数
- 传给子组件的函数（避免子组件重新渲染）
- 需要保持引用不变的函数

---

# 对比表格

| Hook | 存什么 | 改变是否触发渲染 | 用途 |
|------|--------|------------------|------|
| useState | 数据 | 是 | 需要显示的数据 |
| useRef | 数据/DOM | 否 | 不需要显示的数据、DOM 引用 |
| useCallback | 函数 | 否 | 缓存函数，保持引用不变 |

---

# 实际例子

```javascript
function Search() {
  // useState：存输入的关键词（需要显示）
  const [keyword, setKeyword] = useState('');

  // useRef：存渲染次数（不需要显示）
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  // useCallback：缓存防抖函数（保持引用不变）
  const debouncedSearch = useCallback(
    debounce((value) => {
      console.log('搜索:', value);
    }, 500),
    []
  );

  return (
    <div>
      <p>渲染次数: {renderCountRef.current}</p>
      <input 
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          debouncedSearch(e.target.value);
        }}
      />
    </div>
  );
}
```

---

# 一句话总结

- **原生 JS 不需要 useCallback**，因为代码只执行一次
- **React 需要 useCallback**，因为函数组件每次渲染都执行，会创建新函数
- **useState** 存需要显示的数据，改变触发渲染
- **useRef** 存不需要显示的数据，改变不触发渲染
- **useCallback** 缓存函数，保持引用不变

懂了吗？