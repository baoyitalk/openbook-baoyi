

# 不一定！有多种方式

---

# 方式 1：用普通变量（❌ 错误）

```javascript
function useDebounce(callback, delay) {
  let timer = null;  // ❌ 每次渲染都重置为 null

  const debouncedCallback = useCallback((...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  return debouncedCallback;
}
```

**问题：**

```
1. 首次渲染
   - timer = null
   - 创建 debouncedCallback1
 
2. 用户输入 "a"，触发重新渲染
   - timer = null  ← 重置了！之前的 timer 丢失
   - 创建 debouncedCallback2
 
3. 用户输入 "b"，触发重新渲染
   - timer = null  ← 又重置了
   - 创建 debouncedCallback3
```

^qf9xka

**结果：防抖失效，因为 timer 每次都被重置**

---

# 方式 2：用 useRef（✅ 正确）

```javascript
function useDebounce(callback, delay) {
  const timerRef = useRef(null);  // ✅ 跨渲染保存

  const debouncedCallback = useCallback((...args) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  return debouncedCallback;
}
```

^xnxjh6

**为什么可以：**

```
1. 首次渲染
   - timerRef.current = null
   - 创建 debouncedCallback
 
2. 用户输入 "a"，触发重新渲染
   - timerRef.current 还是之前的值  ← 没有重置
   - 可以正确清除之前的定时器
 
3. 用户输入 "b"，触发重新渲染
   - timerRef.current 还是之前的值
   - 可以正确清除之前的定时器
```

**结果：防抖正常工作**

---

# 方式 3：用闭包（✅ 正确）

```javascript
function useDebounce(callback, delay) {
  const [debouncedCallback] = useState(() => {
    let timer = null;  // ✅ 闭包保存
  
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  });

  return debouncedCallback;
}
```

**为什么可以：**

```javascript
// useState 只在首次渲染时执行
const [debouncedCallback] = useState(() => {
  let timer = null;  // 这个 timer 被闭包保存

  return (...args) => {
    // 这个函数可以访问外层的 timer
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
});

// 之后的渲染，debouncedCallback 不变
// timer 也不会被重置
```

**但有问题：**

```javascript
function SearchBox() {
  const [keyword, setKeyword] = useState('');

  const search = (value) => {
    console.log('搜索:', value);
    console.log('当前关键词:', keyword);  // ❌ 永远是空字符串
  };

  const debouncedSearch = useDebounce(search, 500);

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

**问题：闭包陷阱**

```
1. 首次渲染，keyword = ""
   - search 函数捕获 keyword = ""
   - debouncedSearch 捕获 search 函数
 
2. 用户输入 "a"，keyword = "a"
   - 但 debouncedSearch 里的 search 还是旧的
   - search 里的 keyword 还是 ""
 
3. 500ms 后执行
   - console.log('当前关键词:', keyword)  // 输出 ""，不是 "a"
```

---

# 方式 4：用闭包 + useRef 解决闭包陷阱（✅ 正确）

```javascript
function useDebounce(callback, delay) {
  const callbackRef = useRef(callback);

  // 保持 callback 最新
  callbackRef.current = callback;

  const [debouncedCallback] = useState(() => {
    let timer = null;
  
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callbackRef.current(...args);  // 使用最新的 callback
      }, delay);
    };
  });

  return debouncedCallback;
}
```

**为什么可以：**

```javascript
// callbackRef.current 始终指向最新的 callback
callbackRef.current = callback;

// 执行时使用最新的 callback
callbackRef.current(...args);
```

---

# 方式 5：用 useMemo（✅ 正确）

```javascript
function useDebounce(callback, delay) {
  const timerRef = useRef(null);
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const debouncedCallback = useMemo(() => {
    return (...args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    };
  }, [delay]);

  return debouncedCallback;
}
```

**useMemo vs useCallback：**

```javascript
// useCallback
const debouncedCallback = useCallback((...args) => {
  // ...
}, [delay]);

// useMemo（效果一样）
const debouncedCallback = useMemo(() => {
  return (...args) => {
    // ...
  };
}, [delay]);

// useCallback 是 useMemo 的语法糖
useCallback(fn, deps) === useMemo(() => fn, deps)
```

---

# 方式 6：用外部变量（✅ 正确，但不推荐）

```javascript
let timer = null;  // 模块级变量

function useDebounce(callback, delay) {
  const debouncedCallback = useCallback((...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  return debouncedCallback;
}
```

**为什么可以：**

```javascript
// timer 在模块级别，不会被重置
let timer = null;

// 所有组件共享同一个 timer
```

**问题：**

```javascript
// 组件 A
function SearchBoxA() {
  const debouncedSearch = useDebounce(searchA, 500);
  // ...
}

// 组件 B
function SearchBoxB() {
  const debouncedSearch = useDebounce(searchB, 500);
  // ...
}

// 问题：A 和 B 共享同一个 timer
// A 的防抖会被 B 打断，反之亦然
```

---

# 对比总结

| 方式 | 是否正确 | 问题 |
|------|----------|------|
| 普通变量 | ❌ | 每次渲染重置 |
| useRef | ✅ | 无 |
| 闭包 | ⚠️ | 闭包陷阱 |
| 闭包 + useRef | ✅ | 无 |
| useMemo | ✅ | 无 |
| 外部变量 | ⚠️ | 多个组件共享 |

---

# 为什么推荐 useRef？

## 1. 简单直观

```javascript
const timerRef = useRef(null);

// 设置
timerRef.current = setTimeout(...);

// 清除
clearTimeout(timerRef.current);
```

## 2. 不会有闭包陷阱

```javascript
// useRef 的值始终是最新的
callbackRef.current = callback;

// 执行时自动使用最新的值
callbackRef.current(...args);
```

## 3. 每个组件独立

```javascript
// 每个组件有自己的 timerRef
function SearchBoxA() {
  const timerRef = useRef(null);  // A 的 timer
}

function SearchBoxB() {
  const timerRef = useRef(null);  // B 的 timer
}
```

---

# 最简单的写法（不用 useRef）

如果你真的不想用 useRef，可以这样：

```javascript
function useDebounce(callback, delay) {
  const [debouncedCallback] = useState(() => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => callback(...args), delay);
    };
  });

  return debouncedCallback;
}
```

**但有闭包陷阱，需要这样用：**

```javascript
function SearchBox() {
  const [keyword, setKeyword] = useState('');

  // ❌ 不要这样
  const search = () => {
    console.log(keyword);  // 闭包陷阱
  };

  // ✅ 要这样
  const debouncedSearch = useDebounce((value) => {
    console.log(value);  // 直接用参数
  }, 500);

  return (
    <input 
      value={keyword}
      onChange={(e) => {
        setKeyword(e.target.value);
        debouncedSearch(e.target.value);  // 传参数
      }}
    />
  );
}
```

---

# 一句话

**用 useRef 最简单、最安全、最推荐**

不用 useRef 也可以，但要小心闭包陷阱。

懂了吗？