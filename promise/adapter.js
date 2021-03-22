const MyPromise = require('./day5');
module.exports = {
  resolved: function (value) {
    return new MyPromise(function (resolve) {
      resolve(value);
    });
  },
  rejected: function (reason) {
    return new MyPromise(function (resolve, reject) {
      reject(reason);
    });
  },
  deferred: function () {
    var resolve, reject;

    return {
      promise: new MyPromise(function (rslv, rjct) {
        resolve = rslv;
        reject = rjct;
      }),
      resolve: resolve,
      reject: reject,
    };
  },
};
