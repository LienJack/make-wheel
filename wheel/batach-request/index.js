const seccond = 10000
const min = 6 * seccond
function createBatchRequest(config) {
    const exTime = config.exTime ||  1 * min
    const request = config.request
    const scheduler = config.scheduler || 100
    const getKey = config.getKey || _getKey
    const cacheKey = config.cacheKey || ''
    const map = {}
    let storage = window.localStorage.getItem(cacheKey)
    if (storage) {
        Object.assign(map,JSON.parse(storage))
    }
    let queue =[]
    let timer = null
    function _getKey (data) {
       return  data["id"]
    }
    function batchRequest() {
        const params = new Set(queue.map((i) => i.key))
        request([...params]).then((data) => {
            queue.forEach((item) => {
                const value = data.find((i) => getKey(i) === item.key)
                if (value && value.status === 1) {
                    item.resolve(value)
                    map[item.key] = {
                        data: value,
                        exTime: new Date().getTime() + exTime
                    }
                } else{
                    item.reject()
                }
            })
        })
        .catch(() => {
            queue.forEach((item) => {
                item.reject()
            })
        })
        .finally(() => {
            timer = null
            queue = []
            window.localStorage.setItem(cacheKey, JSON.stringify(map))
        })
    }
    function pushQueue (key) {
        if (!timer) {
            timer = setTimeout(batchRequest, scheduler)
        }
        return new Promise((resolve, reject) => {
            queue.push({
                key,
                resolve,
                reject
            })
        })
    }
    return (key, isCache = true) => {
        if (isCache && map[key] && (new Date().getTime() < map[key].exTime)) {
            return Promise.resolve(map[key].data)
        }
        return pushQueue(key)
    }
}


function getUser(ids) {
    console.log("getUser")
    const map = {
        1: {
            status: 1,
            name: "1",
            id: 1
        },
        2: {
            status: 1,
            name: "2",
            id: 2
        },
        3: {
            status: 1,
            name: "3",
            id: 3
        },

    }
    return new Promise((resolve, reject) => {
        setTimeout(resolve(ids.map((i) => map[i])), 500)
    })
}

const user = createBatchRequest({
    request: getUser,
    cacheKey: "user",
})
async function test () {
    user(1).then((i) => console.log(i))
    user(1).then((i) => console.log(i))
    user(2).then((i) => console.log(i))
    setTimeout(() => {
        user(1).then((i) => console.log(i))
        user(3).then((i) => console.log(i))
    }, 1000)

    
}

test()

