## 第一性原理拆解：JavaScript 对象

### 核心问题：如何组织和复用数据与行为？

---

## 一、对象的本质

**对象 = 键值对的集合**，用于将相关的数据和行为组织在一起。

```javascript
// 最原始的需求：把相关的东西放一起
let name = "张三";
let age = 20;
let sayHi = function() { console.log("Hi"); }

// 用对象组织
let person = { name: "张三", age: 20, sayHi() { console.log("Hi"); } }
```

---

## 二、创建对象的方式（从简单到复杂）

```javascript
// 1. 字面量 —— 最直接
let obj = { name: "张三" };

// 2. new Object()
let obj = new Object();
obj.name = "张三";

// 3. 构造函数 —— 可复用
function Person(name) {
    this.name = name;
}
let p = new Person("张三");

// 4. Object.create() —— 指定原型
let p = Object.create(proto);

// 5. class —— ES6 语法糖
class Person {
    constructor(name) { this.name = name; }
}
```

---

## 三、原型与原型链（核心中的核心）

### 为什么需要原型？

```javascript
// 问题：每个实例都有自己的方法副本，浪费内存
function Person(name) {
    this.name = name;
    this.sayHi = function() { console.log("Hi"); }  // 每次 new 都创建新函数
}
```

### 解决：共享方法放原型上

```javascript
function Person(name) {
    this.name = name;
}
Person.prototype.sayHi = function() { console.log("Hi"); }  // 所有实例共享
```

### 原型链结构

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   实例 p                                                    │
│   ├── name: "张三"        （自有属性）                       │
│   └── __proto__  ────────→  Person.prototype               │
│                              ├── sayHi: function            │
│                              └── __proto__ ──→ Object.prototype
│                                                 └── __proto__ ──→ null
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 三个关键关系

```javascript
function Person() {}
let p = new Person();

p.__proto__ === Person.prototype           // true（实例的原型）
Person.prototype.constructor === Person    // true（原型的构造函数）
Person.__proto__ === Function.prototype    // true（函数也是对象）
```

---

## 四、继承的演进

| 方式 | 原理 | 优点 | 缺点 |
|------|------|------|------|
| 原型链继承 | `Child.prototype = new Parent()` | 简单 | 引用属性共享、无法传参 |
| 构造函数继承 | `Parent.call(this)` | 可传参、属性独立 | 方法不能复用 |
| 组合继承 | 原型链 + 构造函数 | 常用 | 父构造函数调用两次 |
| 寄生组合继承 | `Object.create(Parent.prototype)` | 最优 | 写法复杂 |
| class extends | ES6 语法糖 | 简洁清晰 | 本质还是原型 |

### 经典面试代码：寄生组合继承

```javascript
function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue'];
}
Parent.prototype.sayName = function() {
    console.log(this.name);
}

function Child(name, age) {
    Parent.call(this, name);  // 继承属性
    this.age = age;
}

// 继承方法（核心）
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

// 测试
let c1 = new Child("张三", 20);
let c2 = new Child("李四", 22);
c1.colors.push('green');
console.log(c2.colors);  // ['red', 'blue']  互不影响
```

---

## 五、类型判断方法

```javascript
// 1. typeof —— 判断原始类型
typeof "hello"    // "string"
typeof null       // "object" （bug）

// 2. instanceof —— 判断原型链
[] instanceof Array   // true
[] instanceof Object  // true

// 3. Object.prototype.toString —— 最准确
Object.prototype.toString.call([]);       // "[object Array]"
Object.prototype.toString.call(null);     // "[object Null]"

// 4. constructor
[].constructor === Array  // true（可被篡改）
```

### 经典面试代码：手写 instanceof

```javascript
function myInstanceof(obj, Constructor) {
    let proto = Object.getPrototypeOf(obj);
    while (proto !== null) {
        if (proto === Constructor.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
    return false;
}
```

---

## 六、Map vs WeakMap

| 特性      | Map   | WeakMap     |
| ------- | ----- | ----------- |
| 键类型     | 任意值   | 只能是对象       |
| 垃圾回收    | 键被强引用 | 键是弱引用，可被 GC |
| 可遍历     | ✅     | ❌           |
| size 属性 | ✅     | ❌           |

**WeakMap 用途：** 存储对象的私有数据，对象销毁时自动清理。

```javascript
// 典型应用：存储 DOM 节点相关数据
const cache = new WeakMap();
function bindData(element, data) {
    cache.set(element, data);  // element 被删除时，data 自动释放
}
```

---

## 七、深拷贝 vs 浅拷贝

### 本质区别

```
浅拷贝：复制第一层，深层仍是引用
深拷贝：递归复制所有层，完全独立
```

### 浅拷贝方法

```javascript
Object.assign({}, obj)
{ ...obj }
arr.slice()
arr.concat()
```

### 经典面试代码：手写深拷贝

```javascript
function deepClone(obj, map = new WeakMap()) {
    // 原始类型直接返回
    if (obj === null || typeof obj !== 'object') return obj;
    
    // 处理循环引用
    if (map.has(obj)) return map.get(obj);
    
    // 处理特殊对象
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    
    // 创建新对象/数组
    const clone = Array.isArray(obj) ? [] : {};
    map.set(obj, clone);
    
    // 递归复制
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            clone[key] = deepClone(obj[key], map);
        }
    }
    return clone;
}

// 测试
let obj = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
obj.self = obj;  // 循环引用
let copy = deepClone(obj);
copy.b.c = 999;
console.log(obj.b.c);  // 2（原对象不受影响）
```

---

## 总结

```
┌────────────────────────────────────────────────────────────┐
│                    JavaScript 对象体系                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  创建对象 ─→ 字面量 / 构造函数 / class / Object.create     │
│                                                            │
│  复用机制 ─→ 原型链（__proto__ → prototype → ... → null）  │
│                                                            │
│  继承方式 ─→ 寄生组合继承（最优）/ class extends（推荐）   │
│                                                            │
│  类型判断 ─→ typeof（原始）/ instanceof（引用）            │
│             / Object.prototype.toString（最准确）          │
│                                                            │
│  拷贝机制 ─→ 浅拷贝（第一层）/ 深拷贝（递归 + 循环引用）   │
│                                                            │
│  Map 家族 ─→ Map（通用）/ WeakMap（弱引用，防内存泄漏）    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**核心记忆：原型链是 JS 对象系统的灵魂，一切继承和类型判断都基于它。**