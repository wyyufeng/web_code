const PENDING = 'pending';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

function MyPromise(executer) {
  this.value = undefined;
  this.reason = undefined;
  this.state = PENDING;
  this.resolveCallbacks = [];
  this.rejectCallbacks = [];
  const self = this;
  function resolve(value) {
    if (self.state === PENDING) {
      setTimeout(() => {
        self.state = FULFILLED;
        self.value = value;
        while (self.resolveCallbacks.length) {
          const fn = self.resolveCallbacks.shift();
          fn.call(self, self.value);
        }
      }, 0);
    }
  }
  function reject(reason) {
    if (self.state === PENDING) {
      setTimeout(() => {
        self.state = REJECTED;
        self.reason = reason;
        while (self.rejectCallbacks.length) {
          const fn = self.rejectCallbacks.shift();
          fn.call(self, self.reason);
        }
      }, 0);
    }
  }

  try {
    executer(resolve, reject);
  } catch (error) {
    reject(error);
  }
}
MyPromise.prototype.then = function (onResolved, onRejected) {
  onResolved = typeof onResolved === 'function' ? onResolved : (value) => value;
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : (r) => {
          throw r;
        };
  const self = this;
  if (this.state === FULFILLED) {
    const p2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const x = onResolved(self.value);
          resolvePromise(p2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
    return p2;
  } else if (this.state === REJECTED) {
    const p2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          const x = onRejected(self.reason);
          resolvePromise(p2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
    return p2;
  } else if (this.state === PENDING) {
    const p2 = new MyPromise((resolve, reject) => {
      this.resolveCallbacks.push((value) => {
        try {
          resolvePromise(p2, onResolved(value), resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
      this.rejectCallbacks.push((r) => {
        try {
          resolvePromise(p2, onRejected(r), resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    });
    return p2;
  }
};

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(new TypeError());
  }
  if (x instanceof MyPromise) {
    if (x.state === PENDING) {
      x.then(function (y) {
        resolvePromise(promise, y, resolve, reject);
      }, reject);
    } else {
      x.then(resolve, reject);
    }
  } else if (x !== null && (typeof x === 'function' || typeof x === 'object')) {
    let called = false;
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          function (y) {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          function (r) {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        if (called) return;
        called = true;
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}
MyPromise.resolve = function (value) {
  const then = value.then;
  if (typeof then === 'function') {
    return value;
  }
  return new MyPromise((resolve, reject) => {
    resolve(value);
  });
};
MyPromise.reject = function (reason) {
  return new MyPromise((_, reject) => {
    reject(reason);
  });
};
MyPromise.allSettled = function (promiseIta) {};
MyPromise.all = function (promiseIta) {
  if (!promiseIta[Symbol.iterator]) {
    return new Promise((resolve, reject) => {
      reject(new TypeError('not a iterable'));
    });
  }
  if (promiseIta.length === 0) {
    return new MyPromise((resolve) => {
      resolve([]);
    });
  }
  return new MyPromise((resolve, reject) => {
    const result = [];
    let count = 0;
    for (let i = 0; i < promiseIta.length; i++) {
      const p = promiseIta[i];
      let then = p.then;
      if (typeof then === 'function') {
        p.then(
          (value) => {
            result[i] = value;
            count++;
            if (count === promiseIta.length) {
              resolve(result);
            }
          },
          (r) => {
            reject(r);
          }
        );
      } else {
        result[i] = p;
        count++;
        if (count === promiseIta.length) {
          resolve(result);
        }
      }
    }
  });
};

module.exports = MyPromise;
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
