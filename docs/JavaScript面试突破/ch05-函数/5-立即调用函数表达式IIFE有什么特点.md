

## IIFE语法结构
IIFE（立即调用函数表达式）是一个在定义时就会立即执行的 JavaScript函数
```
（function () {
   // statements
}）();

```

主要包含两部分：

- 包围在圆括号运算符（）中的一个匿名函数， 这个匿名函数拥有独立的词法作用域。这不仅避免了外界访问此IIFE变量，而且又不会污染全局作用域。
- 再一次使用（）创建了一个立即执行函数表达式，JavaScript引擎到此将直接执行函数


## 函数表达式里面的变量无法从外部访问


当函数变成立即执行函数表达式时，表达式中的变量不能从外部访问。

```js
（function () {
   var test = "lucy"
}）();

// 无法从外部访问变量test
console.log(test); // 抛出错误： “Uncaught ReferenceError: test is not defined”
```