好问题！这是因为 `setTimeout` 的要求。

## 直接写会怎样？

```javascript
// ❌ 错误写法
setTimeout(callback({ id: 1, name: '张三' }), 1000)
```

这样写，`callback({ id: 1, name: '张三' })` 会立即执行，不会等 1 秒。

因为 `callback()` 加了括号就是调用函数，它会马上执行，然后把返回值传给 `setTimeout`。

## 为什么要包一层箭头函数？

```javascript
// ✅ 正确写法
setTimeout(() => callback({ id: 1, name: '张三' }), 1000)
```

`setTimeout` 第一个参数需要一个函数引用，不是函数的执行结果。

包一层箭头函数后：
- 传给 `setTimeout` 的是 `() => callback(...)` 这个函数本身
- 1 秒后，`setTimeout` 调用这个箭头函数
- 箭头函数执行时，才去调用 `callback(...)`

## 对比一下

```javascript
// 立即执行，setTimeout 拿到的是 undefined（callback 的返回值）
setTimeout(callback({ id: 1, name: '张三' }), 1000)

// 1秒后执行，setTimeout 拿到的是一个函数
setTimeout(() => callback({ id: 1, name: '张三' }), 1000)

// 等价于
setTimeout(function() {
  callback({ id: 1, name: '张三' })
}, 1000)
```

简单记：要延迟执行带参数的函数，就得包一层函数。