window.target = null
import Wather from './Wather'
import Dep from './Dep'
import Observer from './Observer'



class Vue {
  constructor(options) {
    this._data = options.data
    // observer(this._data)
    new Wather()
    new Observer(this._data)
    console.log('render~', this._data.test)
  }
}

let o = new Vue({
  data: {
    test: 'I am test'
  }
})
o._data.test="1111"


