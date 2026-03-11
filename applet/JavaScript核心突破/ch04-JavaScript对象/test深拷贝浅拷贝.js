/**
 * 深拷贝 浅拷贝
 */

// // 浅拷贝 

// //  简单赋值-业界有争议严格说就不是拷贝没有产生新对象
// // 复杂嵌套对象用 赋值运算符 会造成只复制第一层 但是也产生了新对象，被copy的对象也受影响了

// // 案例1- 简单赋值
// // 直接通过变量名赋值
// let obj1 = { name: "张三" };
// let obj2 = obj1;  // 这不是拷贝！

// // 案例2-扩展运算符赋值
// let obj3 = { name: "张三" };
// let obj4= { ...obj3 };  // 浅拷贝





// //案例3-赋值嵌套对象  要赋值的对象 既有原始值 又有引用值
// // 经典浅拷贝
// let original = { a: 1, b: { c: 2 } };
// let shallow = { ...original };  // 浅拷贝

// // 测试 a（独立）
// shallow.a = 100;
// console.log(original.a);  // 1  ← 没变！独立的

// // 测试 b.c（共享）
// shallow.b.c = 999;
// console.log(original.b.c);  // 999  ← 变了！共享的


// 自定义函数实现深拷贝
// 处理对象和数组

// const deepCopy = (obj) => {
//     // 如果不是对象或者为null，直接返回 逻辑或找真值
//     if (typeof obj !== "object" || obj === null ) {
//         return obj
//     }
//     // 创建一个新对象或数组
//     const newObj = Array.isArray(obj) ? [] : {}

//     Object.keys(obj).forEach((key) => {
//         newObj[key] = deepCopy(obj[key])
//     });
//     return newObj;
// };

// // 测试对象和数组的深拷贝
// const nestedArray = [[1], [2], [3]]
// const nestArrayCopy = deepCopy(nestedArray); // 深拷贝
// console.log(nestedArray === nestArrayCopy); // false

// // 修改原对象
// nestedArray[0][0] = 4; // [[4], [2], [3]]
// console.log(nestArrayCopy); // 使用深拷贝后副本对象完全独立 不受影响[[1], [2], [3]]


/** 
 * 处理循环引用
 * 
 */


// const deepCopy = (obj, cache = new WeakMap()) => {
//   // 如果不是对象或者为 null，直接返回
//   if (typeof obj !== "object" || obj === null) {
//     return obj;
//   }

//   // 如果已经复制过该对象，则直接返回
//   if (cache.has(obj)) {
//     return cache.get(obj);
//   }

//   // 创建一个新对象或数组
//   const newObj = Array.isArray(obj) ? [] : {};

//   // 将新对象放入 cache 中
//   cache.set(obj, newObj);

//   // 处理循环引用的情况
//   Object.keys(obj).forEach((key) => {
//     newObj[key] = deepCopy(obj[key], cache);
//   });

//   return newObj;
// };

// const nestedObject = {
//   name: 'lucy'
// };
// // 制造循环引用（对象自身引用自身）
// nestedObject.nestedObject = nestedObject;

// // ==================== 完善的测试部分 ====================
// // 测试1：验证「循环引用对象」的深拷贝（原示例补充执行）
// console.log("===== 测试1：循环引用对象深拷贝 =====");
// // 执行深拷贝
// const clonedNestedObj = deepCopy(nestedObject);

// // 验证结果
// console.log("原对象：", nestedObject);
// console.log("拷贝后的对象：", clonedNestedObj);
// // 核心验证：拷贝后的对象和原对象引用不同，但内容一致，且不报错（解决循环引用）
// console.log("拷贝对象与原对象是否为同一引用？", clonedNestedObj === nestedObject); // 预期：false
// console.log("拷贝对象的循环引用属性是否有效？", clonedNestedObj.nestedObject === clonedNestedObj); // 预期：true（自身引用自身）




/**
 * 
 * 处理特殊对象 Date 和 RegExp
 * 
 */

// ==================== 测试代码 ====================
console.log("===== 测试1：循环引用对象深拷贝 =====");
// 制造循环引用的对象
const loopObj = {
  name: "张三",
  age: 25
};
loopObj.self = loopObj; // 自身引用，形成循环

const clonedLoopObj = deepCopy(loopObj);
// 验证：拷贝后引用独立，且循环引用不报错
console.log("原对象与拷贝对象是否为同一引用？", clonedLoopObj === loopObj); // 预期：false
console.log("拷贝对象的循环引用是否有效？", clonedLoopObj.self === clonedLoopObj); // 预期：true

console.log("\n===== 测试2：Date对象深拷贝 =====");
const originalDate = new Date("2026-01-01");
const clonedDate = deepCopy(originalDate);
// 验证：Date类型保留，且引用独立
console.log("拷贝后是否为Date实例？", clonedDate instanceof Date); // 预期：true
console.log("原Date与拷贝Date值是否相同？", originalDate.getTime() === clonedDate.getTime()); // 预期：true
console.log("原Date与拷贝Date是否为同一引用？", originalDate === clonedDate); // 预期：false

console.log("\n===== 测试3：RegExp对象深拷贝 =====");
const originalReg = /javascript/gi; // 带修饰符g（全局）、i（忽略大小写）
const clonedReg = deepCopy(originalReg);
// 验证：正则source和flags都保留，引用独立
console.log("拷贝后正则source是否一致？", clonedReg.source === originalReg.source); // 预期：true
console.log("拷贝后正则flags是否一致？", clonedReg.flags === originalReg.flags); // 预期：true
console.log("原正则与拷贝正则是否为同一引用？", originalReg === clonedReg); // 预期：false

console.log("\n===== 测试4：嵌套对象/数组深拷贝 =====");
const originalData = {
  user: "李四",
  birthday: new Date("1990-05-10"),
  hobby: ["读书", /^book\d+$/g, { level: "资深" }], // 嵌套数组+正则+对象
  score: null // 测试null值
};
const clonedData = deepCopy(originalData);

// 修改拷贝对象的嵌套属性，验证不影响原对象
clonedData.hobby[0] = "运动";
clonedData.hobby[2].level = "入门";
clonedData.birthday.setFullYear(2000);

// 验证原对象属性未被修改
console.log("原对象hobby[0]是否未变？", originalData.hobby[0] === "读书"); // 预期：true
console.log("原对象嵌套对象level是否未变？", originalData.hobby[2].level === "资深"); // 预期：true
console.log("原对象Date是否未被修改？", originalData.birthday.getFullYear() === 1990); // 预期：true