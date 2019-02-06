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
      if(value instanceof MyPromise) {
        return value.then(resolve, reject)
      }
      setTimeout(() => {
        if (self.status === PENDING) {
          self.status = RESOLVED
          self.value = value
          self.resolvedCallbacks.map(cd => cd(self.value))
        }
      }, 0);
    }
    // 改变状态为失败并执行回调
    function reject(value) {
      setTimeout(() => {
        if (self.status === PENDING) {
          self.status = REJECTED
          self.value = value
          self.rejectedCallbacks.map(cd => cd(self.value))
        }
      }, 0);
    }
  }
  MyPromise.prototype.then = function (onFulFilled, onRejected) {
    const self = this
    // 透传
    // Promise.resolve(4).then().then((value) => console.log(value))
    onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : r => { throw r }
    let promise2
    if (self.status === PENDING) {
      return promise2 = new MyPromise((resolve, reject) => {
        self.resolvedCallbacks.push(()=>{
          try {
            const x = onFulFilled(self.value)
            // resolutionProcedure(promise2, x, resolve, reject)
          } catch(r) {
            reject(r)
          }
        })
      })
      self.rejectedCallbacks.push(()=> {
        try {
          const x = onRejected(self.value)
          // resolutionProcedure(promise2, x, reslove, reject)
        } catch (r) {
          reject(r)
        }
      })
    }

    if (self.status === RESOLVED) {
      return (promise2 = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onFulFilled(self.value)
            // resolutionProcedure(promise2, x, resolve, reject)
          } catch (error) {
            reject(reason)
          }
        },0);
      }))
    }
    if (self.status === REJECTED) {
      return(promise2 = new MyPromise((resovle, reject) => {
        setTimeout(() => {
          try {
            const x = onRejected(self.value)
            // resolutionProcedure(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0);
      }))
    }
    // 做promise兼容
    function resolutionProcedure(promise2, x, resolve, reject) {
      if(promise2 === x) {
        return reject(new TypeError('Error'))
      }
      let p = new MyPromise((resolve, reject) => {
        resolve(1)
      })
      let p1 = p.then(value => {
        return p1
      })
      if (x instanceof MyPromise) {
        x.then(function (value) {
          resolutionProcedure(promise2, value, resolve, reject)
        }, reject)
      }
      let called = false
      if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
          let then = x.then
          if (typeof then === 'function') {
            then.call(
              x,
              y => {
                if (called) return
                called = true
                resolutionProcedure(promise2, y, resolve, reject)
              },
              e => {
                if (called) return
                called = true
                reject(e)
              }
            )
          } else {
            resolve(x)
          }
        } catch (e) {
          if (called) return
          called = true
          reject(e)
        }
      } else {
        resolve(x)
      }
    }
  }
}
let mypromsie = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 0);
})
mypromsie.then(value => {
  console.log(value)
})