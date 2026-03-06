// 防抖
// 定义一个防抖函数 实现触发后n秒后才执行 都与事件触发的执行时机有关
function debounce(cd, delay=250) {
  let timeout;
  return (...args) => {
    // 清除未到延迟时间的定时器
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        // 到延迟时间执行回调函数
       cb(...args);
    }, delay);
  }
}

// 节流

// 如果事件触发在某个时间段内，那么就触发一次， 同样还是事件触发执行时机有关

function throttle(cd, delay = 250) {
    let shouldWait = false;
    return (...args) => {
        // 如果在某个时间段内容应该等待不执行
        if (shouldWait) return
        // 否则执行回调函数
        cb(...args);
        // 修改标识变量
        shouldWait = true;
        setTimeout(() => {
            // 到延迟时间之后重新修改标识变量，确保可以开启新的节流
            shouldWait = false
        }, delay);
    }
}