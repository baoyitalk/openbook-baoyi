// 场景： 依次获取3个接口


// Promise版 依次获取3个接口

function getUser() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({id:1, name: '张三'}) // 处理处境成功回传给回调函数
        }, 1000);
    })
}

function getOrders(userId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(['订单1', '订单2']) // 模拟成功拿到数据调用回调函数将数据回传给回调函数
        }, 1000);
    })
}

function getDetail(orderId) {
    return new Promise(resolve => {
        setTimeout(() => {
           resolve({price: 100})  
        }, 1000);
    })
}

// 使用 -链式调用
// 使用主函数传 then后面回调函数
getUser()
  .then(user => {
    console.log(user)
    return getOrders(user.id)
  })
  .then(orders => {
    console.log(orders)
    return getDetail(orders[0])
  })
  .then(detail => {
    console.log(detail)
  })



