export default class Wather {
  constructor (vm, expOrnFn, cd) {
    window.target = this
    // 之后使用
    // this.vm = vm
    // this.getter = paresePath(expOrnFn) // 读取 data.a.b.c的内容，此时是路径解析完，返回获取值的函数
    // this.cb = cb
    // this.value = this.get() // 这时候才是获取值,作为缓存旧数据
    this.get()
  }
  get () {
    window.target = this
    // 之后使用
    //geeter为读取读取 data.a.b.c的内容，顺便触发setter
    // let value = this.getter.call(this.vm, this.vm) 
    // window.target = undefined
    // return value
  }
  update () {
    console.log("视图刷新了")
    // const oldValue = this.value
    this.value = this.get() // 获取新数据
    // this.cb.call(this.vm, this.value, oldValue)
    
  }
}

// 路径配置
const bailRE = /[^\w.$]/
function paresePath (path) {
  // 路径解析
  if (bailRE.test(path)) return
  const segments = path.split('.')
  // 读取内容
  return function (obj) {
    for(let i = 0; i < segments.length; i++) {
      if(!obj)return
      obj = obj[segments[i]]
    }
    return obj
  }
}
