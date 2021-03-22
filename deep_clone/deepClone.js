const deepClone = function (obj) {
  if (obj === null) return null;
  if (deepClone._type(obj) === '[object Function]') {
    return obj;
  }
  const clone = Object.assign({}, obj);
  if (deepClone._wm.has(obj)) {
    return deepClone._wm.get(obj);
  }
  deepClone._wm.set(obj, clone);
  Object.keys(clone).forEach((key) => {
    clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
  });
  if (Array.isArray(obj)) {
    // 妙
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
};
deepClone._wm = new WeakMap();
deepClone._type = (arg) => Object.prototype.toString.call(arg);

const target2 = {
  field1: 1,
  field2: undefined,
  field3: {
    child: 'child',
  },
  field4: [2, 4, 8],
  field5: null,
  field6: function test() {
    console.log('test');
  },
};
target2.target2 = target2;
console.log(deepClone(target2));
