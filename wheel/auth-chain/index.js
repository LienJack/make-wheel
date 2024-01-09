
class AuthChain {
    constructor () {
        this.arr = []
        this.index = -1
        this.context = {}
        this.res = true
    }
    next(i) {
        this.index = i
        if (i === this.arr.length) return this.res
        let fn = this.arr[i]
        fn(this.context, this.next.bind(this, i + 1), this.end.bind(this))
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
        return this
    }
    isRandom() {
        this.arr.push(isRandom)
        return this
    }
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
