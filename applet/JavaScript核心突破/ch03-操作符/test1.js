// // 逻辑或赋值 ||=的应用

// const a = { count: 50, title: ''};

// a.count ||= 10

// console.log(a.count); // 50

// a.title ||= 'title is empty'
// console.log(a.title); // 'title is empty'


// // 逻辑与赋值运算符 &&= 的应用


// const a = { count: 50, title: ''};

// a.count &&= 10

// console.log(a.count); // 10

// a.title &&= 'title is empty' // a.title是空属于 假值 不赋值
// console.log(a.title); // 打印‘’


// 逻辑空赋值运算符 ??=的应用

const a = { count: 50, title: ''};

a.count ??= 10

console.log(a.count); // 50

a.title ??= 'title is empty' // a.title是空属于 假值 但不符合 特殊假值 null、undefined 不赋值
console.log(a.title); // 打印‘’
