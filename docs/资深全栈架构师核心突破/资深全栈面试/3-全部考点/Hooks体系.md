
好！用**第一性原理彻底拆解 React Hooks**，从底层原理到实战，让你完全理解。

---

# 第一性原理：React 的渲染机制

## React 组件本质：函数

```javascript
function App() {
  const name = '张三';
  const age = 18;

  return (
    <div>
      <p>姓名: {name}</p>
      <p>年龄: {age}</p>
    </div>
  );
}
```

**核心事实：**
- 组件就是一个函数
- 每次渲染，函数都会**重新执行**
- 函数里的变量都会**重新创建**

**类比：**
- 就像每次打开一个 Word 文档
- 文档里的内容都是重新加载的 ^7anspj
- 上次的修改如果没保存，就丢失了

---

## 问题：如何在渲染之间保存数据？

```javascript
function Counter() {
  let count = 0;  // ❌ 每次渲染都重置为 0

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => count++}>增加</button>
    </div>
  );
}
```

**问题：**
- 点击按钮，`count` 变成 1
- 但组件不会重新渲染
- 即使渲染了，`count` 又重置为 0

**解决方案：Hooks**

---

# 完整 Hooks 体系

| Hook | 作用 | 是否触发渲染 | 核心机制 |
|------|------|------------|---------|
| useState | 保存 UI 状态 | ✅ | 状态 + 更新函数 |
| useEffect | 处理副作用 | ❌ | 依赖追踪 + 清理函数 |
| useRef | 保存任意数据 | ❌ | 可变对象 |
| useCallback | 缓存函数 | ❌ | 依赖追踪 + 函数缓存 |
| useMemo | 缓存计算结果 | ❌ | 依赖追踪 + 值缓存 |

---

# 1. useState：保存 UI 状态

## 第一性原理：状态 + 触发渲染

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

**核心机制：**
```javascript
const [count, setCount] = useState(0);

// React 内部实现（简化版）
let state = 0;  // 保存在 React 内部
function useState(initialValue) {
  if (state === undefined) {
    state = initialValue;
  }

  function setState(newValue) {
    state = newValue;
    render();  // 触发重新渲染
  }

  return [state, setState];
}
```

**类比：**
- `useState` 就像一个**银行账户**
- `count` 是账户余额（只读）
- `setCount` 是存款/取款操作（会触发渲染）

---

# 2. useEffect：处理副作用

## 第一性原理：在渲染后执行代码

### 什么是副作用？

**副作用 = 与渲染无关的操作**

```javascript
function App() {
  const [count, setCount] = useState(0);

  // ❌ 直接在组件里写副作用
  document.title = `点击了 ${count} 次`;  // 每次渲染都执行

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

**问题：**
- 副作用代码每次渲染都执行
- 无法控制执行时机
- 无法清理（比如定时器、事件监听）

---

## useEffect 的作用：在渲染后执行副作用

```javascript
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `点击了 ${count} 次`;
  }, [count]);  // 依赖 count，count 变化时执行

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

**执行流程：**
```
1. 组件渲染（JSX 转成 DOM）
2. 浏览器绘制页面
3. useEffect 执行（渲染后）
```

**类比：**
- 渲染 = 画画
- useEffect = 画完后签名

---

## useEffect 的依赖数组

### 1. 空依赖：只执行一次

```javascript
useEffect(() => {
  console.log('组件挂载');
}, []);  // 空数组，只在挂载时执行
```

**等价于类组件的 `componentDidMount`**

---

### 2. 有依赖：依赖变化时执行

```javascript
function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('张三');

  useEffect(() => {
    console.log('count 变化了:', count);
  }, [count]);  // 只依赖 count

  return (
    <div>
      <p>计数: {count}</p>
      <p>姓名: {name}</p>
      <button onClick={() => setCount(count + 1)}>增加计数</button>
      <button onClick={() => setName('李四')}>改名</button>
    </div>
  );
}
```

**执行流程：**
```
初始渲染：useEffect 执行
点击"增加计数"：count 变化，useEffect 执行
点击"改名"：name 变化，useEffect 不执行（依赖没变）
```

---

### 3. 无依赖：每次渲染都执行

```javascript
useEffect(() => {
  console.log('每次渲染都执行');
});  // 没有依赖数组
```

**一般不推荐，性能差**

---

## useEffect 的清理函数

```javascript
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('设置定时器');
    const timer = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  
    // 返回清理函数
    return () => {
      console.log('清除定时器');
      clearInterval(timer);
    };
  }, []);

  return <div>{count}</div>;
}
```

**执行流程：**
```
组件挂载：
1. 渲染
2. useEffect 执行，设置定时器

组件卸载：
1. 清理函数执行，清除定时器
```

**类比：**
- useEffect = 租房子
- 清理函数 = 退房时打扫卫生

---

## useEffect 的常见场景

### 1. 数据请求

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);  // userId 变化时重新请求

  if (loading) return <div>加载中...</div>;
  return <div>{user.name}</div>;
}
```

---

### 2. 订阅/取消订阅

```javascript
function Chat({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // 订阅
    const subscription = chatAPI.subscribe(roomId, (message) => {
      setMessages(msgs => [...msgs, message]);
    });
  
    // 清理：取消订阅
    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);

  return <div>{messages.map(msg => <p key={msg.id}>{msg.text}</p>)}</div>;
}
```

---

### 3. 事件监听

```javascript
function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
  
    // 添加监听
    window.addEventListener('resize', handleResize);
  
    // 清理：移除监听
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div>窗口宽度: {width}px</div>;
}
```

---

### 4. 同步到 localStorage

```javascript
function App() {
  const [count, setCount] = useState(() => {
    // 初始化时从 localStorage 读取
    const saved = localStorage.getItem('count');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    // count 变化时同步到 localStorage
    localStorage.setItem('count', count);
  }, [count]);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

---

# 3. useMemo：缓存计算结果

## 第一性原理：避免重复计算

```javascript
function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('张三');

  // ❌ 每次渲染都计算（即使 count 没变）
  const expensiveValue = computeExpensiveValue(count);

  return (
    <div>
      <p>计数: {count}</p>
      <p>姓名: {name}</p>
      <p>计算结果: {expensiveValue}</p>
      <button onClick={() => setCount(count + 1)}>增加计数</button>
      <button onClick={() => setName('李四')}>改名</button>
    </div>
  );
}

function computeExpensiveValue(count) {
  console.log('计算中...');
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += count;
  }
  return result;
}
```

**问题：**
- 点击"改名"，`name` 变化，组件重新渲染
- `computeExpensiveValue` 重新执行（虽然 `count` 没变）
- 浪费性能

---

## useMemo 的作用：缓存计算结果

```javascript
function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('张三');

  // ✅ 只有 count 变化时才重新计算
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(count);
  }, [count]);

  return (
    <div>
      <p>计数: {count}</p>
      <p>姓名: {name}</p>
      <p>计算结果: {expensiveValue}</p>
      <button onClick={() => setCount(count + 1)}>增加计数</button>
      <button onClick={() => setName('李四')}>改名</button>
    </div>
  );
}
```

**核心机制：**
```javascript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(count);
}, [count]);

// React 内部实现（简化版）
let cachedValue = null;
let cachedDeps = null;

function useMemo(factory, deps) {
  if (cachedDeps === null || depsChanged(cachedDeps, deps)) {
    cachedValue = factory();  // 重新计算
    cachedDeps = deps;
  }
  return cachedValue;  // 返回缓存值
}
```

**类比：**
- useMemo = 计算器的记忆功能
- 输入相同，直接返回上次的结果
- 输入变化，才重新计算

---

## useMemo vs useCallback

```javascript
// useMemo：缓存计算结果（值）
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(count);
}, [count]);

// useCallback：缓存函数
const handleClick = useCallback(() => {
  console.log('点击');
}, []);

// 等价写法
const handleClick = useMemo(() => {
  return () => {
    console.log('点击');
  };
}, []);
```

**区别：**
- `useMemo` 返回**计算结果**（任意值）
- `useCallback` 返回**函数本身**

**记忆口诀：**
- `useMemo(() => value)` = 缓存值
- `useCallback(fn)` = 缓存函数

---

## useMemo 的使用场景

### 1. 复杂计算

```javascript
function TodoList({ todos, filter }) {
  // 过滤和排序是复杂计算
  const filteredTodos = useMemo(() => {
    console.log('过滤中...');
    return todos
      .filter(todo => {
        if (filter === 'all') return true;
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
      })
      .sort((a, b) => b.priority - a.priority);
  }, [todos, filter]);

  return (
    <ul>
      {filteredTodos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

---

### 2. 避免子组件无意义渲染

```javascript
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('张三');

  // ❌ 每次渲染都创建新对象
  const user = { name, age: 18 };

  // ✅ 只有 name 变化时才创建新对象
  const user = useMemo(() => {
    return { name, age: 18 };
  }, [name]);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <Child user={user} />
    </div>
  );
}

const Child = React.memo(({ user }) => {
  console.log('Child 渲染');
  return <div>{user.name}</div>;
});
```

**为什么需要 useMemo？**
- 对象/数组每次渲染都是新的引用
- 即使内容相同，`React.memo` 也会认为 props 变了
- 用 `useMemo` 缓存对象，避免子组件无意义渲染

---

### 3. 依赖引用类型

```javascript
function App() {
  const [count, setCount] = useState(0);

  // ❌ 每次渲染都创建新数组
  const options = [1, 2, 3];

  useEffect(() => {
    console.log('options 变化');
  }, [options]);  // 每次渲染都执行（引用变了）

  return <div>{count}</div>;
}

// ✅ 用 useMemo 缓存
function App() {
  const [count, setCount] = useState(0);

  const options = useMemo(() => [1, 2, 3], []);

  useEffect(() => {
    console.log('options 变化');
  }, [options]);  // 只执行一次

  return <div>{count}</div>;
}
```

---

# 完整对比表

| Hook        | 作用       | 返回值                 | 依赖变化时 | 使用场景          |
| ----------- | -------- | ------------------- | ----- | ------------- |
| useState    | 保存 UI 状态 | `[state, setState]` | 触发渲染  | 需要显示的数据       |
| useEffect   | 处理副作用    | 清理函数                | 重新执行  | 数据请求、订阅、事件监听  |
| useRef      | 保存任意数据   | `{ current }`       | 不触发渲染 | 定时器 ID、DOM 引用 |
| useCallback | 缓存函数     | 函数                  | 返回新函数 | 传给子组件、防抖节流    |
| useMemo     | 缓存计算结果   | 任意值                 | 重新计算  | 复杂计算、避免子组件渲染  |

^g893cg

---

# 完整示例：搜索列表

```javascript
function SearchList() {
  const [keyword, setKeyword] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // useRef：保存定时器 ID
  const timerRef = useRef(null);

  // useCallback：缓存防抖函数
  const debouncedSearch = useCallback((value) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  
    timerRef.current = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${value}`)
        .then(res => res.json())
        .then(data => {
          setItems(data);
          setLoading(false);
        });
    }, 300);
  }, []);

  // useEffect：清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // useMemo：缓存过滤结果
  const filteredItems = useMemo(() => {
    console.log('过滤中...');
    return items.filter(item => 
      item.title.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [items, keyword]);

  const handleChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  return (
    <div>
      <input value={keyword} onChange={handleChange} />
      {loading && <div>搜索中...</div>}
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

# 记忆口诀

- **useState**：保存状态，触发渲染
- **useEffect**：渲染后执行，可以清理
- **useRef**：跨渲染记事本，不触发渲染
- **useCallback**：缓存函数，避免子组件渲染
- **useMemo**：缓存值，避免重复计算

**一句话总结：**
- `useState` 管状态
- `useEffect` 管副作用
- `useRef` 管数据
- `useCallback` 管函数
- `useMemo` 管计算