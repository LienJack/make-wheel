{
  const PENDING = 'pending'
  const RESOLVED = 'resolved'
  const REJECTED = 'rejected'

  function MyPromise(fn) {
    const self = this // 保存this
    self.status = PENDING // 状态
    self.value = null // 保存resolve 和rejected传入的值
    self.resolvedCallbacks = [] // 成功回调
    self.rejectedCallbacks = [] // 失败回调
    // 改变状态为成功并执行回调
    function resolve(value) {
      if(self.status === PENDING) {
        self.status = RESOLVED
        self.value = value
        self.resolvedCallbacks.map(cd =>cd(self.value))
      }
    }
    // 改变状态为失败并执行回调
    function reject(value) {
      if (self.status === PENDING) {
        self.status = REJECTED
        self.value = value
        self.rejectedCallbacks.map(cd => cd(self.value))
      }
    }
  }
  MyPromise.prototype.then = function (onFulFilled, onRejected) {
    const self = this
    // 透传
    // Promise.resolve(4).then().then((value) => console.log(value))
    onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : r => { throw r }

    if(self.status === PENDING) {
      self.resolvedCallbacks.push(onFulFilled)
      self.rejectedCallbacks.push(onRejected)
    }

    if(self.status === RESOLVED) {
      onFulFilled(self.value)
    }
    if(self.status === REJECTED) {
      onRejected(self.value)
    }
  }
}

new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 0);
}).then(value => {
  console.log(value)
})