function myinstanceof(a, b) {
  if (a === null || a === undefined) return false;
  let proto = a.__proto__;
  while (proto) {
    if (proto === b.prototype) return true;
    proto = proto.__proto__;
  }
  return false;
}

console.log(myinstanceof([], Array));
