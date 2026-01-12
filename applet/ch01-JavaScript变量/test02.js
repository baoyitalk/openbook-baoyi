/**
 * 
 * 作用域
 */

// 经典面试题
// // -----测试1 循环结束后输出什么-----
// for (var i = 0; i < 3; i++) {
//     // setTimeout(() => {
//     //     console.log(i)
//     // }, 100);

//     console.log(i)
// }
// // -----------------------------



// // ---测试2 函数作用域------
// function scope() {
//     var address = "beijing"
// }
// console.log(address); // Uncaught ReferenceError: address is not defined
// // --------------






// ---测试3 块级作用域------
{
    // 作用域A，可以访问变量x
    const x = 0;
    console.log(x); // 0
    {
        // 作用域B，可以访问x、y
        const y = 1;
        console.log(x); // 0
        console.log(y); //1
    }
}
// 作用域A外，不能访问x、y
console.log(x); // 报错： Uncaught ReferenceError: x is not defined
