# 重启服务

```js

lsof -ti :3001 | xargs kill -9; pnpm dev

// 杀掉所有node进程
killall -9 node


```



基于当前项目 小步迭代 新增代码不要影响现有业务逻辑