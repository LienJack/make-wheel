
class AuthChain {
    constructor () {
        this.arr = []
        this.params = []
        this.index = -1
        this.context = {}
        this.res = true
    }
    next(i) {
        this.index = i
        if (i === this.arr.length) return this.res
        let fn = this.arr[i]
        let param = this.params[i]
        fn(this.context, this.next.bind(this, i + 1), this.end.bind(this),param)
    }
    end(res) {
        this.res = res
        return res
    }
    result() {
        this.next(0)
        return this.res
    }
    isAdmin() {
        this.arr.push(isAdmin)
        this.params.push(undefined)
        return this
    }
    isRandom() {
        this.arr.push(isRandom)
        this.params.push(undefined)
        return this
    }
    or(...fns) {
        this.arr.push(or)
        this.params.push(fns)
        return this
    }

}
function or (context, next, end, fns) {
    const nexArr = []
    const endArr = []
    function _next () {
        nexArr.push(true)
    }
    function _end (i) {
        endArr.push(i)
    }
    fns.forEach((fn) => fn(context,_next,_end))
    if (nexArr.some(i => i) || endArr.some(i => i)) {
        next()
        return
    }
    end(false)
}

function isAdmin(context, next, end) {
    next()
}
function isRandom(contex, next, end) {
    if (Math.random() > 0.5) {
        next()
    } else {
        end(false)
    }
}


const auth = new AuthChain()
const res = auth.isAdmin().isRandom().result()
console.log(res)

