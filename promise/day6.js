const PENDING = 1;
const RESOLVED = 2;
const REJECTED = 3;

class MyPromise {
  constructor(executor) {
    this._value = undefined;
    this._state = PENDING;
    this._reason = undefined;
    this.onResolveCbs = [];
    this.onRejectCbs = [];
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }
  _resolve(value) {
    if (this._state === PENDING) {
      setTimeout(() => {
        this._value = value;
        this._state = RESOLVED;
        while (this.onResolveCbs.length) {
          const fn = this.onResolveCbs.shift();
          fn(value);
        }
      }, 0);
    }
  }
  _reject(err) {
    if (this._state === PENDING) {
      setTimeout(() => {
        this._reason = err;
        this._state = REJECTED;
        while (this.onRejectCbs.length) {
          const fn = this.onRejectCbs.shift();
          fn(err);
        }
      }, 0);
    }
  }
  then(onResolve, onReject) {
    onResolve = typeof onResolve === 'function' ? onResolve : (v) => v;
    onReject =
      typeof onReject === 'function'
        ? onReject
        : (err) => {
            throw err;
          };

    if (this._state === RESOLVED) {
      const p2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            MyPromise._resolvePromise(
              p2,
              onResolve(this._value),
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
    if (this._state === REJECTED) {
      const p2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            MyPromise._resolvePromise(
              p2,
              onReject(this._reason),
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
    if (this._state === PENDING) {
      const p2 = new MyPromise((resolve, reject) => {
        this.onResolveCbs.push((value) => {
          try {
            MyPromise._resolvePromise(p2, onResolve(value), resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
        this.onRejectCbs.push((err) => {
          try {
            MyPromise._resolvePromise(p2, onReject(err), resolve, reject);
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
      return reject(new TypeError(''));
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
