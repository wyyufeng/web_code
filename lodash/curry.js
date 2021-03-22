function curry(fn) {
  return function curried(...args) {
    if (args.length < fn.length) {
      return (...rest) => curried.apply(this, [...args, ...rest]);
    } else {
      return fn.apply(this, args);
    }
  };
}
function add(a, b, c) {
  return a + b + c;
}
console.log(curry(add)(1)(2)(3));
