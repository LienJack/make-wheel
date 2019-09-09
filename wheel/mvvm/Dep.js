export default class Dep {
  constructor () {
    this.subs = []
  }
  depend () {
    if (window.target) {
      this.addSub(window.target)
    }
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  removeSub(sub) {
    if (this.subs.length) {
      const index = arr.indexOf(sub)
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }
  notify() {
    this.subs.forEach((sub)=> {
      sub.update()
    })
  }
}

