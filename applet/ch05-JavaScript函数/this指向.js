// // 全局上下文
// // 第一步：判断运行环境，获取正确的全局对象（兼容浏览器/Node.js）
// const globalObj = typeof window !== 'undefined' ? window : globalThis;

// // 第二步：替换 window 为兼容的全局对象
// console.log(this === globalObj); // 浏览器：true；Node.js：false（原因见下文）

// // 第三步：全局变量赋值的兼容写法
// globalObj.a = 37;
// console.log(globalObj.a); // 浏览器/Node.js 都输出 37

// // 补充：Node.js 全局作用域的 this 指向说明
// console.log('Node.js 全局 this 指向：', this); // 输出 {}（module.exports）
// console.log('Node.js 全局对象：', globalThis); // 输出 Node.js 的全局对象



// 函数上下文

// 严格模式下： this指向 undefined
function f2() {
    "use strict";
    return this;
}

f2() === undefined; //true

// call方法：this指向传入的指定对象o
function add(c, d) {
    return this.a + this.b + c + d;
}
var o = {a:1, b:3}
add.call(o, 5, 7); // 16

