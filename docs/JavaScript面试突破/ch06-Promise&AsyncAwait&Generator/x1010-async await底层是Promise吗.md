
# async/await 底层原理

## 直接回答：是，也不完全是

**`async/await` 的底层是 Promise + Generator（生成器）的组合**

让我从第一性原理拆解： ^9hqsjk

---

## 1. async/await 编译后是什么？

### 你写的代码
```javascript
async function getData() {
    let user = await fetch('/api/user');
    let orders = await fetch('/api/orders');
    return { user, orders };
}
```

### Babel 编译后（简化版）
```javascript
function getData() {
    return _asyncToGenerator(function* () {
        let user = yield fetch('/api/user');
        let orders = yield fetch('/api/orders');
        return { user, orders };
    })();
}

function _asyncToGenerator(fn) {
    return function() {
        let gen = fn.apply(this, arguments);
      
        return new Promise((resolve, reject) => {
            function step(key, arg) {
                let result = gen[key](arg);
              
                if (result.done) {
                    resolve(result.value);
                } else {
                    Promise.resolve(result.value).then(
                        val => step('next', val),
                        err => step('throw', err)
                    );
                }
            }
          
            step('next');
        });
    };
}
```

**核心发现：**
1. `async` 函数被转换成 **Generator 函数**（`function*`）
2. `await` 被转换成 **`yield`**
3. 外层包装了一个 **Promise**
4. 用 **`.then()`** 递归执行 Generator

---

## 2. 三层结构拆解

```
async/await
    ↓
Generator (function* / yield)
    ↓
Promise (.then / .catch)
```

### 第一层：Promise 是基础
```javascript
// 最底层：Promise
let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("完成"), 1000);
});

promise.then(value => console.log(value));
```

### 第二层：Generator 提供暂停/恢复能力
```javascript
// Generator：可以暂停和恢复的函数
function* myGenerator() {
    console.log("开始");
    let a = yield 1;        // 暂停，返回 1
    console.log("继续", a);
    let b = yield 2;        // 暂停，返回 2
    console.log("结束", b);
    return 3;
}

let gen = myGenerator();
console.log(gen.next());      // { value: 1, done: false }
console.log(gen.next("A"));   // { value: 2, done: false }
console.log(gen.next("B"));   // { value: 3, done: true }

// 输出：
// 开始
// { value: 1, done: false }
// 继续 A
// { value: 2, done: false }
// 结束 B
// { value: 3, done: true }
```

### 第三层：async/await = Generator + Promise 自动执行器
```javascript
// 手动实现 async/await
function asyncFunc(generatorFunc) {
    return function() {
        let gen = generatorFunc();
      
        return new Promise((resolve, reject) => {
            function step(nextFunc) {
                let result;
              
                try {
                    result = nextFunc();
                } catch (e) {
                    reject(e);
                    return;
                }
              
                if (result.done) {
                    resolve(result.value);
                    return;
                }
              
                // 关键：把 yield 的值包装成 Promise
                Promise.resolve(result.value).then(
                    val => step(() => gen.next(val)),
                    err => step(() => gen.throw(err))
                );
            }
          
            step(() => gen.next());
        });
    };
}

// 使用
let myAsync = asyncFunc(function* () {
    let a = yield Promise.resolve(1);
    let b = yield Promise.resolve(2);
    return a + b;
});

myAsync().then(result => console.log(result)); // 3
```

---

## 3. 完整演示：从 Promise 到 async/await

### 阶段1：纯 Promise
```javascript
function getData() {
    return fetch('/api/user')
        .then(user => {
            return fetch(`/api/orders/${user.id}`);
        })
        .then(orders => {
            return { user, orders }; // ❌ user 访问不到
        });
}
```

### 阶段2：Generator + Promise（手动执行）
```javascript
function* getData() {
    let user = yield fetch('/api/user');
    let orders = yield fetch(`/api/orders/${user.id}`);
    return { user, orders };
}

// 手动执行
let gen = getData();

gen.next().value                    // Promise<user>
    .then(user => {
        return gen.next(user).value; // Promise<orders>
    })
    .then(orders => {
        let result = gen.next(orders);
        console.log(result.value);   // { user, orders }
    });
```

### 阶段3：Generator + 自动执行器
```javascript
function run(generatorFunc) {
    let gen = generatorFunc();
  
    function step(value) {
        let result = gen.next(value);
      
        if (result.done) {
            return Promise.resolve(result.value);
        }
      
        return Promise.resolve(result.value).then(step);
    }
  
    return step();
}

// 使用
run(function* () {
    let user = yield fetch('/api/user');
    let orders = yield fetch(`/api/orders/${user.id}`);
    return { user, orders };
}).then(data => console.log(data));
```

### 阶段4：async/await（语法糖）
```javascript
async function getData() {
    let user = await fetch('/api/user');
    let orders = await fetch(`/api/orders/${user.id}`);
    return { user, orders };
}

getData().then(data => console.log(data));
```

---

## 4. 核心机制：状态机

```javascript
// async/await 本质是状态机
async function example() {
    console.log("状态1");
    let a = await promise1;  // 暂停点1
    console.log("状态2");
    let b = await promise2;  // 暂停点2
    console.log("状态3");
    return a + b;
}

// 等价于
function example() {
    let state = 0;
    let a, b;
  
    return new Promise((resolve, reject) => {
        function step() {
            switch(state) {
                case 0:
                    console.log("状态1");
                    state = 1;
                    promise1.then(value => {
                        a = value;
                        step();
                    });
                    break;
                  
                case 1:
                    console.log("状态2");
                    state = 2;
                    promise2.then(value => {
                        b = value;
                        step();
                    });
                    break;
                  
                case 2:
                    console.log("状态3");
                    resolve(a + b);
                    break;
            }
        }
      
        step();
    });
}
```

---

## 5. 实际验证

### 验证1：async 函数返回 Promise
```javascript
async function test() {
    return 42;
}

console.log(test());              // Promise {<fulfilled>: 42}
console.log(test() instanceof Promise); // true

// 等价于
function test() {
    return Promise.resolve(42);
}
```

### 验证2：await 等待 Promise
```javascript
async function test() {
    let result = await 42;  // 非 Promise 也会被包装
    console.log(result);    // 42
}

// 等价于
function test() {
    return Promise.resolve(42).then(result => {
        console.log(result);
    });
}
```

### 验证3：错误处理
```javascript
async function test() {
    try {
        let result = await Promise.reject("错误");
    } catch (err) {
        console.log("捕获:", err);
    }
}

// 等价于
function test() {
    return Promise.reject("错误")
        .then(result => {
            // 成功
        })
        .catch(err => {
            console.log("捕获:", err);
        });
}
```

---

## 6.底层依赖关系图


底层关系图 
```
┌─────────────────────────────────────┐
│         async/await (语法糖)         │
│  - async 标记函数返回 Promise        │
│  - await 暂停执行等待 Promise        │
└──────────────┬──────────────────────┘
               │ 编译/转换
               ↓
┌─────────────────────────────────────┐
│      Generator (生成器)              │
│  - function* 定义生成器函数          │
│  - yield 暂停并返回值                │
│  - next() 恢复执行                   │
└──────────────┬──────────────────────┘
               │ 基于
               ↓
┌─────────────────────────────────────┐
│         Promise (承诺)               │
│  - 状态：pending/fulfilled/rejected  │
│  - .then() 注册回调                  │
│  - .catch() 错误处理                 │
└──────────────┬──────────────────────┘
               │ 基于
               ↓
┌─────────────────────────────────────┐
│      Event Loop (事件循环)           │
│  - 宏任务 / 微任务队列               │
│  - 异步调度机制                      │
└─────────────────────────────────────┘
```

^clyoeh


---

## 7. 性能对比

```javascript
// 测试：1000次异步操作
function promiseTest() {
    let start = Date.now();
    let promise = Promise.resolve();
  
    for (let i = 0; i < 1000; i++) {
        promise = promise.then(() => i);
    }
  
    return promise.then(() => {
        console.log("Promise:", Date.now() - start);
    });
}

async function asyncTest() {
    let start = Date.now();
  
    for (let i = 0; i < 1000; i++) {
        await Promise.resolve(i);
    }
  
    console.log("async/await:", Date.now() - start);
}

promiseTest();  // ~5ms
asyncTest();    // ~8ms
```

**结论：Promise 略快，因为 async/await 有编译和状态机开销**

---

## 8. 浏览器实现

```javascript
// V8 引擎（Chrome）的实现思路

// async 函数
async function foo() {
    return await bar();
}

// V8 内部转换（伪代码）
function foo() {
    return new Promise((resolve, reject) => {
        // 创建隐式的 Generator
        let $generator = {
            state: 0,
            locals: {}
        };
      
        function $resume(value) {
            switch($generator.state) {
                case 0:
                    $generator.state = 1;
                    Promise.resolve(bar()).then($resume, $reject);
                    break;
                case 1:
                    resolve(value);
                    break;
            }
        }
      
        function $reject(error) {
            reject(error);
        }
      
        $resume();
    });
}
```

---

## 完整对照表

| 层次 | 技术 | 作用 | 关系 |
|------|------|------|------|
| **语法层** | `async/await` | 语法糖，让异步代码看起来像同步 | 编译成 Generator |
| **控制流层** | `Generator` | 提供暂停/恢复能力（`yield`/`next()`） | 配合 Promise 实现 |
| **异步层** | `Promise` | 管理异步状态和回调 | 基于 Event Loop |
| **运行时层** | `Event Loop` | 调度异步任务（宏任务/微任务） | 底层机制 |

---

## 核心结论

### async/await 的底层是：

1. **语法层面**：语法糖，编译成 Generator + Promise
2. **执行层面**：Generator 提供暂停/恢复，Promise 管理异步
3. **本质**：自动执行的 Generator + Promise 包装器

### 类比理解：

```
async/await  =  自动挡汽车
Generator    =  手动挡汽车
Promise      =  发动机
Event Loop   =  道路系统
```

**所以回答你的问题：async/await 底层是 Promise + Generator，Promise 是核心，Generator 提供控制流，async/await 是语法糖。**