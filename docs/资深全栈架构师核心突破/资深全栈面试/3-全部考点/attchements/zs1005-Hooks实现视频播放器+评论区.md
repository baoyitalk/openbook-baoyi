
好！我用**一个完整的真实项目**，把所有 Hook 都串起来。

---

# 真实项目：视频播放器 + 评论区

这个项目包含：
- 视频播放/暂停
- 评论列表
- 添加评论
- 搜索评论
- 点赞评论

我会用到所有 Hook，并解释为什么用它。

---

# 完整代码

```javascript
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

function VideoPlayer() {
  // ========== useState：保存数据，显示在页面上 ==========

  const [isPlaying, setIsPlaying] = useState(false);        // 视频是否播放
  const [comments, setComments] = useState([]);             // 评论列表
  const [newComment, setNewComment] = useState('');         // 新评论内容
  const [searchKeyword, setSearchKeyword] = useState('');   // 搜索关键词
  const [likeCount, setLikeCount] = useState(0);            // 点赞数


  // ========== useRef：保存数据，但不触发渲染 ==========

  const videoRef = useRef(null);           // 保存 video 元素
  const inputRef = useRef(null);           // 保存 input 元素
  const renderCountRef = useRef(0);        // 保存渲染次数


  // ========== useEffect：数据变化后做事情 ==========

  // 1. 组件挂载时，从服务器获取评论
  useEffect(() => {
    fetch('/api/comments')
      .then(res => res.json())
      .then(data => setComments(data));
  }, []);  // 空依赖，只执行一次

  // 2. 评论变化时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);  // comments 变化时执行

  // 3. 点赞数变化时，修改页面标题
  useEffect(() => {
    document.title = `${likeCount} 个赞`;
  }, [likeCount]);

  // 4. 记录渲染次数
  useEffect(() => {
    renderCountRef.current++;
    console.log('组件渲染了', renderCountRef.current, '次');
  });


  // ========== useMemo：缓存计算结果 ==========

  // 过滤评论（根据搜索关键词）
  const filteredComments = useMemo(() => {
    console.log('正在过滤评论...');
    return comments.filter(comment => 
      comment.text.includes(searchKeyword)
    );
  }, [comments, searchKeyword]);  // comments 或 searchKeyword 变化时重新计算


  // ========== useCallback：缓存函数 ==========

  // 播放/暂停视频
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // 添加评论
  const addComment = useCallback(() => {
    if (newComment.trim() === '') return;
  
    const comment = {
      id: Date.now(),
      text: newComment,
      likes: 0
    };
  
    setComments([...comments, comment]);
    setNewComment('');
    inputRef.current.focus();  // 添加后聚焦输入框
  }, [comments, newComment]);

  // 点赞评论
  const likeComment = useCallback((id) => {
    setComments(comments.map(comment => 
      comment.id === id 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  }, [comments]);


  // ========== 渲染 ==========

  return (
    <div>
      {/* 视频播放器 */}
      <video 
        ref={videoRef} 
        src="/video.mp4" 
        style={{ width: '100%' }}
      />
      <button onClick={togglePlay}>
        {isPlaying ? '暂停' : '播放'}
      </button>
    
      {/* 点赞按钮 */}
      <button onClick={() => setLikeCount(likeCount + 1)}>
        ❤️ {likeCount}
      </button>
    
      {/* 搜索框 */}
      <input
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="搜索评论..."
      />
    
      {/* 添加评论 */}
      <div>
        <input
          ref={inputRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="写评论..."
        />
        <button onClick={addComment}>发送</button>
      </div>
    
      {/* 评论列表 */}
      <div>
        <h3>评论 ({filteredComments.length})</h3>
        {filteredComments.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            onLike={likeComment}
          />
        ))}
      </div>
    </div>
  );
}

// 评论组件
function CommentItem({ comment, onLike }) {
  console.log('CommentItem 渲染:', comment.text);

  return (
    <div style={{ border: '1px solid #ccc', padding: 10, margin: 10 }}>
      <p>{comment.text}</p>
      <button onClick={() => onLike(comment.id)}>
        👍 {comment.likes}
      </button>
    </div>
  );
}

export default VideoPlayer;
```

^0h74nz

---

# 逐个解释每个 Hook

---

## 1. useState：保存数据，显示在页面上

```javascript
const [isPlaying, setIsPlaying] = useState(false);
const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState('');
const [searchKeyword, setSearchKeyword] = useState('');
const [likeCount, setLikeCount] = useState(0);
```

**为什么用 useState？**
- 这些数据要显示在页面上
- 数据变化时，页面要更新

**例子：**
```javascript
// isPlaying 变化 → 按钮文字变化
<button>{isPlaying ? '暂停' : '播放'}</button>

// comments 变化 → 评论列表更新
{comments.map(comment => <div>{comment.text}</div>)}

// likeCount 变化 → 点赞数更新
<button>❤️ {likeCount}</button>
```

---

## 2. useRef：保存数据，但不触发渲染

```javascript
const videoRef = useRef(null);           // 保存 video 元素
const inputRef = useRef(null);           // 保存 input 元素
const renderCountRef = useRef(0);        // 保存渲染次数
```

**为什么用 useRef？**

### 场景 1：操作 DOM

```javascript
const videoRef = useRef(null);

const togglePlay = () => {
  if (isPlaying) {
    videoRef.current.pause();  // 调用 video 的 pause 方法
  } else {
    videoRef.current.play();   // 调用 video 的 play 方法
  }
};

<video ref={videoRef} src="/video.mp4" />
```

**为什么不用 useState？**
- 不需要显示在页面上
- 只是为了调用 DOM 方法

---

### 场景 2：聚焦输入框

```javascript
const inputRef = useRef(null);

const addComment = () => {
  // 添加评论后，聚焦输入框
  inputRef.current.focus();
};

<input ref={inputRef} />
```

**为什么不用 useState？**
- 不需要显示在页面上
- 只是为了调用 `focus()` 方法

---

### 场景 3：记录渲染次数

```javascript
const renderCountRef = useRef(0);

useEffect(() => {
  renderCountRef.current++;
  console.log('组件渲染了', renderCountRef.current, '次');
});
```

**为什么不用 useState？**
- 如果用 `useState`，每次更新会触发渲染，导致无限循环
- `useRef` 不触发渲染，只是记录数据

---

## 3. useEffect：数据变化后做事情

```javascript
// 1. 组件挂载时，获取评论
useEffect(() => {
  fetch('/api/comments')
    .then(res => res.json())
    .then(data => setComments(data));
}, []);

// 2. 评论变化时，保存到 localStorage
useEffect(() => {
  localStorage.setItem('comments', JSON.stringify(comments));
}, [comments]);

// 3. 点赞数变化时，修改页面标题
useEffect(() => {
  document.title = `${likeCount} 个赞`;
}, [likeCount]);
```

**为什么用 useEffect？**
- 发送请求、保存数据、修改 DOM 都是副作用
- 需要在渲染后执行

**为什么不直接写在组件里？**

```javascript
// ❌ 错误：每次渲染都发送请求
function VideoPlayer() {
  fetch('/api/comments')  // 每次渲染都执行
    .then(res => res.json())
    .then(data => setComments(data));  // 触发渲染 → 无限循环
}

// ✅ 正确：只在挂载时发送一次
useEffect(() => {
  fetch('/api/comments')
    .then(res => res.json())
    .then(data => setComments(data));
}, []);  // 空依赖，只执行一次
```

---

## 4. useMemo：缓存计算结果

```javascript
const filteredComments = useMemo(() => {
  console.log('正在过滤评论...');
  return comments.filter(comment => 
    comment.text.includes(searchKeyword)
  );
}, [comments, searchKeyword]);
```

**为什么用 useMemo？**

### 没有 useMemo 的问题

```javascript
function VideoPlayer() {
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([...]);
  const [searchKeyword, setSearchKeyword] = useState('');

  // ❌ 每次渲染都重新过滤
  const filteredComments = comments.filter(comment => 
    comment.text.includes(searchKeyword)
  );

  return (
    <div>
      <button onClick={() => setLikeCount(likeCount + 1)}>
        ❤️ {likeCount}
      </button>
      {/* 评论列表 */}
    </div>
  );
}
```

**问题：**
```
点击点赞按钮：
1. setLikeCount(1)
2. 组件重新渲染
3. 重新过滤评论（即使 comments 和 searchKeyword 没变）
4. 浪费性能
```

---

### 用 useMemo 优化

```javascript
const filteredComments = useMemo(() => {
  console.log('正在过滤评论...');
  return comments.filter(comment => 
    comment.text.includes(searchKeyword)
  );
}, [comments, searchKeyword]);  // 只有这两个变化时才重新计算
```

**效果：**
```
点击点赞按钮：
1. setLikeCount(1)
2. 组件重新渲染
3. useMemo 检查依赖（comments 和 searchKeyword 没变）
4. 直接返回缓存的结果
5. 不重新过滤，节省性能
```

**什么时候用 useMemo？**
- 计算量大（过滤、排序、复杂计算）
- 依赖不经常变化

---

## 5. useCallback：缓存函数

```javascript
const addComment = useCallback(() => {
  if (newComment.trim() === '') return;

  const comment = {
    id: Date.now(),
    text: newComment,
    likes: 0
  };

  setComments([...comments, comment]);
  setNewComment('');
  inputRef.current.focus();
}, [comments, newComment]);
```

**为什么用 useCallback？**

### 没有 useCallback 的问题

```javascript
function VideoPlayer() {
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([...]);

  // ❌ 每次渲染都创建新函数
  const likeComment = (id) => {
    setComments(comments.map(comment => 
      comment.id === id 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  return (
    <div>
      <button onClick={() => setLikeCount(likeCount + 1)}>
        ❤️ {likeCount}
      </button>
    
      {comments.map(comment => (
        <CommentItem 
          key={comment.id} 
          comment={comment} 
          onLike={likeComment}  // 每次渲染传入新函数
        />
      ))}
    </div>
  );
}

function CommentItem({ comment, onLike }) {
  console.log('CommentItem 渲染:', comment.text);
  return <button onClick={() => onLike(comment.id)}>👍</button>;
}
```

**问题：**
```
点击点赞按钮：
1. setLikeCount(1)
2. VideoPlayer 重新渲染
3. 创建新的 likeComment 函数
4. 所有 CommentItem 重新渲染（因为 onLike 是新函数）
5. 即使评论内容没变，也重新渲染
6. 浪费性能
```

---

### 用 useCallback 优化

```javascript
const likeComment = useCallback((id) => {
  setComments(comments.map(comment => 
    comment.id === id 
      ? { ...comment, likes: comment.likes + 1 }
      : comment
  ));
}, [comments]);  // 只有 comments 变化时才创建新函数
```

**效果：**
```
点击点赞按钮：
1. setLikeCount(1)
2. VideoPlayer 重新渲染
3. useCallback 检查依赖（comments 没变）
4. 返回缓存的函数
5. CommentItem 不重新渲染（onLike 是同一个函数）
6. 节省性能
```

**什么时候用 useCallback？**
- 函数作为 props 传给子组件
- 子组件用了 `React.memo`（避免不必要的渲染）

---

# 完整执行流程

## 初始渲染

```
1. useState 初始化数据
   - isPlaying = false
   - comments = []
   - newComment = ''
   - searchKeyword = ''
   - likeCount = 0

2. useRef 初始化
   - videoRef.current = null
   - inputRef.current = null
   - renderCountRef.current = 0

3. 渲染 JSX

4. React 创建 DOM
   - videoRef.current 指向 <video> 元素
   - inputRef.current 指向 <input> 元素

5. useEffect 执行
   - 发送请求获取评论
   - 记录渲染次数

6. 收到评论数据
   - setComments([...])
   - 触发重新渲染

7. useMemo 计算
   - 过滤评论（第一次计算）

8. 页面显示评论列表
```

---

## 用户点击"播放"按钮

```
1. togglePlay 执行
   - videoRef.current.play()
   - setIsPlaying(true)

2. 组件重新渲染
   - isPlaying = true

3. useMemo 检查依赖
   - comments 没变
   - searchKeyword 没变
   - 返回缓存的 filteredComments

4. useCallback 检查依赖
   - 返回缓存的函数

5. 页面更新
   - 按钮文字变成"暂停"
   - 评论列表不重新渲染（因为 filteredComments 没变）
```

---

## 用户输入搜索关键词 "好"

```
1. setSearchKeyword('好')

2. 组件重新渲染
   - searchKeyword = '好'

3. useMemo 检查依赖
   - searchKeyword 变了
   - 重新过滤评论
   - console.log('正在过滤评论...')

4. 页面更新
   - 只显示包含"好"的评论
```

---

## 用户点击点赞按钮

```
1. setLikeCount(1)

2. 组件重新渲染
   - likeCount = 1

3. useMemo 检查依赖
   - comments 没变
   - searchKeyword 没变
   - 返回缓存的 filteredComments

4. useCallback 检查依赖
   - comments 没变
   - 返回缓存的函数

5. useEffect 执行
   - document.title = '1 个赞'

6. 页面更新
   - 点赞数变成 1
   - 评论列表不重新渲染
```

---

## 用户添加评论

```
1. addComment 执行
   - 创建新评论对象
   - setComments([...comments, newComment])
   - setNewComment('')
   - inputRef.current.focus()

2. 组件重新渲染
   - comments = [..., 新评论]
   - newComment = ''

3. useMemo 检查依赖
   - comments 变了
   - 重新过滤评论

4. useCallback 检查依赖
   - comments 变了
   - 创建新的 likeComment 函数

5. useEffect 执行
   - localStorage.setItem('comments', ...)

6. 页面更新
   - 评论列表显示新评论
   - 输入框清空并聚焦
```

---

# 总结对比

| Hook | 作用 | 触发渲染 | 使用场景 |
|------|------|----------|----------|
| **useState** | 保存数据 | ✅ 会 | 页面上显示的数据 |
| **useRef** | 保存数据 | ❌ 不会 | DOM 引用、定时器 ID、渲染次数 |
| **useEffect** | 做事情 | ❌ 不会 | 发送请求、修改 DOM、订阅事件 |
| **useMemo** | 缓存计算结果 | ❌ 不会 | 过滤、排序、复杂计算 |
| **useCallback** | 缓存函数 | ❌ 不会 | 传给子组件的函数 |

---

# 记忆口诀

- **useState**：我要显示什么？（数据仓库）
- **useRef**：我要记住什么？（笔记本）
- **useEffect**：数据变了，我要做什么？（闹钟）
- **useMemo**：这个计算太慢了，能缓存吗？（缓存）
- **useCallback**：这个函数别老变，能固定吗？（函数缓存）

---

# 什么时候用什么？

## 数据要显示在页面上？
→ **useState**

## 数据不显示，只是记录？
→ **useRef**

## 数据变化后要做事情？
→ **useEffect**

## 计算量大，想缓存结果？
→ **useMemo**

## 函数传给子组件，想避免重新渲染？
→ **useCallback**

---

懂了吗？这就是一个完整的真实项目，所有 Hook 都用上了！