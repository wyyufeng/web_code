const PENDING = 0;
const RESOLVED = 1;
const REJECTED = 2;

class MyPromise {
  constructor(executor) {
    this._value = undefined;
    this._reason = undefined;
    this._state = PENDING;
    this.onResolvedCbs = [];
    this.onRejectedCbs = [];
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }
  resolve(value) {
    if (this._state === PENDING) {
      setTimeout(() => {
        this._state = RESOLVED;
        this._value = value;
        while (this.onResolvedCbs.length) {
          const fn = this.onResolvedCbs.shift();
          fn(this._value);
        }
      }, 0);
    }
  }

  reject(r) {
    if (this._state === PENDING) {
      setTimeout(() => {
        this._state = REJECTED;
        this._reason = r;
        while (this.onRejectedCbs.length) {
          const fn = this.onRejectedCbs.shift();
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
    if (this._state === RESOLVED) {
      const p2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onResolved(this._value);
            MyPromise._resolvePromise(p2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      return p2;
    }
    if (this._state === REJECTED) {
      const p2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onRejected(this._reason);
            MyPromise._resolvePromise(p2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      return p2;
    }
    if (this._state === PENDING) {
      const p2 = new MyPromise((resolve, reject) => {
        this.onResolvedCbs.push((value) => {
          try {
            const x = onResolved(value);
            MyPromise._resolvePromise(p2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
        this.onRejectedCbs.push((r) => {
          try {
            const x = onRejected(r);
            MyPromise._resolvePromise(p2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
      return p2;
    }
  }
  static _resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
      return reject(new TypeError());
    }
    if (x instanceof MyPromise) {
      if (x._state === PENDING) {
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
        const then = x.then;
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
        reject(error);
      }
    } else {
      resolve(x);
    }
  }
}

module.exports = MyPromise;
