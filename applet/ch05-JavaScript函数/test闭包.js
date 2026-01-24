// // 闭包
// function person() {
//     var name = "John";
//     function showName() {
//         console.log(name); // ’John‘
//     }
//     return showName;
// }
// const getPerson = person();
// getPerson();


// // 缓存

// function memoize(fn) {
//     const cache = {}

//     return function(n) {
//         if(cache[n] !== undefined) {
//             console.log('从缓存中取')
//             return cache[n];
//         }
//         console.log('计算中...');
//         cache[n] = fn(n);
//         return cache[n]
//     }
// }
// const factorial = memoize(function(n) {
//     return n <= 1 ? 1 : n * factorial(n-1);
// })
// factorial(5); // 计算中... 120
// factorial(5); // 从缓存取 120


// // 防抖节流
// function debounce(fn, delay) {
//     let timer = null;  // 闭包保存 timer
    
//     return function(...args) {
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//             fn.apply(this, args);
//         }, delay);
//     };
// }

// // 使用
// const search = debounce(function(keyword) {
//     console.log('搜索:', keyword);
// }, 500);

// // 快速输入，只执行最后一次
// search('a');
// search('ab');
// search('abc');  // 只有这个会执行



// 闭包模拟私有方法

let Counter = (function() {
  let privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  };
})();

console.log(Counter.value()); // 0
Counter.increment();
Counter.increment();
console.log(Counter.value()); // 2
Counter.decrement();
console.log(Counter.value()); // 1