const MyPromise = require('./promise');

try {
  var p1 = MyPromise.resolve(3);
  var p2 = 1337;
  var p3 = new MyPromise((resolve, reject) => {
    setTimeout(resolve, 100, 'foo');
  });

  MyPromise.all([p1, p2, p3]).then((values) => {
    console.log(values); // [3, 1337, "foo"]
  });
} catch (error) {
  console.log(error);
}
