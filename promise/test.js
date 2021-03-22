function MyPromise(executer) {
  this.value = undefined;
  this.reason = undefined;
  this.state = 'PENDING';
  this.onResolveCbs = [];
  this.onRejectedCbs = [];
  const self = this;
  function resolve(value) {
    if (self.state === 'PENDING') {
      setTimeout(() => {
        self.state = 'RESOLVED';
        self.value = value;
        while (self.onResolveCbs.length > 0) {
          const fn = self.onResolveCbs.shift();
          fn(self.value);
        }
      }, 0);
    }
  }
  function reject(err) {
    if (self.state === 'PENDING') {
      setTimeout(() => {
        self.state = 'REJECTED';
        self.reason = err;
        while (self.onRejectedCbs.length > 0) {
          const fn = self.onRejectedCbs.shift();
          fn(self.reason);
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

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(new TypeError());
  }
  if (x instanceof MyPromise) {
    if (x.state === 'PENDING') {
      x.then(function (y) {
        resolvePromise(promise, y, resolve, reject);
      }, reject);
    } else {
      x.then(resolve, reject);
    }
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
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

MyPromise.prototype.then = function (onResolved, onRejected) {
  onResolved = typeof onResolved === 'function' ? onResolved : (v) => v;
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : (err) => {
          throw err;
        };

  const self = this;
  if (this.state === 'RESOLVED') {
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
  }
  if (this.state === 'REJECTED') {
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
  }
  if (this.state === 'PENDING') {
    const p2 = new MyPromise((resolve, reject) => {
      this.onResolveCbs.push((value) => {
        try {
          resolvePromise(p2, onResolved(value), resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
      this.onRejectedCbs.push((reason) => {
        try {
          resolvePromise(p2, onRejected(reason), resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    });
    return p2;
  }
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
