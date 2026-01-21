// // Map是内置的构造函数
// // 创建
// const users = new Map()

// // String作为key
// users.set('John', {address: "John's address"});
// // console.log(users.get("John"))

// //Object作为key
// const obj = {name: "Michael"}
// users.set(obj, {address: "Michael's address"})
// // console.log(users.get(obj))

// // Function作为key
// const func = () => "Andrew"
// users.set(func, {address: "Andrew's address"})

// // NaN作为key
// users.set(NaN, {address:"NaN's Address"})
// console.log(users)

const contacts = new Map()
contacts.set('Jessie', {phone: "12312313", address: "beijing"})

contacts.has("Jessie"); // true
contacts.get("Hilary");// undefined
contacts.delete("Raymond"); //false
console.log(contacts.size);// 1