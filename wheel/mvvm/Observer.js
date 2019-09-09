import Dep from './Dep'
import { arrayMethods } from './array'
import { isObject } from 'util';
const hasProto = '__proto__' in {}
const arrayKeys  = Object.getOwnPropertyNames(arrayMethods)
export default class Observer {
  constructor(value) {
    this.value = value
    this.dep = new Dep()
    if (Array.isArray(value)) {
      Object.setPrototypeOf(value, arrayMethods)
    } else {
      this.walk(value)
    }
  }
  /**
   * walk 会将每一个属性都转成getter、setter的形式
   * 只在对象数据为object时候调用
   * @param {*} obj 
   */
  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      definReactive(obj, keys[i], obj[keys[i]])
    } 
  }
}


function definReactive(obj, key, val) {
  let childOb = observe(val)
  let dep = new Dep() // 用来收集数组的依赖
  Object.defineProperty(obj,key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      dep.depend()
      if(childOb) {
        childOb.dep.depend
      }
      return val
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return
      val = newVal
      dep.notify()
    }
  })
}
/**
 * 
 * @param {*} value 
 * @param {*} asRootData 
 * 创建一个Observer实例
 * 如果value已经有Observer，直接返回他
 */
export function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}

function def (obj,key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
