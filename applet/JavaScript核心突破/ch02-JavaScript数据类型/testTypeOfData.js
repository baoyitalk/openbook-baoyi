// 原始数据类型与引用数据类型

let person = {
  name: "John",
  age: 25
}

function increaseAge(obj) {
  obj.age += 1;
  obj = {name: "Jame", age: 22};
  console.log(obj); // 1
}

increaseAge(person);
console.log(person); // 2