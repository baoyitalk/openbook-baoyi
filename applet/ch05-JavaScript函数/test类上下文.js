// class Car {
//   constructor() {
//     // 使用 bind() 方法改变 this 指向
//     this.sayBye = this.sayBye.bind(this);
//   }

//   sayHi() {
//     console.log(`Hello from ${this.name}`);
//   }

//   sayBye() {
//     console.log(`Bye from ${this.name}`);
//   }

//   get name() {
//     return 'Ferrari';
//   }
// }

// class Bird {
//   get name() {
//     return 'Tweety';
//   }
// }

// const car = new Car();
// const bird = new Bird();

// // this 指向调用者
// car.sayHi(); // Hello from Ferrari
// bird.sayHi = car.sayHi;
// bird.sayHi(); // Hello from Tweety

// // bind() 方法改变了 this 指向, this 指向类 Car





// // 箭头函数

// var window = this
// var foo = (() => this);
// console.log(foo() === window);// true



// 原型链中的this

var o = {
  f: function() {
    return this.a + this.b;
  }
};
var p = Object.create(o);
p.a = 1;
p.b = 4;

console.log(p.f()); // 5
