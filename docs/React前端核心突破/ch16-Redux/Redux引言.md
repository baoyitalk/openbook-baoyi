# Redux 面试知识点深度拆解

## 一、第一性原理：Redux 到底在解决什么问题？

### 核心问题
```
前端应用的本质 = UI = f(State)

问题：当应用变大时，State 如何管理？
- 状态分散在各个组件
- 状态变化难以追踪
- 组件间通信复杂
```

### Redux 的答案
```
┌─────────────────────────────────────────────────────────┐
│                    Redux 核心思想                        │
├─────────────────────────────────────────────────────────┤
│  1. 单一数据源 (Single Source of Truth)                  │
│  2. 状态只读 (State is Read-only)                        │
│  3. 纯函数修改 (Changes with Pure Functions)             │
└─────────────────────────────────────────────────────────┘
```

---

## 二、Redux 是什么？

Redux 是 JavaScript 应用的**可预测状态容器**。

### 四大特性

| 特性 | 说明 | 价值 |
|------|------|------|
| **可预测** | 相同输入产生相同输出 | 在客户端、服务器、移动端行为一致，易于测试 |
| **集中** | 状态和逻辑集中管理 | 支持撤销、重做、持久化 |
| **可调试** | DevTools 支持时间旅行 | 追踪状态何时、何处、为什么改变 |
| **灵活** | 适用于任何 UI 层 | 庞大的插件生态系统 |

---

## 三、Flux vs Redux 架构对比

### Flux 架构（4个部分）

```
┌──────────┐    ┌────────────┐    ┌─────────┐    ┌──────┐
│  Action  │───▶│ Dispatcher │───▶│  Store  │───▶│ View │
└──────────┘    └────────────┘    └─────────┘    └──────┘
     ▲                              (可多个)         │
     └────────────────────────────────────────────────┘
                        用户交互
```

### Redux 架构（简化版）

```
┌──────────┐         ┌─────────┐         ┌──────┐
│  Action  │────────▶│  Store  │────────▶│ View │
└──────────┘         │(唯一的) │         └──────┘
     ▲               │         │              │
     │               │ Reducer │              │
     │               └─────────┘              │
     └────────────────────────────────────────┘
                   dispatch(action)
```

### 核心差异对比

| 维度 | Flux | Redux |
|------|------|-------|
| Store 数量 | 可以有多个 | **唯一一个** |
| Dispatcher | 独立存在 | **移除**，由 Store 直接处理 |
| 状态修改 | 在 Store 中直接修改 | **Reducer 纯函数返回新对象** |
| Action | 包含 type 和类似属性 | 只需 type 和 payload |
| 官方推荐 | Facebook 原创 | Facebook 推荐替代 Flux |

---

## 四、Redux 三大核心原则（高频考点 ★★★★☆）

### 1. 单一数据源

```javascript
// 整个应用状态存储在单一对象树中
const store = {
  user: { name: 'John', isLoggedIn: true },
  products: [...],
  cart: [...],
  // 所有状态集中在这里
}
```

**优势**：调试、检查、持久化都更容易

### 2. 状态只读

```javascript
// ❌ 错误：直接修改状态
state.user.name = 'Jane'

// ✅ 正确：通过 dispatch Action
store.dispatch({
  type: 'UPDATE_USER_NAME',
  payload: 'Jane'
})
```

**更改状态的唯一方式**：发出 Action（描述发生了什么的对象）

### 3. Reducer 是纯函数

```javascript
// Reducer 签名
const reducer = (state, action) => newState

// 纯函数特性：
// ✅ 相同输入 → 相同输出
// ✅ 无副作用
// ❌ 不能请求 API
// ❌ 不能操作 DOM
// ❌ 不能使用 Date.now() 或 Math.random()
```

**经典面试代码：简单 Reducer**

```javascript
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}
```

---

## 五、React Context vs Redux（面试高频）

### 对比图

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Context                                 │
├─────────────────────────────────────────────────────────────────┤
│  目的：解决跨组件层级传递 props 的效率问题                         │
│  更新：Context value 变化 → 所有消费组件重新渲染（需手动优化）      │
│  调试：ReactDevTools                                             │
│  中间件：❌ 不支持                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       Redux                                      │
├─────────────────────────────────────────────────────────────────┤
│  目的：完整的状态管理解决方案                                      │
│  更新：只有消费的状态变化时，组件才会更新                          │
│  调试：Redux DevTools（时间旅行、状态快照）                        │
│  中间件：✅ 支持（处理异步、日志等）                               │
└─────────────────────────────────────────────────────────────────┘
```

### Context 性能优化方法

```javascript
// 1. 避免使用对象字面量作为 value
// ❌ 每次渲染创建新对象
<Provider value={{ user, setUser }}>

// ✅ 使用 useMemo
const value = useMemo(() => ({ user, setUser }), [user])
<Provider value={value}>

// 2. 拆分 Context
// 3. 记忆化消费组件
// 4. 使用 createContext 的第二参数手动优化
```

---

## 六、访问 Redux Store 的方法

### 方法一：connect 高阶组件（类组件推荐）

```javascript
import { connect } from 'react-redux'

const MyComponent = ({ value }) => <>{value}</>

const mapStateToProps = ({ value }) => ({ value })

export default connect(mapStateToProps)(MyComponent)
```

### 方法二：导出 Store 直接访问（非服务端渲染）

```javascript
// store.js
import { createStore } from 'redux'
import reducer from './reducer'
const store = createStore(reducer)
export default store

// 使用
import store from './store'
const state = store.getState()
```

### 方法三：redux-thunk 的 getState 参数

```javascript
const fetchUser = () => (dispatch, getState) => {
  dispatch({ type: 'FETCH_START' })
  const { token } = getState()
  
  fetch('/user/info', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
}
```

### 方法四：自定义中间件获取

```javascript
const myMiddleware = store => next => action => {
  if (typeof action === 'function') {
    return action(store)
  }
  // 可以在这里访问 store.getState()
  return next(action)
}
```

---

## 七、Redux 异步 Action 处理方案

### 异步操作的三种 Action 状态

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│  START  │────▶│ SUCCESS │  或 │ FAILURE │
└─────────┘     └─────────┘     └─────────┘
   请求开始        请求成功         请求失败
```

### 方案对比

| 方案 | 原理 | 适用场景 |
|------|------|----------|
| **redux-thunk** | dispatch 函数而非对象 | 简单异步逻辑 |
| **redux-promise** | dispatch Promise | Promise 风格代码 |
| **redux-saga** | Generator 生成器 | 复杂异步流程控制 |

### 方案一：mapDispatchToProps 手动处理

```javascript
const mapDispatchToProps = dispatch => ({
  asyncAction() {
    dispatch({ type: 'START' })
    fetch('/api')
      .then(res => res.json())
      .then(data => dispatch({ type: 'SUCCESS', payload: data }))
      .catch(error => dispatch({ type: 'FAILURE', payload: error }))
  }
})
```

### 方案二：redux-thunk（最常用）

```javascript
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const store = createStore(reducer, applyMiddleware(thunk))

// Action Creator 返回函数
const asyncAction = dispatch => {
  dispatch({ type: 'START' })
  fetch('/api')
    .then(res => res.json())
    .then(data => dispatch({ type: 'SUCCESS', payload: { data } }))
    .catch(error => dispatch({ type: 'FAILURE', payload: { error } }))
}

store.dispatch(asyncAction)
```

### 方案三：redux-promise

```javascript
import promiseMiddleware from 'redux-promise'

const store = createStore(reducer, applyMiddleware(promiseMiddleware))

const asyncAction = dispatch => fetch('/api')
  .then(res => res.json())
  .then(data => dispatch({ type: 'SUCCESS', payload: { data } }))
  .catch(error => dispatch({ type: 'FAILURE', payload: { error } }))
```

### 方案四：redux-saga（复杂场景）

```javascript
// sagas.js
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

function* asyncAction() {
  try {
    const data = yield call(fetch, '/api')
    yield put({ type: 'SUCCESS', payload: { data } })
  } catch (error) {
    yield put({ type: 'FAILURE', payload: { error } })
  }
}

// takeEvery: 支持并发
function* mySaga() {
  yield takeEvery('START', asyncAction)
}

// takeLatest: 只取最新，前一个会被取消
function* mySaga() {
  yield takeLatest('START', asyncAction)
}

export default mySaga
```

```javascript
// main.js
import createSagaMiddleware from 'redux-saga'
import mySaga from './sagas'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(mySaga)
```

---

## 八、手写 redux-thunk（高频面试题 ★）

### 原理

redux-thunk 允许 dispatch 一个**函数**而不是返回 action 的动作创建器。

### 源码实现

```javascript
function createThunkMiddleware(extraArgument) {
  // 中间件的标准签名：store => next => action
  return ({ dispatch, getState }) => next => action => {
    // 核心逻辑：如果 action 是函数，执行它
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument)
    }
    // 否则传递给下一个中间件
    return next(action)
  }
}

const thunk = createThunkMiddleware()
thunk.withExtraArgument = createThunkMiddleware

export default thunk
```

### 使用示例

```javascript
// thunk 允许延迟 dispatch 或条件 dispatch
const conditionalDispatch = (dispatch, getState) => {
  const { shouldFetch } = getState()
  if (shouldFetch) {
    dispatch({ type: 'FETCH_DATA' })
  }
}

store.dispatch(conditionalDispatch)
```

---

## 九、何时需要 Redux？

### 决策因素

```
┌─────────────────────────────────────────────────────────┐
│              是否需要 Redux？考虑以下因素：               │
├─────────────────────────────────────────────────────────┤
│  ✅ 应用程序许多地方都需要状态                            │
│  ✅ 应用程序状态经常更新                                  │
│  ✅ 更新状态的逻辑比较复杂                                │
│  ✅ 项目较大，需要多人协作                                │
│  ✅ 想查看状态何时、何处、为什么改变                       │
├─────────────────────────────────────────────────────────┤
│  ❌ 简单应用，状态简单                                    │
│  ❌ 不需要状态追踪                                        │
│  ❌ 学习成本和项目复杂度不值得                            │
└─────────────────────────────────────────────────────────┘
```

### Redux 的权衡

```
收益：
  + 可预测的状态管理
  + 强大的调试能力
  + 状态追踪和时间旅行

成本：
  - 增加概念、代码和限制
  - 增加学习成本
  - 增加项目复杂度
```

---

## 十、Redux 项目目录结构

### 小型项目

```
src/
├── components/          # 展示组件
├── pages/containers/    # 容器组件
├── actions/             # 所有 actions
└── reducers/            # 所有 reducers
```

### 中型项目（按功能模块）

```
src/
├── pages/containers/
│   └── HomePage/
│       ├── HomePage.jsx
│       ├── HomePageAction.js
│       └── HomePageReducer.jsx
```

### 大型项目（react-boilerplate 风格）

```
src/
├── component/           # 公共组件
├── pages/containers/
│   └── HomePage/
│       ├── component/   # 私有组件
│       ├── index.jsx
│       ├── reducer.js
│       ├── action.js    # 同步 actions
│       └── sagas.js     # 异步 actions
```

### 企业级项目（react-starter-kit 风格）

```
src/
├── common/              # 公共 React 组件
├── core/                # 核心模块和实用功能
│   └── store/
│       ├── createStore.js
│       ├── reducers.js
│       └── state.js
├── routes/              # 路由和页面组件
│   └── HomePage/
│       ├── component/
│       ├── modules/
│       │   ├── reducer.js
│       │   └── action.js
│       └── index.jsx    # 注入 reducer 到 store
```

### 动态注入 Reducer 模式

```javascript
// core/store/createStore.js
import { createStore, combineReducers } from 'redux'
import reducers as initReducers from './reducers'
import initStates from './states'

const store = createStore(initReducers, initStates)
store.reducers = Object.create(null)

store.injectReducer = (key, reducer) => {
  store.reducers[key] = reducer
  store.replaceReducer(combineReducers({
    ...initReducers,
    ...store.reducers
  }))
}

export default store
```

```javascript
// routes/HomePage/index.jsx
import store from '../../core/store/createStore'
import reducer from 'modules/reducer'

store.injectReducer('homepage', reducer)
```

---

## 十一、Redux 数据流图解

```
                    ┌─────────────────────────────────────┐
                    │              Redux Store             │
                    │  ┌─────────────────────────────────┐ │
                    │  │           State Tree            │ │
                    │  │  { user, products, cart, ... }  │ │
                    │  └─────────────────────────────────┘ │
                    │                  │                   │
                    │                  ▼                   │
                    │         store.getState()            │
                    └──────────────────┬──────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         │                             │                             │
         ▼                             ▼                             ▼
    ┌─────────┐                  ┌─────────┐                   ┌─────────┐
    │ View A  │                  │ View B  │                   │ View C  │
    └────┬────┘                  └────┬────┘                   └────┬────┘
         │                             │                             │
         │         User Interaction    │                             │
         └─────────────────────────────┼─────────────────────────────┘
                                       │
                                       ▼
                              store.dispatch(action)
                                       │
                                       ▼
                    ┌─────────────────────────────────────┐
                    │           Middleware Chain           │
                    │    (thunk → logger → saga → ...)    │
                    └──────────────────┬──────────────────┘
                                       │
                                       ▼
                    ┌─────────────────────────────────────┐
                    │              Reducers                │
                    │   (state, action) => newState       │
                    └──────────────────┬──────────────────┘
                                       │
                                       ▼
                              New State → Re-render
```

---

## 十二、经典面试代码汇总

### 1. 完整的 Redux 基础示例

```javascript
// 1. 定义 Reducer
const reducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 }
    case 'DECREMENT':
      return { ...state, count: state.count - 1 }
    default:
      return state
  }
}

// 2. 创建 Store
import { createStore } from 'redux'
const store = createStore(reducer)

// 3. 订阅变化
store.subscribe(() => {
  console.log('State changed:', store.getState())
})

// 4. 派发 Action
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'DECREMENT' })
```

### 2. React-Redux 连接

```javascript
// 使用 Hooks（推荐）
import { useSelector, useDispatch } from 'react-redux'

const Counter = () => {
  const count = useSelector(state => state.count)
  const dispatch = useDispatch()
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </div>
  )
}
```

### 3. combineReducers 使用

```javascript
import { combineReducers, createStore } from 'redux'

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload
    default:
      return state
  }
}

const cartReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return [...state, action.payload]
    default:
      return state
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer
})

const store = createStore(rootReducer)
```

---

## 一句话总结

> **Redux 的本质是通过"单一数据源 + 状态只读 + 纯函数修改"三大原则，将应用状态的变化从"不可预测的自由修改"变成"可追踪的确定性转换"，从而让复杂应用的状态管理变得可控、可调试、可预测。**

---

## 面试高频指数速查

| 题目 | 高频指数 |
|------|----------|
| 什么是 Redux？ | ★☆☆☆☆ |
| Flux 和 Redux 的区别？ | ★★☆☆☆ |
| Redux 的核心原则是？ | ★★★★☆ |
| React Context 和 Redux 的区别？ | ★★☆☆☆ |
| React 访问 Redux Store 的方法？ | ★☆☆☆☆ |
| Redux 中异步请求发送多 Action 方法？ | ★★☆☆☆ |
| 如何判断项目需要引入 Redux？ | ★★★☆☆ |
| 如何设置引入 Redux 后的项目目录？ | ★☆☆☆☆ |
| 手写一个 redux-thunk？ | ★☆☆☆☆ |