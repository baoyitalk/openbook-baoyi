// await基础实现

// // await必须拿到结果 是 fullfied才往下执行
// async function f() {
//     let promise = new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve("done!")
//         }, 2000)
//     })
//     let result = await promise; //等待，直到Promise resolve（*）
//     console.log(result)

// }

// f();



// ❌ 没有 await - 错误示范
async function f1() {
    let promise = new Promise((resolve) => {
        setTimeout(() => resolve("done!"), 1000)
    })
    let result = promise; // 没写 await
    console.log(result) // 打印什么？
}

f1();
// 立即输出：Promise {<pending>}  ← 拿到的是 Promise 对象，不是结果！