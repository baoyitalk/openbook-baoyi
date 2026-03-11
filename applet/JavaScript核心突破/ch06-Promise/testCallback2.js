// 带错误处理的回调

// 定义主函数 回调函数作为主函数的参数
function fetchUser(userId, callback) {
    // 依然用延时机制模拟获取网络数据
    setTimeout(() => {
        if (userId <= 0) {
            callback(new Error('无效ID'), null) // 第一个参数是错误
        } else {
            callback(null, {id: userId, name: '张三'})
        }
    }, 2000);
}
// used--
fetchUser(123, (err, user) => {
    if (err) {
        console.log('出错了：', err.message)
        return
    }
    console.log('success:', user)
})