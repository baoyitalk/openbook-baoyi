// 场景： 依次获取3个接口


// 回调函数方式实现 依次获取3个接口

function getUser(callback) { // 主函数getUser
  setTimeout(() => callback({id:1, name: '张三'}), 1000)
}
function getOrders(userId, callback) { // 主函数getOrders
    setTimeout(() => {
        callback(['订单1', '订单2'])
    }, 1000);
}
function getDetail(orderId, callback) {
    setTimeout(() => {
        callback({price: 100})
    }, 1000);
}


// 使用： 嵌套地狱
getUser((user) => { // 注意 user这个参数是在主函数回传的 这就是控制反转了 
    console.log(user)
    getOrders(user.id, (orders) => { // 为了演示暂时不用非空校验了
      console.log(orders)
      getDetail(orders[0], (detail) => {
        console.log(detail)
      })
    })
})
