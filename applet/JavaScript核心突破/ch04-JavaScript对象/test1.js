// ========================================
// 8种创建对象方式完整示例
// ========================================

console.log('=== 1. Object构造函数创建对象 ===');
let person1 = new Object();
person1.name = "Lucy";
person1.age = 18;
person1.sayName = function() {
    console.log(this.name);
}
console.log(person1.name); // Lucy
person1.sayName(); // Lucy


console.log('\n=== 2. 对象字面量创建对象 ===');
let person2 = {
    name: 'Tom',
    age: 20,
    sayName() {
        console.log(this.name);
    }
}
console.log(person2.name); // Tom
person2.sayName(); // Tom


console.log('\n=== 3. Object.create()创建对象 ===');
let personProto = {
    sayHi() {
        console.log(`Hi, I'm ${this.name}`);
    }
}
let person3 = Object.create(personProto);
person3.name = 'Jack';
console.log(person3.name); // Jack
person3.sayHi(); // Hi, I'm Jack

// Object.create底层实现原理
console.log('--- Object.create底层原理 ---');
function myCreate(proto) {
    function F() {}
    F.prototype = proto;
    return new F();
}
let person3b = myCreate(personProto);
person3b.name = 'Rose';
person3b.sayHi(); // Hi, I'm Rose


console.log('\n=== 4. Class类创建对象 ===');
class Person4 {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    sayName() {
        console.log(this.name);
    }
}
const person4 = new Person4('Alice', 22);
console.log(person4.name); // Alice
person4.sayName(); // Alice


console.log('\n=== 5. 工厂模式创建对象 ===');
function createPerson(name, age) {
    let o = new Object(); // 或者 let o = {};
    o.name = name;
    o.age = age;
    o.sayName = function() {
        console.log(this.name);
    }
    return o; // 必须手动返回
}
const person5a = createPerson('Bob', 25);
const person5b = createPerson('Mary', 23);
console.log(person5a.name); // Bob
person5a.sayName(); // Bob

// 工厂模式的缺点：无法识别对象类型
console.log('--- 工厂模式的缺点 ---');
console.log(person5a instanceof createPerson); // false ❌
console.log(person5a.sayName === person5b.sayName); // false（每个实例都创建新函数，浪费内存）


console.log('\n=== 6. 构造函数模式创建对象 ===');
function Person6(name, age) {
    this.name = name;
    this.age = age;
    this.sayName = function() {
        console.log(this.name);
    }
}
const person6a = new Person6('David', 28);
const person6b = new Person6('Emma', 26);
console.log(person6a.name); // David
person6a.sayName(); // David

// 构造函数模式的优点和缺点
console.log('--- 构造函数模式的特点 ---');
console.log(person6a instanceof Person6); // true ✅（可以识别类型）
console.log(person6a.sayName === person6b.sayName); // false ❌（方法不共享，浪费内存）

// 手写new的实现
console.log('--- 手写new的实现 ---');
function myNew(Constructor, ...args) {
    // 1. 创建空对象
    const obj = {};
    // 2. 设置原型链
    obj.__proto__ = Constructor.prototype;
    // 3. 执行构造函数，绑定this
    const result = Constructor.apply(obj, args);
    // 4. 返回对象
    return (typeof result === 'object' && result !== null) ? result : obj;
}
const person6c = myNew(Person6, 'Frank', 30);
console.log(person6c.name); // Frank
person6c.sayName(); // Frank


console.log('\n=== 7. 原型模式创建对象 ===');
function Person7() {}
Person7.prototype.name = 'Prototype Name';
Person7.prototype.age = 18;
Person7.prototype.sayName = function() {
    console.log(this.name);
}

const person7a = new Person7();
const person7b = new Person7();
console.log(person7a.name); // Prototype Name
person7a.sayName(); // Prototype Name

// 原型模式的优点和缺点
console.log('--- 原型模式的特点 ---');
console.log(person7a.sayName === person7b.sayName); // true ✅（方法共享）
console.log(person7a.name === person7b.name); // true ❌（属性也共享，无法独立）

// 修改原型属性会影响所有实例
person7a.name = 'Changed Name'; // 给实例添加自有属性
console.log(person7a.name); // Changed Name（自有属性）
console.log(person7b.name); // Prototype Name（原型属性）

// 但如果原型属性是引用类型，会有问题
function Person7b() {}
Person7b.prototype.friends = ['Alice', 'Bob'];
const p7a = new Person7b();
const p7b = new Person7b();
p7a.friends.push('Charlie'); // 修改引用类型
console.log(p7a.friends); // ['Alice', 'Bob', 'Charlie']
console.log(p7b.friends); // ['Alice', 'Bob', 'Charlie'] ❌（都被修改了）


console.log('\n=== 8. 组合模式创建对象（构造函数+原型）===');
function Person8(name, age) {
    // 构造函数：定义实例属性（每个实例独立）
    this.name = name;
    this.age = age;
    this.friends = ['Alice']; // 引用类型也独立
}
// 原型：定义共享方法（所有实例共享）
Person8.prototype.sayName = function() {
    console.log(this.name);
}
Person8.prototype.getFriends = function() {
    console.log(this.friends);
}

const person8a = new Person8('George', 32);
const person8b = new Person8('Helen', 29);
person8a.sayName(); // George
person8b.sayName(); // Helen

// 组合模式的优点
console.log('--- 组合模式的优点（ES5最佳实践）---');
console.log(person8a.sayName === person8b.sayName); // true ✅（方法共享，节省内存）
console.log(person8a.name === person8b.name); // false ✅（属性独立）
console.log(person8a.friends === person8b.friends); // false ✅（引用类型也独立）

person8a.friends.push('Bob');
person8a.getFriends(); // ['Alice', 'Bob']
person8b.getFriends(); // ['Alice'] ✅（不受影响）


// ========================================
// 总结对比
// ========================================
console.log('\n=== 总结：各种方式的对比 ===');
console.log(`
┌─────────────────┬──────────┬──────────┬──────────┬────────────┐
│ 方式            │ 类型识别 │ 方法共享 │ 属性独立 │ 推荐度     │
├─────────────────┼──────────┼──────────┼──────────┼────────────┤
│ Object构造函数  │ ✅       │ ❌       │ ✅       │ ⭐         │
│ 对象字面量      │ ✅       │ ❌       │ ✅       │ ⭐⭐⭐⭐⭐ │
│ Object.create() │ ✅       │ ✅       │ ✅       │ ⭐⭐⭐⭐   │
│ Class类         │ ✅       │ ✅       │ ✅       │ ⭐⭐⭐⭐⭐ │
│ 工厂模式        │ ❌       │ ❌       │ ✅       │ ⭐         │
│ 构造函数模式    │ ✅       │ ❌       │ ✅       │ ⭐⭐       │
│ 原型模式        │ ✅       │ ✅       │ ❌       │ ⭐         │
│ 组合模式        │ ✅       │ ✅       │ ✅       │ ⭐⭐⭐⭐   │
└─────────────────┴──────────┴──────────┴──────────┴────────────┘

记忆口诀：三基一糖四原型
- 三基本：Object���造、字面量、create
- 一语糖：class（ES6）
- 四原型：工厂、构造函数、原型、组合

面试重点：
1. 构造函数底层原理（new的4步）
2. 组合模式（构造函数+原型）
3. class是语法糖，底层还是原型
`);
