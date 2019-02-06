function cd(val) {
  console.log('视图更新')
}

// 实现对对象的「响应式」
function definRective(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      return val
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      cd(newVal)
    }
  })
}

function observer(value) {
  if (!value || (typeof value !== 'object')) {
    return;
  }
  Object.keys(value).forEach(key => {
    definRective(value, key, value[key])
  })
}

class Vue {
  constructor(options) {
    this._data = options.data
    observer(this._data)
  }
}

let o = new Vue({
  data: {
    test: 'i am test'
  }
})
o._data.test = "hello world"

