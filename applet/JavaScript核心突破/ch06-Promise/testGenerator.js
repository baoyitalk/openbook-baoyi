// 生成器函数可以暂停 正常js中的函数是不可暂停的

// // for...of获取具体值
// function* generator() {
//     console.log("invoked 1st time"); // 调用第一次执行
//     yield 1; // 输出1暂停
//     console.log("invoked 2nd time"); // 调用第二次执行
//     yield 2; // 输出2暂停
// }
// let gen = generator(); // 调用Generator返回一个迭代器对象
// console.log(gen);

// // for...of 获取具体值 只有gen.next()获取{value, done}对象
// for (const g of gen) {
//      console.log("for...of g", g)
// }

// next()方式获取

function* generator() {
    console.log("invoked 1st time");
    yield 1;
    console.log("invoked 2nd time");
    yield 2;
}

let gen = generator();
console.log(gen);

// next()方式获取
let result1 = gen.next();
console.log("第1次:", result1);  // {value: 1, done: false}

let result2 = gen.next();
console.log("第2次:", result2);  // {value: 2, done: false}

let result3 = gen.next();
console.log("第3次:", result3);  // {value: undefined, done: true}