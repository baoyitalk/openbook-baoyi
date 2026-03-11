// 错误处理

async function fn() {
  try {
    let res = await new Promise((resolve, reject => {
        throw new Error('test err')
    }))
  } catch (err) {
    console.log(err);
  }
}

fn() // ReferenceError: resolve is not defined
