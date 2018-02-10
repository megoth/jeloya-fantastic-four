const foo = await (new Promise(resolve => setTimeout(resolve, 2000)).then(console.log));

console.log(foo);