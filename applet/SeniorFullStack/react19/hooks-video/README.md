# React 性能优化三种方案对比

这个项目展示了 React 性能优化的三种常见方案，用于面试复习和学习。

## 🎯 学习目标

理解 `useMemo`、`useCallback`、`React.memo` 的真正作用，以及如何通过组件拆分实现性能优化。

## 📁 文件结构

```
src/
├── App.jsx           # 主入口，三种方案切换器
├── App-Original.jsx  # 方案0：原始版本（所有状态在根组件）
├── App-Memo.jsx      # 方案1：React.memo 优化版
└── App-Split.jsx     # 方案2：组件拆分版（推荐）⭐
```

## 🚀 运行项目

```bash
npm install
npm run dev
```

## 📊 三种方案对比

### 方案0：原始版本

**特点**：
- ❌ 所有状态在根组件
- ❌ 任何状态变化都会导致整个组件树重新渲染
- ✅ 代码简单，适合学习基础概念

**问题**：
```javascript
const [likeCount, setLikeCount] = useState(0);
const [comments, setComments] = useState([]);

// likeCount 变化 → 整个组件重新渲染 → 评论区也跟着渲染（不必要）
```

**测试方法**：
1. 打开浏览器控制台
2. 点击点赞按钮
3. 观察：所有组件都会重新渲染

---

### 方案1：React.memo 优化

**特点**：
- ✅ 使用 `React.memo` 包裹子组件
- ✅ 配合 `useCallback` 保持函数引用稳定
- ⚠️ 需要注意 props 引用稳定性

**关键代码**：
```javascript
// 用 memo 包裹组件
const CommentSection = memo(({ comments, onLike }) => {
  // ...
});

// 用 useCallback 保持函数引用稳定
const likeComment = useCallback((id) => {
  setComments(prevComments => 
    prevComments.map(comment => 
      comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
    )
  );
}, []); // 使用函数式更新，不依赖 comments
```

**测试方法**：
1. 打开浏览器控制台
2. 点击点赞按钮
3. 观察：只有根组件重新渲染，CommentSection 不会渲染

---

### 方案2：组件拆分（推荐）⭐

**特点**：
- ✅ 状态下沉到各自组件
- ✅ 天然隔离，无需 memo
- ✅ 代码结构清晰，最佳实践

**关键思想**：
```javascript
function App() {
  return (
    <>
      <VideoSection />    {/* 视频 + 点赞，独立状态 */}
      <CommentSection />  {/* 评论区，独立状态 */}
    </>
  );
}

function VideoSection() {
  const [likeCount, setLikeCount] = useState(0); // 只影响这个组件
  // ...
}

function CommentSection() {
  const [comments, setComments] = useState([]); // 只影响这个组件
  // ...
}
```

**测试方法**：
1. 打开浏览器控制台
2. 点击点赞按钮
3. 观察：只有 VideoSection 重新渲染，CommentSection 完全不受影响

---

## 🎓 核心知识点

### 1. useMemo 的作用

**误区**：useMemo 是为了避免组件渲染 ❌

**正确理解**：
- useMemo **不阻止组件渲染**
- useMemo 只是**缓存计算结果**，避免重复执行昂贵的计算
- 组件仍然会渲染，但某些计算不会重复执行

```javascript
// 没有 useMemo：每次渲染都过滤
const filteredComments = comments.filter(c => c.text.includes(keyword));

// 有 useMemo：只在 comments 或 keyword 变化时才过滤
const filteredComments = useMemo(
  () => comments.filter(c => c.text.includes(keyword)),
  [comments, keyword]
);
```

### 2. React 渲染机制

**状态变化 → 组件重新渲染**：
1. `setState` 被调用
2. React 检测到状态变化
3. 整个组件函数重新执行
4. 重新生成虚拟 DOM
5. 对比差异后更新真实 DOM

### 3. 性能优化工具对比

| 工具 | 作用 | 使用场景 |
|------|------|----------|
| `useMemo` | 缓存**计算结果** | 避免昂贵的计算重复执行 |
| `useCallback` | 缓存**函数引用** | 配合 React.memo 使用 |
| `React.memo` | 缓存**组件本身** | 避免子组件不必要的渲染 |
| **组件拆分** | **状态隔离** | **最佳实践，推荐方案** |

### 4. 最佳实践

1. **状态应该放在最小需要它的组件中**
2. **优先使用组件拆分，而不是 memo**
3. **只在真正需要时才使用性能优化**
4. **过早优化是万恶之源**

---

## 🔍 面试要点

### Q1: useMemo 的目的是什么？

**答**：useMemo 不是为了避免组件渲染，而是为了：
1. 缓存计算结果，避免重复执行昂贵的计算
2. 保持引用稳定性，避免子组件不必要的重新渲染

### Q2: 如何避免不必要的组件渲染？

**答**：三种方案：
1. **组件拆分**（推荐）：状态下沉，天然隔离
2. **React.memo**：包裹子组件，配合 useCallback
3. **状态提升**：将共享状态提升到最近的公共父组件

### Q3: 什么时候使用 useMemo？

**答**：
1. 计算成本高（如大数组过滤、排序）
2. 需要保持引用稳定性（如传给 memo 组件的对象）
3. 不要过早优化，先测量性能瓶颈

---

## 📝 练习建议

1. 运行项目，切换三种方案，观察控制台输出
2. 修改代码，尝试不同的优化方式
3. 思考：什么时候需要优化？什么时候不需要？
4. 面试时能清晰解释三种方案的区别和适用场景

---

## 🎯 总结

- **useMemo**：缓存计算结果，不阻止渲染
- **React.memo**：缓存组件，避免子组件渲染
- **组件拆分**：最佳实践，天然隔离 ⭐

记住：**状态变化 → 组件渲染**，这是 React 的核心机制，性能优化只是在这个基础上做文章。
