// async基础实现
async function f() {
    return 1;
}

f().then((v) => console.log(v));
console.log('f', f())
