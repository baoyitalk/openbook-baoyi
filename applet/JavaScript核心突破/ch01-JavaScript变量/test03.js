/**
 * 
 * 变量提升
 */


// 函数声明：编译阶段就能确定函数体，直接可用

// -----测试1-------
// 函数声明的为什么在编译阶段就是完整的声明+赋值
// fn(); // 能执行，因为函数体是静态的
// function fn() { console.log(a); }

// var变量：赋值依赖运行时，编译阶段无法确定值
// console.log(a); // 只能是undefined，因为编译阶段不知道b的值
// var b = 5;
// var a = 10 + b;

//----------------




// ----测试2----

// 同名变量和函数提升

let x = 20,
    y = 10;


let result = add(x);
console.log('result1:' + result); 



function add(a) { // 函数声明 编译阶段就是完整的声明+赋值
    return a + 40
}

function add(b) { // 后面的会覆盖前面的， 函数声明的优先级更高
    return b + 30
}

var add = function(a, b) { // 编译阶段var 声明 提升了声明 但不会提升赋值 
    return a + b
}



