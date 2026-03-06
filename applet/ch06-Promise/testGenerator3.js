// yield*

const arr = ['a', 'b', 'c']

function* generator() {
    yield 1;
    yield* arr;
    yield 2;
}

for (const value of generator()) {
    console.log(value)
}