const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';
class MyPromise {
  constructor(executor) {
    this._value = undefined;
    this._status = PENDING;
    this._reason = undefined;
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
        this._value = value;
        this._status = FULFILLED;

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
        this._reason = reason;
        this._status = REJECTED;
        while (this._onRejectedCbs.length) {
          const fn = this._onRejectedCbs.shift();
          fn(this._reason);
        }
      }, 0);
    }
  }
  static _resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
      return reject(new TypeError());
    }
    if (x instanceof MyPromise) {
      if (x._status === PENDING) {
        x.then(function (y) {
          MyPromise._resolvePromise(promise, y, resolve, reject);
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
        let then = x.then;
        if (typeof then === 'function') {
          then.call(
            x,
            function (y) {
              if (called) return;
              called = true;
              MyPromise._resolvePromise(promise, y, resolve, reject);
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
        return reject(error);
      }
    } else {
      resolve(x);
    }
  }
  then(onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : (v) => v;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (err) => {
            throw err;
          };
    if (this._status === FULFILLED) {
      const p2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            MyPromise._resolvePromise(
              p2,
              onResolved(this._value),
              resolve,
              reject
            );
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
            MyPromise._resolvePromise(
              p2,
              onRejected(this._reason),
              resolve,
              reject
            );
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
            MyPromise._resolvePromise(p2, onResolved(value), resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
        this._onRejectedCbs.push((error) => {
          try {
            MyPromise._resolvePromise(p2, onRejected(error), resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
      return p2;
    }
  }
}

module.exports = MyPromise;
