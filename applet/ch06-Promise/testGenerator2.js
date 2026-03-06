// 循环实现.next() 获取具体值

function* generator() {
    console.log("invoked 1st time");
    yield 1;
    console.log("invoked 2nd time");
    yield 2;
}

let gen = generator();
console.log(gen);

// 用 while 循环调用 next()
let result = gen.next();
while (!result.done) {
    console.log("value:", result.value);
    result = gen.next();
}
console.log("最后:", result);

// 输出：
// invoked 1st time
// value: 1
// invoked 2nd time
// value: 2
// 最后: {value: undefined, done: true}