
## 内置构造函数
自定义构造函数：function Person() {}
内置构造函数：Map, Array, Date, Set, Promise...

本质都一样：用 new 创建对象的函数



## Map创建和设置对象属性


### 案例1

```js
// Map是内置的构造函数

// 创建

const users = new Map()
// String作为key

users.set('John', {address: "John's address"});

// console.log(users.get("John"))

  

//Object作为key

const obj = {name: "Michael"}

users.set(obj, {address: "Michael's address"})

// console.log(users.get(obj))

  

// Function作为key

const func = () => "Andrew"

users.set(func, {address: "Andrew's address"})

  

// NaN作为key

users.set(NaN, {address:"NaN's Address"})

console.log(users)
```
打印结果
```
Map(4) {

'John' => { address: "John's address" },

{ name: 'Michael' } => { address: "Michael's address" },

[Function: func] => { address: "Andrew's address" },

NaN => { address: "NaN's Address" }

}
```


案例2

Map构造函数创建实例的方法
```js
const contacts = new Map()
contacts.set('Jessie', {phone: "12312313", address: "beijing"})


contacts.has("Jessie"); // true

contacts.get("Hilary");// undefined

contacts.delete("Raymond"); //false

console.log(contacts.size);// 1

```


## Map 与 Object的区别


Object和Map类似的是， 他们都允许你按键存取一个值 、 删除键、检测一个键是否绑定了值
因此过去我们经常把对象当初Map来用

![](images/5-Map与WeakMap-20260120152706.png)



## WeapMap
WeapMap构造函数创建的对象 是一组键/值对的集合， 其中键是弱引用的。
其键必须是对象而值可以是任意的。



| 特性      | Map   | WeakMap     |
| ------- | ----- | ----------- |
| 键类型     | 任意值   | 只能是对象       |
| 垃圾回收    | 键被强引用 | 键是弱引用，可被 GC |
| 可遍历     | ✅     | ❌           |
| size 属性 | ✅     | ❌           |

**WeakMap 用途：** 存储对象的私有数据，对象销毁时自动清理。

```javascript
// 典型应用：存储 DOM 节点相关数据
const cache = new WeakMap();
function bindData(element, data) {
    cache.set(element, data);  // element 被删除时，data 自动释放
}
```
