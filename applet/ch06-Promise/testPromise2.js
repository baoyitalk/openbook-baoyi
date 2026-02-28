// 场景： 依次获取3个接口


// Promise版 依次获取3个接口

function getUser() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({id:1, name: '张三'})
        }, 1000);
    })
}



