---
tags:
  - 生成器函数
  - Generator
---

# Generator 函数

常规函数只会返回一个单一值（或者不返回），而 ES6 的 generator 可以按需一个接一个的返回（yield）多个值。

JavaScript 中的函数是不可暂停的，generator 函数则可以暂停。

## 基本语法

```js
function* generator() {
  console.log("invoked 1st time");
  yield 1;
  console.log("invoked 2nd time");
  yield 2;
}

let gen = generator(); // 调用 Generator 返回一个迭代器对象
console.log(gen);  // Object [Generator] {}
```

## 使用方式

### 1. for...of 方式

```js
function* generator() {
  console.log("invoked 1st time");
  yield 1;
  console.log("invoked 2nd time");
  yield 2;
}

let gen = generator();

for (const g of gen) {
  console.log("for...of g", g)
}
```

输出结果：
```
Object [Generator] {}
invoked 1st time
for...of g 1
invoked 2nd time
for...of g 2
```

### 2. next() 方式

```js
function* generator() {
    console.log("invoked 1st time");
    yield 1;
    console.log("invoked 2nd time");
    yield 2;
}

let gen = generator();

let result1 = gen.next();
console.log("第1次:", result1);

let result2 = gen.next();
console.log("第2次:", result2);

let result3 = gen.next();
console.log("第3次:", result3);
```

输出结果：
```
Object [Generator] {}
invoked 1st time
第1次: { value: 1, done: false }
invoked 2nd time
第2次: { value: 2, done: false }
第3次: { value: undefined, done: true }
```

## 核心特性

### 返回值结构

- `gen()` 返回生成器对象
- `gen.next()` 返回迭代结果对象，包含 value 和 done 属性
- `yield` 暂停执行并输出值
- `return` 结束执行并输出最终值

### 状态保持

Generator 函数可以保持状态，每次调用 next() 时从上次暂停的位置继续执行。

```js
function* counter() {
  let count = 0;
  while (true) {
    yield count++;
  }
}

const gen = counter();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```

## 对比普通函数

| 特性 | 普通函数 | Generator 函数 |
|------|---------|---------------|
| 定义语法 | `function fn()` | `function* fn()` |
| 调用后返回 | 执行结果 | 生成器对象 |
| 执行时机 | 调用时立即执行 | 调用 next() 时才执行 |
| 暂停能力 | 不能暂停 | 可以用 yield 暂停 |
| 返回关键字 | return（一次） | yield（多次）+ return |
| 状态保持 | 无状态 | 有状态，记住执行位置 |

## for...of vs next()

### for...of 特点
- 直接得到具体值
- 不包含 return 的值
- 适合简单遍历

### next() 特点
- 返回包含 value 和 done 的对象
- 包含 return 的值
- 适合需要控制迭代的场景

## yield* 语法

```js
const arr = ['a', 'b', 'c']

function* generator() {
  yield 1;
  yield* arr;  // 委托给另一个可迭代对象
  yield 2;
}

for (const item of generator()) {
  console.log(item)
}
```

输出结果：
```
1
a
b
c
2
```

## 应用场景

1. **惰性求值** - 按需生成数据，节省内存
2. **无限序列** - 可以生成无限序列而不会内存溢出
3. **状态机** - 利用暂停/恢复特性实现状态机
4. **异步流程控制** - 配合 Promise 实现 async/await 的底层机制

## 总结

Generator 函数是 ES6 引入的强大特性，通过 yield 关键字实现函数的暂停和恢复，为 JavaScript 提供了更灵活的流程控制能力。
