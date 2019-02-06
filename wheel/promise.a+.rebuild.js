function MyPromise(executor) {
  let self = this;
  self.status = "pending";
  self.value = undefined;
  self.onResolvedCallbacks = [];
  self.onRejectedCallbacks = [];
  function resolve(value) {
    if (value instanceof MyPromise) {
      return value.then(resolve, reject)
    }
    setTimeout(function () { // 异步执行所有的回调函数
      if (self.status == 'pending') {
        self.value = value;
        self.status = 'resolved';
        self.onResolvedCallbacks.forEach(item => item(value));
      }
    });

  }

  function reject(value) {
    setTimeout(function () {
      if (self.status == 'pending') {
        self.value = value;
        self.status = 'rejected';
        self.onRejectedCallbacks.forEach(item => item(value));
      }
    });
  }

  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('循环引用'));
  }
  let then, called;

  if (x != null && ((typeof x == 'object' || typeof x == 'function'))) {
    try {
      then = x.then;
      if (typeof then == 'function') {
        then.call(x, function (y) {
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, function (r) {
          if (called) return;
          called = true;
          reject(r);
        });
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}
Promise.prototype.then = function (onFulfilled, onRejected) {
  let self = this;
  onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : function (value) {
    return value
  };
  onRejected = typeof onRejected == 'function' ? onRejected : function (value) {
    throw value
  };
  let promise2;
  if (self.status == 'resolved') {
    promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          let x = onFulfilled(self.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });

    });
  }
  if (self.status == 'rejected') {
    promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        try {
          let x = onRejected(self.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  if (self.status == 'pending') {
    promise2 = new MyPromise(function (resolve, reject) {
      self.onResolvedCallbacks.push(function (value) {
        try {
          let x = onFulfilled(value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
      self.onRejectedCallbacks.push(function (value) {
        try {
          let x = onRejected(value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  return promise2;
}
MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
}
module.exports = MyPromise;

