---
tags:
  - 资深全栈面试
---

你这个总结**精准到核心了！** 完全抓对了 useMemo 的本质——

组件渲染是“刚需”（比如点个点赞按钮，`likeCount` 变了，组件必须重新渲染），但渲染过程中，**很多计算逻辑其实没必要跟着“白跑一遍”**，useMemo 就是用来拦住这些“无意义的重复计算”的。

### 再用你的代码举个极致的例子，帮你固化这个认知：
你的组件里有个 `filteredComments`（过滤评论），假设评论列表有 **1000 条**，过滤逻辑要遍历这 1000 条：
```javascript
// 没有 useMemo 的情况：
const filteredComments = comments.filter(comment => 
  comment.text.includes(searchKeyword)
);
```
- 当你点「播放/暂停」按钮 → `isPlaying` 变了 → 组件必须渲染；
- 但此时 `comments` 和 `searchKeyword` 都没变化，过滤评论的逻辑却要**重新遍历 1000 条数据**（纯纯的无用功）；
- 每点一次播放/暂停，就白遍历一次 1000 条数据，次数多了会明显卡。

```javascript
// 有 useMemo 的情况：
const filteredComments = useMemo(() => {
  return comments.filter(comment => 
    comment.text.includes(searchKeyword)
  );
}, [comments, searchKeyword]);
```
- 点「播放/暂停」→ 组件渲染，但 `comments`/`searchKeyword` 没变化 → useMemo 直接把上次过滤好的结果“吐出来”，**完全不执行 filter 遍历**；
- 只有当 `comments`（评论新增/删除）或 `searchKeyword`（搜索框输入）变了，才重新遍历计算。

### 补充两个关键细节（避免用错）：
1. **小计算没必要用 useMemo**：
   如果评论只有 10 条，哪怕每次渲染都过滤一遍，开销也微乎其微，用 useMemo 反而会多一层“缓存管理”的微小开销（得不偿失）。
   useMemo 只适合「计算开销大」的场景（比如大数据遍历、复杂的数学运算、多层嵌套的逻辑处理）。

2. **useMemo 是“缓存计算结果”，不是“阻止渲染”**：
   它管不了“组件要不要渲染”，只能管“渲染时，某段计算逻辑要不要重新执行”——这是和 useState/useEffect 最核心的区别（后两者是控制“渲染与否”或“渲染后做什么”）。

### 最终总结（一句话记死）：
useMemo = 组件必须渲染时，**只让“真正变了的依赖”触发计算**，其余时候直接用缓存结果，避免无意义的重复运算。

你能抓到这个核心，说明已经彻底理解 useMemo 了——不用再纠结它的“底层原理”，记住这个核心，就能用对 99% 的场景～