# js创建对象的方式概述


JavaScript中有八种数据类型，有七种基本数据类型和对象（Object），对象就是引用类型
创建JavaScript对象的方式有8种：

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

