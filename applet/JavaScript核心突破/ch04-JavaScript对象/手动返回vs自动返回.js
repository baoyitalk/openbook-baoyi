// ========================================
// 手动返回 vs 自动返回
// ========================================

console.log('=== 理解"手动返回"和"自动返回"的区别 ===\n');

// ========================================
// 1. 工厂模式：手动返回
// ========================================

console.log('--- 1. 工厂模式（手动返回）---\n');

function createPerson(name) {
    const o = {};        // 第1步：手动创建对象
    o.name = name;       // 第2步：手动添加属性
    o.sayHi = function() {
        console.log('Hi, I am ' + this.name);
    };
    return o;            // 第3步：必须手动返回 ⚠️
}

const person1 = createPerson('Lucy');
console.log('person1.name:', person1.name);
person1.sayHi();

console.log('\n🔍 关键点：');
console.log('  - 这是普通函数调用（没有 new）');
console.log('  - 必须手动写 return o');
console.log('  - 如果忘记写 return，会返回 undefined\n');

// 验证：忘记return会怎样？
function createPersonBad(name) {
    const o = {};
    o.name = name;
    // 忘记写 return o ❌
}

const badResult = createPersonBad('Tom');
console.log('忘记return的结果:', badResult); // undefined ❌
console.log('');


// ========================================
// 2. 构造函数模式：自动返回
// ========================================

console.log('--- 2. 构造函数模式（自动返回）---\n');

function Person(name) {
    this.name = name;    // 不需要手动创建对象
    this.sayHi = function() {
        console.log('Hi, I am ' + this.name);
    };
    // 不需要写 return ✅
}

const person2 = new Person('Bob');
console.log('person2.name:', person2.name);
person2.sayHi();

console.log('\n🔍 关键点：');
console.log('  - 使用 new 关键字调用');
console.log('  - 不需要手动写 return');
console.log('  - new 会自动返回新创建的对象\n');


// ========================================
// 3. 底层对比：new 帮你做了什么？
// ========================================

console.log('--- 3. new 关键字的魔法 ---\n');

console.log('工厂模式：你要自己做所有事');
console.log('━━━━━━━━━━━━━━━━━━━━');
console.log('function createPerson(name) {');
console.log('    const o = {};           // 👈 手动创建对象');
console.log('    o.name = name;          // 👈 手动添加属性');
console.log('    return o;               // 👈 手动返回对象 ⚠️');
console.log('}');
console.log('const p = createPerson("Lucy"); // 普通调用\n');

console.log('构造函数模式：new 帮你做');
console.log('━━━━━━━━━━━━━━━━━━━━');
console.log('function Person(name) {');
console.log('    this.name = name;       // ✅ new 已经创建了对象，this 指向它');
console.log('    // 不需要 return        // ✅ new 自动返回对象');
console.log('}');
console.log('const p = new Person("Lucy");  // new 调用\n');


// ========================================
// 4. new 在底层做了什么？
// ========================================

console.log('--- 4. new 的底层实现 ---\n');

function myNew(Constructor, ...args) {
    // 步骤1：自动创建空对象（你不需要手动创建）
    const obj = {};
    
    // 步骤2：自动设置原型链
    obj.__proto__ = Constructor.prototype;
    
    // 步骤3：绑定 this 并执行构造函数
    const result = Constructor.apply(obj, args);
    
    // 步骤4：自动返回对象（你不需要手动 return）
    return (typeof result === 'object' && result !== null) ? result : obj;
}

console.log('new 做的4件事：');
console.log('1. 自动创建空对象');
console.log('2. 自动设置原型链');
console.log('3. 执行构造函数（this 指向新对象）');
console.log('4. 自动返回对象 ← 这就是"自动返回"！\n');


// ========================================
// 5. 实际对比运行
// ========================================

console.log('--- 5. 实际对比 ---\n');

// 工厂模式：必须手动return
function factory(name) {
    const obj = {};
    obj.name = name;
    return obj;  // ⚠️ 必须写这一行
}

// 构造函数：不需要return
function Constructor(name) {
    this.name = name;
    // ✅ 不需要 return
}

const f = factory('Factory');
const c = new Constructor('Constructor');

console.log('工厂模式结果:', f);
console.log('构造函数结果:', c);
console.log('');


// ========================================
// 6. 特殊情况：构造函数也可以手动return
// ========================================

console.log('--- 6. 特殊情况：构造函数手动返回对象 ---\n');

function SpecialConstructor(name) {
    this.name = name;
    // 手动返回一个不同的对象
    return { age: 18 };  // ⚠️ 会覆盖默认返回
}

const special = new SpecialConstructor('Lucy');
console.log('special:', special);
console.log('special.name:', special.name);  // undefined（被覆盖了）
console.log('special.age:', special.age);    // 18

console.log('\n📝 注意：');
console.log('  - 构造函数如果手动 return 对象，会覆盖默认行为');
console.log('  - 但通常不应该这样做\n');


// ========================================
// 7. 总结对比
// ========================================

console.log('========================================');
console.log('总结：手动返回 vs 自动返回');
console.log('========================================\n');

console.log('┌─────────────┬────────────────┬────────────────┐');
console.log('│             │   工厂模式     │  构造函数模式  │');
console.log('├─────────────┼────────────────┼────────────────┤');
console.log('│ 调用方式    │ 普通调用       │ new 调用       │');
console.log('│ 创建对象    │ 手动 const o={}│ new 自动创建   │');
console.log('│ 返回对象    │ 必须手动return │ new 自动返回   │');
console.log('│ 代码量      │ 多一行return   │ 少一行         │');
console.log('│ 是否容易忘  │ 容易忘记return │ 不会忘         │');
console.log('└─────────────┴────────────────┴────────────────┘');

console.log('\n✅ 核心区别：');
console.log('');
console.log('工厂模式：');
console.log('  function create(name) {');
console.log('      const o = {};');
console.log('      o.name = name;');
console.log('      return o;        ← 必须手动写这行！');
console.log('  }');
console.log('  const p = create("Lucy");  // 普通调用');
console.log('');
console.log('构造函数模式：');
console.log('  function Person(name) {');
console.log('      this.name = name;');
console.log('      // 不需要 return！new 自动帮你返回');
console.log('  }');
console.log('  const p = new Person("Lucy");  // new 调用');
console.log('');
console.log('🎯 记忆：new = 自动化工厂（自动创建 + 自动返回）');
