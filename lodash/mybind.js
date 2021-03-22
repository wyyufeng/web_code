function mybind() {
  const args = Array.prototype.slice.call(arguments, 1);
  const ctx = arguments[0];
  // 因为bind的调用方式就是  fn.bind  所以bind的this  就是函数本身
  const target = this;
  if (typeof target !== 'function') {
    return TypeError('');
  }
  const boundFn = function () {
    return target.apply(
      // 如果使用 new 实例化  要忽略传递的this值
      // 此时的this会是 boundFn 的实例(new 的过程如此)
      this instanceof boundFn ? this : ctx,
      // 这里要注意可能返回的函数也会有参数
      args.concat(Array.prototype.slice.call(argumenmts))
    );
  };
  // 如果使用new关键词  则新创建的实例和原来的函数原型之间没有关系了 因此需要继承原函数
  // Object.create
  const f = function () {};
  f.prototype = this.prototype;
  boundFn.prototype = new f();

  return boundFn;
}
