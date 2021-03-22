function create(obj) {
  const F = new Function();
  F.prototype = obj;
  return new F();
}
