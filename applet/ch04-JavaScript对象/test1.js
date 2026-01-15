// js对象

// // Object构造函数创建对象

// let person = new Object();

// // 添加属性
// person.name = "Lucy";

// // 添加方法
// person.sayName = function() {
//     person.sayName = function() {
//         console.log(this.name)
//     }
// }


// // 对象字面量

// // 对象字面量创建新对象更为简单直接

// let person = {
//    name: 'lucy',
//    sayName() { // 直接放函数表达式
//     console.log(this.name)
//    }
// }


// // Object.create()创建新对象


// let person = {
//    name: 'lucy',
//    sayName() { // 直接放函数表达式
//     console.log(this.name)
//    }
// }

// let person1 = Object.create(person);
// console.log(person1.name); // 'lucy'


// create方法底层实现

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