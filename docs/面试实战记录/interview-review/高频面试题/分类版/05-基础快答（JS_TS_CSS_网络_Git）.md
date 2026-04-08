# 05 基础快答（JS/TS/CSS/网络/Git）

## 1. 事件循环（重复知识点）
Q1：执行顺序？  
A1：同步代码 -> 微任务队列 -> 宏任务。

Q2：常见微任务？  
A2：Promise.then/catch/finally、queueMicrotask。

Q3：为什么老被追问？  
A3：很多异步 bug 都是顺序理解错。

## 2. TS：interface vs type
Q1：怎么选？  
A1：对象声明都可，先看团队规范。

Q2：关键差异？  
A2：interface 可声明合并；type 擅长联合交叉类型运算。

Q3：一句话实战建议？  
A3：公共对象协议多用 interface，复杂组合多用 type。

## 3. CSS：margin 塌陷
Q1：父子 margin-top 会相加吗？  
A1：不会，发生外边距合并，取较大值。

Q2：如何避免？  
A2：父元素加 padding/border 或触发 BFC。

Q3：面试官想听什么？  
A3：结论 + 原因 + 解决方案三件套。

## 4. CSS：垂直居中
Q1：你常用哪些方案？  
A1：flex、grid、绝对定位+transform。

Q2：怎么选方案？  
A2：优先 flex；复杂布局看父子结构再选。

## 5. 跨域（重复知识点）
Q1：为什么有跨域？  
A1：浏览器同源策略限制。

Q2：主流解决方案？  
A2：CORS；开发期用代理。

Q3：预检请求是什么？  
A3：复杂请求先发 OPTIONS，通过后才发正式请求。

## 6. Git：rebase vs merge
Q1：merge 是什么？  
A1：保留分叉历史，生成合并提交。

Q2：rebase 是什么？  
A2：重放提交到新基线，历史更线性。

Q3：怎么选？  
A3：本地整理用 rebase，公共分支协作用 merge。

## 7. Promise.all（重复知识点）
Q1：行为？  
A1：一个失败就整体失败。

Q2：什么时候不该用 all？  
A2：你需要“失败也要拿结果”时，用 allSettled。
