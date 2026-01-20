// ========================================
// 工厂模式 vs 构造函数：都是批量创建
// ========================================

console.log('========================================');
console.log('工厂模式 vs 构造函数：都是批量创建');
console.log('========================================\n');

// ========================================
// 1. 两者都能批量创建对象
// ========================================

console.log('=== 1. 两者都能批量创建对象 ===\n');

// 工厂模式：批量创建
function createPerson(name, age) {
    const obj = {};
    obj.name = name;
    obj.age = age;
    obj.sayHi = function() {
        console.log(`Hi, I'm ${this.name}`);
    };
    return obj;
}

// 构造函数模式：批量创建
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.sayHi = function() {
        console.log(`Hi, I'm ${this.name}`);
    };
}

// 都能批量创建
console.log('工厂模式：批量创建10个对象');
const factory1 = createPerson('Alice', 20);
const factory2 = createPerson('Bob', 22);
const factory3 = createPerson('Charlie', 25);
console.log('factory1:', factory1.name);
console.log('factory2:', factory2.name);
console.log('factory3:', factory3.name);

console.log('\n构造函数：批量创建10个对象');
const constructor1 = new Person('David', 30);
const constructor2 = new Person('Emma', 32);
const constructor3 = new Person('Frank', 35);
console.log('constructor1:', constructor1.name);
console.log('constructor2:', constructor2.name);
console.log('constructor3:', constructor3.name);

console.log('\n✅ 结论：两者都能批量创建对象！\n');


// ========================================
// 2. 关键区别1：类型识别
// ========================================

console.log('=== 2. 关键区别1：类型识别 ===\n');

console.log('工厂模式：无法识别对象类型');
console.log('  factory1 instanceof createPerson:', factory1 instanceof createPerson);  // false ❌
console.log('  factory1 instanceof Object:', factory1 instanceof Object);  // true
console.log('  → 只知道是Object，不知道是Person');

console.log('\n构造函数：可以识别对象类型');
console.log('  constructor1 instanceof Person:', constructor1 instanceof Person);  // true ✅
console.log('  constructor1 instanceof Object:', constructor1 instanceof Object);  // true
console.log('  → 知道是Person，也知道是Object');

console.log('\n✅ 结论：构造函数可以识别对象类型，工厂模式不行！\n');


// ========================================
// 3. 关键区别2：原型链
// ========================================

console.log('=== 3. 关键区别2：原型链 ===\n');

console.log('工厂模式：没有自定义原型链');
console.log('  factory1.__proto__ === createPerson.prototype:', factory1.__proto__ === createPerson.prototype);  // false ❌
console.log('  factory1.__proto__ === Object.prototype:', factory1.__proto__ === Object.prototype);  // true
console.log('  → 原型链直接指向Object.prototype');

console.log('\n构造函数：有自定义原型链');
console.log('  constructor1.__proto__ === Person.prototype:', constructor1.__proto__ === Person.prototype);  // true ✅
console.log('  → 原型链指向Person.prototype');

console.log('\n✅ 结论：构造函数有自定义原型链，工厂模式没有！\n');


// ========================================
// 4. 关键区别3：方法共享
// ========================================

console.log('=== 4. 关键区别3：方法共享（改进后）===\n');

// 工厂模式：无法共享方法
function createPersonBad(name) {
    return {
        name: name,
        sayHi: function() { console.log('Hi'); }  // 每次都创建新函数
    };
}

// 构造函数：可以共享方法（放在原型上）
function PersonGood(name) {
    this.name = name;
}
PersonGood.prototype.sayHi = function() {  // 只创建一次
    console.log('Hi');
};

const fb1 = createPersonBad('A');
const fb2 = createPersonBad('B');
const gb1 = new PersonGood('C');
const gb2 = new PersonGood('D');

console.log('工厂模式：方法不共享');
console.log('  fb1.sayHi === fb2.sayHi:', fb1.sayHi === fb2.sayHi);  // false ❌
console.log('  → 1000个对象 = 1000个方法副本');

console.log('\n构造函数：方法共享');
console.log('  gb1.sayHi === gb2.sayHi:', gb1.sayHi === gb2.sayHi);  // true ✅
console.log('  → 1000个对象 = 1个共享方法');

console.log('\n✅ 结论：构造函数+原型可以共享方法，工厂模式做不到！\n');


// ========================================
// 5. 为什么工厂模式无法共享方法？
// ========================================

console.log('=== 5. 为什么工厂模式无法共享方法？ ===\n');

console.log('问题：工厂模式为什么不能像构造函数一样共享方法？');
console.log('');

console.log('工厂模式的困境：');
console.log('  function createPerson(name) {');
console.log('      const obj = {};');
console.log('      obj.name = name;');
console.log('      obj.sayHi = ???  // 从哪里共享？');
console.log('      return obj;');
console.log('  }');
console.log('');

console.log('尝试1：放在函数外部？');
const sharedMethod = function() { console.log('Hi'); };
function createPerson1(name) {
    const obj = {};
    obj.name = name;
    obj.sayHi = sharedMethod;  // 引用外部函数
    return obj;
}
const p1a = createPerson1('A');
const p1b = createPerson1('B');
console.log('  p1a.sayHi === p1b.sayHi:', p1a.sayHi === p1b.sayHi);  // true ✅
console.log('  → 可以共享，但这样写很丑陋，不优雅');
console.log('');

console.log('尝试2：放在原型上？');
function createPerson2(name) {
    const obj = {};
    obj.name = name;
    return obj;
}
createPerson2.prototype.sayHi = function() {
    console.log('Hi');
};
const p2a = createPerson2('A');
console.log('  p2a.sayHi:', p2a.sayHi);  // undefined ❌
console.log('  → 不行！因为obj的原型是Object.prototype，不是createPerson2.prototype');
console.log('');

console.log('✅ 结论：工厂模式无法优雅地共享方法，这就是为什么需要构造函数！\n');


// ========================================
// 6. 总结对比
// ========================================

console.log('========================================');
console.log('总结对比');
console.log('========================================\n');

console.log('┌─────────────┬──────────────┬──────────────┐');
console.log('│             │  工厂模式    │ 构造函数模式 │');
console.log('├─────────────┼──────────────┼──────────────┤');
console.log('│ 批量创建    │ ✅ 可以      │ ✅ 可以      │');
console.log('│ 调用方式    │ 普通调用     │ new 调用     │');
console.log('│ 类型识别    │ ❌ 不能      │ ✅ 可以      │');
console.log('│ 自定义原型  │ ❌ 没有      │ ✅ 有         │');
console.log('│ 方法共享    │ ❌ 困难      │ ✅ 简单      │');
console.log('│ 代码优雅性  │ ⭐⭐         │ ⭐⭐⭐⭐    │');
console.log('└─────────────┴──────────────┴──────────────┘');

console.log('\n核心差异：');
console.log('');
console.log('工厂模式：');
console.log('  function createPerson(name) {');
console.log('      const obj = {};  // 手动创建普通对象');
console.log('      obj.name = name;');
console.log('      return obj;      // 手动返回');
console.log('  }');
console.log('  const p = createPerson("Lucy");  // 普通调用');
console.log('  → obj.__proto__ = Object.prototype（没有自定义原型链）');
console.log('');

console.log('构造函数：');
console.log('  function Person(name) {');
console.log('      this.name = name;  // new自动创建对象并绑定this');
console.log('      // new自动返回');
console.log('  }');
console.log('  const p = new Person("Lucy");  // new调用');
console.log('  → p.__proto__ = Person.prototype（有自定义原型链）✅');
console.log('');

console.log('🎯 关键点：');
console.log('  • 工厂模式：也能批量创建，但缺少原型链和类型识别');
console.log('  • 构造函数：不仅能批量创建，还有原型链和类型识别');
console.log('  • new的价值：自动设置原型链到Constructor.prototype');
console.log('');

console.log('💡 为什么需要构造函数？');
console.log('  • 工厂模式能做的：批量创建对象');
console.log('  • 工厂模式做不了的：类型识别、方法共享（通过原型）');
console.log('  • 构造函数的价值：解决工厂模式的这些问题！');
