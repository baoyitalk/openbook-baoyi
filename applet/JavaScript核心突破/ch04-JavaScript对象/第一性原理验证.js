// ========================================
// JavaScript对象创建的第一性原理验证
// 不死记硬背，用代码验证底层原理
// ========================================

console.log('========================================');
console.log('第一性原理：对象 = 属性 + 原型链');
console.log('========================================\n');

// ========================================
// 原理1：所有对象创建最终都是设置原型链
// ========================================

console.log('=== 原理验证1：所有方式最终都是设置 __proto__ ===\n');

// 方式1：对象字面量
const obj1 = { name: 'Lucy' };
console.log('1. 对象字面量 {}');
console.log('   obj1.__proto__ === Object.prototype:', obj1.__proto__ === Object.prototype);

// 方式2：Object.create()
const proto = { sayHi() { console.log('Hi'); } };
const obj2 = Object.create(proto);
console.log('\n2. Object.create()');
console.log('   obj2.__proto__ === proto:', obj2.__proto__ === proto);

// 方式3：构造函数
function Person(name) {
    this.name = name;
}
const obj3 = new Person('Tom');
console.log('\n3. 构造函数 + new');
console.log('   obj3.__proto__ === Person.prototype:', obj3.__proto__ === Person.prototype);

// 方式4：Class
class Animal {
    constructor(name) {
        this.name = name;
    }
}
const obj4 = new Animal('Dog');
console.log('\n4. Class');
console.log('   obj4.__proto__ === Animal.prototype:', obj4.__proto__ === Animal.prototype);

console.log('\n✅ 结论：所有方式最终都是设置原型链！\n');


// ========================================
// 原理2：手写new，理解底层机制
// ========================================

console.log('=== 原理验证2：new关键字的底层实现 ===\n');

function myNew(Constructor, ...args) {
    console.log('步骤1：创建空对象');
    const obj = {};
    
    console.log('步骤2：设置原型链（关键！）');
    obj.__proto__ = Constructor.prototype;
    
    console.log('步骤3：绑定this并执行构造函数');
    const result = Constructor.apply(obj, args);
    
    console.log('步骤4：返回对象');
    return (typeof result === 'object' && result !== null) ? result : obj;
}

function Person2(name, age) {
    this.name = name;
    this.age = age;
}
Person2.prototype.sayHi = function() {
    return `Hi, I'm ${this.name}`;
};

console.log('使用手写的myNew：');
const p1 = myNew(Person2, 'Alice', 25);
console.log('\n验证结果：');
console.log('  p1.name:', p1.name);
console.log('  p1.age:', p1.age);
console.log('  p1.sayHi():', p1.sayHi());
console.log('  p1 instanceof Person2:', p1 instanceof Person2);

console.log('\n对比原生new：');
const p2 = new Person2('Bob', 30);
console.log('  p2.name:', p2.name);
console.log('  p2 instanceof Person2:', p2 instanceof Person2);

console.log('\n✅ 结论：手写new与原生new完全等价！\n');


// ========================================
// 原理3：从问题到解决方案的演进
// ========================================

console.log('=== 原理验证3：为什么需要这些不同的方式？ ===\n');

// 问题1：工厂模式的缺陷
console.log('--- 问题1：工厂模式无法识别类型 ---');
function createPerson(name) {
    const obj = {};
    obj.name = name;
    obj.sayHi = function() { return 'Hi'; };
    return obj;
}

const factory1 = createPerson('Lucy');
const factory2 = createPerson('Tom');

console.log('工厂模式创建的对象：');
console.log('  factory1 instanceof createPerson:', factory1 instanceof createPerson); // false ❌
console.log('  factory1.sayHi === factory2.sayHi:', factory1.sayHi === factory2.sayHi); // false ❌
console.log('  → 问题：无类型识别，方法不共享\n');

// 解决方案：构造函数模式
console.log('--- 解决方案1：构造函数模式（引入new） ---');
function Constructor(name) {
    this.name = name;
    this.sayHi = function() { return 'Hi'; };
}

const cons1 = new Constructor('Lucy');
const cons2 = new Constructor('Tom');

console.log('构造函数模式：');
console.log('  cons1 instanceof Constructor:', cons1 instanceof Constructor); // true ✅
console.log('  cons1.sayHi === cons2.sayHi:', cons1.sayHi === cons2.sayHi); // false ❌
console.log('  → 改进：有类型识别');
console.log('  → 问题：方法仍不共享\n');

// 解决方案：原型模式
console.log('--- 解决方案2：原型模式（方法放原型上） ---');
function Prototype(name) {
    this.name = name;
}
Prototype.prototype.sayHi = function() { return 'Hi'; };

const proto1 = new Prototype('Lucy');
const proto2 = new Prototype('Tom');

console.log('原型模式：');
console.log('  proto1.sayHi === proto2.sayHi:', proto1.sayHi === proto2.sayHi); // true ✅
console.log('  → 改进：方法共享了！');
console.log('  → 这就是组合模式（构造函数+原型）\n');

console.log('✅ 结论：每种方式都是为了解决前一种的问题！\n');


// ========================================
// 原理4：原型链查找机制
// ========================================

console.log('=== 原理验证4：原型链查找机制 ===\n');

function Demo() {
    this.ownProp = 'own';
}
Demo.prototype.protoProp = 'proto';

const demo = new Demo();

console.log('对象结构：');
console.log('  demo = {');
console.log('    ownProp: "own",');
console.log('    __proto__: Demo.prototype {');
console.log('      protoProp: "proto"');
console.log('    }');
console.log('  }\n');

console.log('属性查找：');
console.log('  访问 demo.ownProp:', demo.ownProp);
console.log('    → 在对象自身找到 ✅');

console.log('\n  访问 demo.protoProp:', demo.protoProp);
console.log('    → 对象自身没有');
console.log('    → 沿着 __proto__ 查找');
console.log('    → 在 Demo.prototype 找到 ✅');

console.log('\n  访问 demo.notExist:', demo.notExist);
console.log('    → 对象自身没有');
console.log('    → Demo.prototype 没有');
console.log('    → Object.prototype 没有');
console.log('    → 返回 undefined ✅');

console.log('\n✅ 结论：原型链是一层层��找的机制！\n');


// ========================================
// 原理5：Class是语法糖
// ========================================

console.log('=== 原理验证5：Class本质上是组合模式 ===\n');

// ES6 Class
class ClassVersion {
    constructor(name) {
        this.name = name;
    }
    sayHi() {
        return `Hi, I'm ${this.name}`;
    }
}

// ES5 组合模式
function FunctionVersion(name) {
    this.name = name;
}
FunctionVersion.prototype.sayHi = function() {
    return `Hi, I'm ${this.name}`;
};

const c1 = new ClassVersion('Lucy');
const f1 = new FunctionVersion('Tom');

console.log('Class版本：');
console.log('  typeof ClassVersion:', typeof ClassVersion); // 'function'
console.log('  ClassVersion.prototype.sayHi:', typeof ClassVersion.prototype.sayHi); // 'function'
console.log('  c1.__proto__ === ClassVersion.prototype:', c1.__proto__ === ClassVersion.prototype); // true

console.log('\n函数版本：');
console.log('  typeof FunctionVersion:', typeof FunctionVersion); // 'function'
console.log('  FunctionVersion.prototype.sayHi:', typeof FunctionVersion.prototype.sayHi); // 'function'
console.log('  f1.__proto__ === FunctionVersion.prototype:', f1.__proto__ === FunctionVersion.prototype); // true

console.log('\n✅ 结论：Class只是语法糖，底层完全相同！\n');


// ========================================
// 原理6：内存布局对比
// ========================================

console.log('=== 原理验证6：为什么组合模式节省内存？ ===\n');

// 错误方式：构造函数中定义方法
function BadPattern(name) {
    this.name = name;
    this.sayHi = function() { return 'Hi'; };
}

// 正确方式：原型上定义方法
function GoodPattern(name) {
    this.name = name;
}
GoodPattern.prototype.sayHi = function() { return 'Hi'; };

// 创建多个实例
const bad1 = new BadPattern('A');
const bad2 = new BadPattern('B');
const bad3 = new BadPattern('C');

const good1 = new GoodPattern('A');
const good2 = new GoodPattern('B');
const good3 = new GoodPattern('C');

console.log('错误方式（构造函数中定义方法）：');
console.log('  bad1.sayHi === bad2.sayHi:', bad1.sayHi === bad2.sayHi); // false
console.log('  bad2.sayHi === bad3.sayHi:', bad2.sayHi === bad3.sayHi); // false
console.log('  → 3个实例 = 3个方法副本 ❌');
console.log('  → 1000个实例 = 1000个方法副本（浪费内存）');

console.log('\n正确方式（原型上定义方法）：');
console.log('  good1.sayHi === good2.sayHi:', good1.sayHi === good2.sayHi); // true
console.log('  good2.sayHi === good3.sayHi:', good2.sayHi === good3.sayHi); // true
console.log('  → 3个实例 = 1个共享方法 ✅');
console.log('  → 1000个实例 = 1个共享方法（节省内存）');

console.log('\n✅ 结论：方法放原型上，所有实例共享，节省内存！\n');


// ========================================
// 原理7：Object.create的底层实现
// ========================================

console.log('=== 原理验证7：Object.create的底层实现 ===\n');

// 手写Object.create
function myCreate(proto) {
    function F() {}
    F.prototype = proto;
    return new F();
}

const protoObj = {
    sayHi() { return 'Hi from proto'; }
};

const obj5 = myCreate(protoObj);
const obj6 = Object.create(protoObj);

console.log('手写版本：');
console.log('  obj5.__proto__ === protoObj:', obj5.__proto__ === protoObj);
console.log('  obj5.sayHi():', obj5.sayHi());

console.log('\n原生版本：');
console.log('  obj6.__proto__ === protoObj:', obj6.__proto__ === protoObj);
console.log('  obj6.sayHi():', obj6.sayHi());

console.log('\n✅ 结论：Object.create本质是利用new设置原型链！\n');


// ========================================
// 终极总结
// ========================================

console.log('========================================');
console.log('终极总结：从第一性原理理解8种方式');
console.log('========================================\n');

console.log('🔑 核心原理：');
console.log('1. 对象 = 属性 + 原型链');
console.log('2. 所有方式最终都是设置 obj.__proto__');
console.log('3. new的4步是一切的基础\n');

console.log('🎯 演进路线：');
console.log('问题：如何创建对象？');
console.log('  → {} / new Object()');
console.log('');
console.log('问题：如何控制原型链？');
console.log('  → Object.create(proto)');
console.log('');
console.log('问题：如何批量创���？');
console.log('  → 工厂模式（手动）');
console.log('  → 构造函数（自动化）');
console.log('  → 原型模式（方法共享）');
console.log('  → 组合模式（完美）');
console.log('  → Class（语法糖）');
console.log('');

console.log('💡 思考框架：');
console.log('1. 这个方式解决什么问题？');
console.log('2. 底层原理是什么？');
console.log('3. 为什么有缺陷？');
console.log('4. 如何改进？');
console.log('');

console.log('✅ 实战选择：');
console.log('• 单个对象 → {}');
console.log('• 控制原型 → Object.create()');
console.log('• 批量创建 → class（现代） / 组合模式（ES5）');
console.log('');

console.log('🎓 记住：理解原型链，就理解了一切！');
