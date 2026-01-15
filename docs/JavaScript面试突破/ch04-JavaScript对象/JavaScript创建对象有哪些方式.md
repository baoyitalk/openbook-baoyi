# js创建对象的方式概述


JavaScript中有八种数据类型，有七种基本数据类型和对象（Object），对象就是引用类型
创建JavaScript对象的方式有8种：

```
// 引用类型（都是对象）
let obj = {};            // 普通对象
let arr = [];            // 数组对象
let fn = function(){};   // 函数对象
let date = new Date();   // 日期对象
let reg = /abc/;         // 正则对象


```
**所有的构造函数 既是函数也是对象**
**引用数据类型**：`Object`、`Array`、`Function` 等属于对象既引用数据类型也是构造函数（存储在堆内存，变量保存的是堆内存的引用地址）。


![](images/JavaScript创建对象有哪些方式-20260115153321.png)



## 1-三种最基本方式创建JavaScript对象

- Object构造函数
- 对象字面量
- Object.create原型链

## 2-类（语法糖）创建对象



## 3-四种基于原型继承方式

ES6开始正式支持类和继承，涵盖了之前规范设计的基于原型的继承方式

- 工厂模式
- 构造函数模式
- 原型模式
- 组合模式




# JavaScript对象的本质


## 对象组成

JavaScript中对象就是属性的集合 + 原型链

```
对象 =  {
  自有属性 (存储在对象本身)
  +
  原型链属性（[[Prototype]] 链接 指向另一个对象）
}
```

```
// 原型链的隐藏与 可见
const obj = { name: 'Alice' };

// ❌ 你看不到的（内部表示）
// [[Prototype]] ← 这是 ECMAScript 规范的内部插槽，代码无法直接访问

// ✅ 你能看到的（实际访问方式）
console.log(obj.__proto__);              // Object.prototype（非标准但可用）
console.log(Object.getPrototypeOf(obj)); // Object.prototype（标准方法）

```

## 自有属性&&原型链属性

自有属性的优先级更高

可以in查询遍历所有属性 包括自有属性 和 原型链属性
```js
function Person(name) {
  this.name = name;
}
Person.prototype.age = 18;

const p = new Person('Alice');

// 题目：以下输出什么？
console.log(p.name);  // 'Alice'（自有属性）
console.log(p.age);   // 18（原型属性）

console.log(p.hasOwnProperty('name'));  // true
console.log(p.hasOwnProperty('age'));   // false

console.log(Object.keys(p));  // ['name']（只有自有属性）

// 遍历所有属性（包括原型）
for (let key in p) {
  console.log(key);  // 'name', 'age'
}

// 只遍历自有属性
for (let key in p) {
  if (p.hasOwnProperty(key)) {
    console.log(key);  // 'name'
  }
}

```


## 为什么要用到原型链

本质是节省内存 高效复用 特别是对象的函数复用

案例1 没有原型链的世界

```js
// 创建1000个人
const people = [];
for (let i = 0; i < 1000; i++) {
  people.push({
    name: `Person${i}`,
    sayHi: function() {  // ❌ 每个对象都复制一份函数
      console.log(this.name);
    }
  });
}

// 问题：内存中有1000个相同的 sayHi 函数！
// 浪费内存：1000份函数 × 函数大小 = 巨大浪费

```

有原型链的世界

```js
// 创建1000个人
function Person(name) {
  this.name = name;  // 每个人有自己的名字
}

Person.prototype.sayHi = function() {  // ✅ 只有1份函数
  console.log(this.name);
};

const people = [];
for (let i = 0; i < 1000; i++) {
  people.push(new Person(`Person${i}`));
}

// 结果：1000个对象共享1个 sayHi 函数
// 节省内存：只存储1份函数

```



误区1 函数本体存放在堆内存吗

```
**在 JavaScript 中，只要你创建了函数（无论以哪种方式），函数的本体就一定会被存储在堆内存中**—— 栈内存里永远只存 “指向这个堆内存地址的引用”，不会存函数本身。

**“变量本身” 的理解**：你说的 “变量本身” 如果指「变量名」，那它永远在栈；如果指「变量的值」，则分类型 —— 基本类型值在栈，引用类型值（地址）在栈、本体在堆。
**函数参数也是变量**：函数的参数变量遵循同样规则，比如 `function test(num) { }`，调用 `test(18)` 时，参数 `num`（标识符 + 18）都在栈内存。
✅ **函数体（也就是函数的代码逻辑、函数本身）一定是存储在堆内存中的**，这是 JavaScript 内存分配的铁律，没有任何例外。

```







#  typeof&& instanceof


typeof主要识别基于类型和函数， instanceof识别引用类型（泛指对象）的具体类型


## 1- typeof：判断「基本数据类型」+ 识别函数（简单粗暴）

### 核心作用

专门用来快速判断**基本数据类型**，也能识别「函数」（引用类型里的特例），返回一个**字符串类型的类型名**。

```js
// 语法
typeof 变量/值;

```

案例
```
// 1. 基本数据类型判断
typeof 18;        // "number"
typeof 'Person1'; // "string"
typeof true;      // "boolean"
typeof undefined; // "undefined"
typeof Symbol();  // "symbol"
typeof 123n;      // "bigint"
typeof null;      // "object" ❌ 历史bug（记住即可，null不是对象）

// 2. 引用类型判断（局限性：只能识别函数，其他引用类型都返回"object"）
typeof { name: 'Person1' }; // "object"（无法区分普通对象/数组/日期）
typeof [];                  // "object"（数组也返回object）
typeof people;              // "object"（你之前的people数组，返回object）
typeof function() {};       // "function" ✅ 唯一能精准识别的引用类型
typeof people[0].sayHi;     // "function"（你之前的sayHi函数，返回function）

```



## 2- instanceof：判断「引用数据类型的具体类型」（查原型链）
能精准区分**具体的引用类型**（数组 / 对象 / 函数 / 日期等）；
instanceof Object 一般没错 函数也符合 数组也符合， 函数 数组都是Object的子类

案例
```js

// 1. 引用类型判断（精准区分具体类型）
const people = [];
people instanceof Array;    // true ✅ 能判断是数组（typeof只能返回object）
people instanceof Object;   // true ✅ 数组也是Object的子类（原型链继承）

const obj = { name: 'Person1' };
obj instanceof Object;      // true ✅ 普通对象
obj instanceof Array;       // false ❌ 不是数组

const sayHi = function() {};
sayHi instanceof Function;  // true ✅ 函数是Function的实例
sayHi instanceof Object;    // true ✅ 函数也是Object的子类

// 2. 基本数据类型判断（局限性：完全无效）
18 instanceof Number;       // false ❌ 基本类型的数字不是Number实例
'Person1' instanceof String;// false ❌ 同理

```

### 关键特点

- 优点：能精准区分**具体的引用类型**（数组 / 对象 / 函数 / 日期等）；
- 缺点：不能判断基本数据类型；原型链可被修改，可能导致结果不准确；
- 注意：所有引用类型都是 `Object` 的实例（所以 `xxx instanceof Object` 大概率返回 true）。






# 谈谈Object


## Object具备双层身份 
既是对象也是函数， 函数是一等公民，函数也是对象
所有的构造函数都是这样 既是函数也是对象

案例

```js
// JavaScript 中的设计原则：函数是一等公民，函数也是对象

// 证明1：函数可以有属性
function myFunc() {}
myFunc.prop = 'value';
console.log(myFunc.prop);  // 'value'

// 证明2：函数可以作为对象传递
const funcObj = myFunc;
console.log(typeof funcObj);  // 'function'
console.log(funcObj instanceof Object);  // true

// 证明3：Object 也遵循这个规则
console.log(typeof Object);  // 'function' typeof可以识别基础类型 和 函数
console.log(Object instanceof Object);  // true


```


Object的特殊性在于它是所有对象的祖先

```js
// Object 的特殊之处：它是所有对象的祖先

// 所有对象最终都继承自 Object.prototype
const arr = [];
const fn = function(){};
const date = new Date();

console.log(arr.__proto__.__proto__ === Object.prototype);   // true
console.log(fn.__proto__.__proto__ === Object.prototype);    // true
console.log(date.__proto__.__proto__ === Object.prototype);  // true

// 但 Object 本身也是对象，也继承自 Object.prototype
console.log(Object.__proto__.__proto__ === Object.prototype);  // true

```





## 构造函数与实例

```js
// 实例 = 通过构造函数创建出来的对象

// 例子1：数组实例
const arr = [1, 2, 3];
// arr 是变量名
// [1, 2, 3] 是数组对象，是 Array 的实例
console.log(arr instanceof Array);  // true

// 例子2：日期实例
const today = new Date();
// today 是变量名
// new Date() 创建的对象是 Date 的实例
console.log(today instanceof Date);  // true

// 例子3：函数实例
const fn = function(){};
// fn 是变量名
// function(){} 是函数对象，是 Function 的实例
console.log(fn instanceof Function);  // true


```









# 三种基本创建方式

## 1- Object 构造函数


创建自定义对象可以创建Object的一个新实例，再添加属性和方法

这是最基础的创建对象


```js

// Object构造函数创建对象

  

let person = new Object();

  

// 添加属性

person.name = "lucy";

  

// 添加方法

person.sayName = function() {

person.sayName = function() {

console.log(this.name)

}

}
```

拆解底层实现

### 本质
- **原型继承**的核心方式
- 原型链：`p -> Person.prototype -> Object.prototype -> null`






## 2- 对象字面量

对象字面量创建对象更为简单直接，这个例子跟上面是等价的

```js
// 对象字面量创建新对象更为简单直接

  

let person = {

name: 'lucy',

sayName() { // 直接放函数表达式

console.log(this.name)

}

}
```


### 本质
- **最直接**的创建方式
- 原型链：`obj -> Object.prototype -> null`




## 3- `Object.create()` 
`Object.create()`  方法创建一个新对象，使用现有对象作为新对象的原型
直接基于 实例 创建对象 更灵活 避免原型污染

### 3.1- 案例

```js
// Object.create()创建新对象

let person = {

name: 'lucy',

sayName() { // 直接放函数表达式

console.log(this.name)

}

}

  

let person1 = Object.create(person);

console.log(person1.name); // 'lucy'

```

### 3.2-  拆解案例 create的底层实现

`F.prototype = person `  
`person.__ptoto__ = Object.prototype` 不要混淆了则个  他们原型的本质是 普通对象

```js

const person = { sayHi() { console.log('Hi'); } };

function F() {}

F.prototype = person;

const obj = new F();

  

// 验证1：obj的__proto__ → person

console.log(obj.__proto__ === person); // true

// 验证2：F.prototype → person

console.log(F.prototype === person); // true

// 验证3：person自身的__proto__ → Object.prototype（和F无关）

console.log(person.__proto__ === Object.prototype); // true

// 验证4：obj能继承person的方法

obj.sayHi(); // Hi
```

 等价于 `obj.__proto__`

```

- `F.prototype = person` 的作用：**把构造函数 F 的 “原型对象” 换成 person，让 new F () 创建的 obj 直接继承 person**；
- 关键区分：
    
    - `obj.__proto__` → 指向 person（因为 F.prototype=person）；
    - `person.__proto__` → 指向 Object.prototype（person 自己的原型，和 F 无关）；
```

误区:
```
obj.__proto__` 的唯一合法值是：**普通对象（或 null）**，永远不可能直接指向 “构造函数（函数类型）
`F.prototype`也是普通对象 不是构造函数 
原型链里最容易搞反的核心误区 obj.__proto__ 本来就应该指向「普通对象」（原型对象），而不是构造函数**！构造函数和 “构造函数的 prototype（原型对象）” 是完全不同的东西
```

```

- 实例的 `obj.constructor` 会指向**构造函数 F**（这是因为 `person` 继承了 `Object.prototype.constructor`，最终指向创建它的构造函数）；
- 但 `obj.__proto__` 依然指向**普通对象 person**
  
```









### 3.2- 与 new 构造函数的区别
![](images/JavaScript创建对象有哪些方式-20260115180403.png)

### 3.3- 创建纯净对象
**用途：** 做字典/映射时避免原型污染
```js
// 普通对象：继承 Object.prototype
const obj1 = {};
obj1.toString  // 有这个方法（继承来的）

// 纯净对象：没有原型
const obj2 = Object.create(null);
obj2.toString  // undefined（完全干净）

```


### 3.4- 直接基于对象实例创建 原型继承


```js
const animal = {
  eat() { console.log("eating"); }
};

const dog = Object.create(animal);
dog.bark = function() { console.log("woof"); };

dog.eat();   // "eating"（继承）
dog.bark();  // "woof"（自己的）


```





# 类 创建对象

