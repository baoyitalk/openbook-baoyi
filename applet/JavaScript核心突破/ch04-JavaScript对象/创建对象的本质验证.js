// ========================================
// 验证：创建对象不一定需要new
// ========================================

console.log('========================================');
console.log('验证：创建对象不一定需要new');
console.log('========================================\n');

// ========================================
// 验证1：{} 不需要new，原型链自动存在
// ========================================

console.log('=== 验证1：{} 创建对象，不需要new ===\n');

const obj1 = {};  // 没有使用 new
obj1.name = 'Lucy';

console.log('创建对象：const obj1 = {}');
console.log('obj1:', obj1);
console.log('');
console.log('原型链自动存在：');
console.log('  obj1.__proto__ === Object.prototype:', obj1.__proto__ === Object.prototype);
console.log('  obj1.toString:', typeof obj1.toString);  // 从原型链继承
console.log('');
console.log('✅ 结论：{} 创建对象不需要new，原型链自动存在！\n');


// ========================================
// 验证2：Object.create() 不需要new
// ========================================

console.log('=== 验证2：Object.create() 不需要new ===\n');

const proto = {
    sayHi() {
        console.log('Hi from proto');
    }
};

const obj2 = Object.create(proto);  // 没有使用 new
obj2.name = 'Tom';

console.log('创建对象：const obj2 = Object.create(proto)');
console.log('obj2:', obj2);
console.log('');
console.log('原型链：');
console.log('  obj2.__proto__ === proto:', obj2.__proto__ === proto);
obj2.sayHi();  // 可以调用原型上的方法
console.log('');
console.log('✅ 结论：Object.create() 不需要new，可以精确控制原型链！\n');


// ========================================
// 验证3：new 的作用是批量创建 + 自定义原型链
// ========================================

console.log('=== 验证3：new 的真正作用 ===\n');

// 不用new：手动创建，重复代码多
console.log('--- 不用new的麻烦 ---');
const person1 = { name: 'Alice', sayHi() { console.log('Hi'); } };
const person2 = { name: 'Bob', sayHi() { console.log('Hi'); } };
const person3 = { name: 'Charlie', sayHi() { console.log('Hi'); } };
console.log('person1:', person1);
console.log('person2:', person2);
console.log('问题：重复代码多，方法不共享');
console.log('  person1.sayHi === person2.sayHi:', person1.sayHi === person2.sayHi);
console.log('');

// 用new：自动化，方法共享
console.log('--- 用new的好处 ---');
function Person(name) {
    this.name = name;
}
Person.prototype.sayHi = function() {
    console.log(`Hi, I'm ${this.name}`);
};

const p1 = new Person('David');
const p2 = new Person('Emma');
const p3 = new Person('Frank');

console.log('p1:', p1);
console.log('p2:', p2);
console.log('优势：代码简洁，方法共享');
console.log('  p1.sayHi === p2.sayHi:', p1.sayHi === p2.sayHi);
console.log('');
console.log('✅ 结论：new 的作用是自动化批量创建 + 设置自定义原型链！\n');


// ========================================
// 验证4：原型链在任何方式下都自动存在
// ========================================

console.log('=== 验证4：原型链在任何方式下都自动存在 ===\n');

const method1 = {};
const method2 = new Object();
const method3 = Object.create(Object.prototype);

class MyClass {}
const method4 = new MyClass();

console.log('方式1 {}:');
console.log('  有原型链？', method1.__proto__ !== undefined);
console.log('  原型链指向：', method1.__proto__ === Object.prototype);
console.log('');

console.log('方式2 new Object():');
console.log('  有原型链？', method2.__proto__ !== undefined);
console.log('  原型链指向：', method2.__proto__ === Object.prototype);
console.log('');

console.log('方式3 Object.create():');
console.log('  有原型链？', method3.__proto__ !== undefined);
console.log('  原型链指向：', method3.__proto__ === Object.prototype);
console.log('');

console.log('方式4 class + new:');
console.log('  有原型链？', method4.__proto__ !== undefined);
console.log('  原型链指向：', method4.__proto__ === MyClass.prototype);
console.log('');

console.log('✅ 结论：无论用什么方式，原型链都自动存在！\n');


// ========================================
// 验证5：new 真正的价值
// ========================================

console.log('=== 验证5：new 真正的价值在哪里？ ===\n');

console.log('new 的作用不是"创建对象"（{} 就能创建）');
console.log('new 的作用是：');
console.log('  1. 自动化批量创建');
console.log('  2. 设置自定义原型链（让对象继承构造函数的 prototype）');
console.log('  3. 方法共享（节省内存）');
console.log('');

// 演示内存效率
function Constructor1(name) {
    this.name = name;
    this.sayHi = function() { return 'Hi'; };  // ❌ 每个实例都创建
}

function Constructor2(name) {
    this.name = name;
}
Constructor2.prototype.sayHi = function() { return 'Hi'; };  // ✅ 只创建一次

const c1a = new Constructor1('A');
const c1b = new Constructor1('B');
const c2a = new Constructor2('C');
const c2b = new Constructor2('D');

console.log('错误用法（方法在构造函数内）：');
console.log('  c1a.sayHi === c1b.sayHi:', c1a.sayHi === c1b.sayHi);  // false
console.log('  → 1000个实例 = 1000个方法副本 ❌');
console.log('');

console.log('正确用法（方法在原型上）：');
console.log('  c2a.sayHi === c2b.sayHi:', c2a.sayHi === c2b.sayHi);  // true
console.log('  → 1000个实例 = 1个共享方法 ✅');
console.log('');


// ========================================
// 总结
// ========================================

console.log('========================================');
console.log('总结');
console.log('========================================\n');

console.log('❌ 错误理解：');
console.log('  "创建对象必须用 new 和原型链"');
console.log('');

console.log('✅ 正确理解：');
console.log('');
console.log('1. 创建对象不一定需要 new');
console.log('   - {} 就能创建对象');
console.log('   - Object.create() 也能创建对象');
console.log('');

console.log('2. 原型链自动存在');
console.log('   - 无论用什么方式创建对象，原型链都会自动设置');
console.log('   - {} → Object.prototype');
console.log('   - new Person() → Person.prototype');
console.log('');

console.log('3. new 的真正作用');
console.log('   - 不是为了"创建对象"（这个 {} 就能做）');
console.log('   - 而是为了"批量创建 + 自定义原型链"');
console.log('');

console.log('🎯 实战选择：');
console.log('  • 单个对象 → {}');
console.log('  • 批量对象 → class + new');
console.log('  • 控制原型 → Object.create()');
console.log('');

console.log('💡 记住：');
console.log('  不要问"必须用什么"');
console.log('  而要问"什么时候用什么"！');
