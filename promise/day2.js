const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';
class MyPromise {
  constructor(executor) {
    this._value = undefined;
    this._reason = undefined;
    this._status = PENDING;

    this._onResolvedCbs = [];
    this._onRejectedCbs = [];
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
    }
  }
  _resolve(value) {
    if (this._status === PENDING) {
      setTimeout(() => {
        this._status = FULFILLED;
        this._value = value;
        while (this._onResolvedCbs.length) {
          const fn = this._onResolvedCbs.shift();
          fn(this._value);
        }
      }, 0);
    }
  }
  _reject(reason) {
    if (this._status === PENDING) {
      setTimeout(() => {
        this._status = REJECTED;
        this._reason = reason;
        while (this._onRejectedCbs.length) {
          const fn = this._onRejectedCbs.shift();
          fn(this._reason);
        }
      }, 0);
    }
  }
  then(onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : (v) => v;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (r) => {
            throw r;
          };
    if (this._status === FULFILLED) {
      const p2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onResolved(this._value);
            MyPromise.resolvePromise(p2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      return p2;
    }
    if (this._status === REJECTED) {
      const p2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onRejected(this._reason);
            MyPromise.resolvePromise(p2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      return p2;
    }
    if (this._status === PENDING) {
      const p2 = new MyPromise((resolve, reject) => {
        this._onResolvedCbs.push((value) => {
          try {
            const x = onResolved(value);
            MyPromise.resolvePromise(p2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
        this._onRejectedCbs.push((r) => {
          try {
            const x = onRejected(r);
            MyPromise.resolvePromise(p2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
      return p2;
    }
  }
  static resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
      return reject(new TypeError());
    }
    if (x instanceof MyPromise) {
      if (x._status === PENDING) {
        x.then(function (y) {
          MyPromise.resolvePromise(promise, y, resolve, reject);
        }, reject);
      } else {
        x.then(resolve, reject);
      }
    } else if (
      x !== null &&
      (typeof x === 'function' || typeof x === 'object')
    ) {
      let called = false;
      try {
        const then = x.then;
        if (typeof then === 'function') {
          then.call(
            x,
            function (y) {
              if (called) return;
              called = true;
              MyPromise.resolvePromise(promise, y, resolve, reject);
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
}

module.exports = MyPromise;
