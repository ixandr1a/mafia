class Users {
    constructor() {
        this.users = []
    }

    add(user) {
        this.users.push(user)
    }

    get() {
        let onlineUser = []
        // return this.users.find(user => user.id === id)
        this.users.forEach(item => {
            onlineUser.push(item.name)
        })
        return onlineUser
    }

    adminValidate(name, room) {
        this.validUsers = this.users.filter(user => user.room === room)
        let valid = true
        this.validUsers.forEach(item => {
            if (item.name === name) {
                valid = false
            }
        })
        return valid;
    }

    remove(id) {
        let userLeft = ''
        this.users.forEach(item => {
            if (item.id === id) {
                userLeft = item
            }
        })
        this.users = this.users.filter(user => user.id !== id)
        return userLeft
    }
    getByRole(room) {
        function shuffle(array) {
            for (var j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
            return true;
        }
        let userRole = this.users.filter(user => user.room === room)
        userRole = userRole.filter(user => user.name != 'admin')
        shuffle(userRole)
        if (userRole.length > 4) {
            userRole.forEach(function (item, index) {
                item.index = index
                if (item.role != 0) {
                    item.role = 1
                }
                if (item.role === 0) {
                    item.index = 999
                }
                if (item.index === 0 || item.index === 1 && item.room === room && item.role != 0) {
                    item.role = 2
                }
                if (item.index === 2 && item.room === room && item.role != 0) {
                    item.role = 3
                }
            })
        } else {
            userRole.forEach(function (item, index) {
                item.index = index
                if (item.role != 0) {
                    item.role = 1
                }
                if (item.role === 0) {
                    item.index = 999
                }
                if (item.index === 0 && item.room === room && item.role != 0) {
                    item.role = 2
                }
                if (item.index === 1 && item.room === room && item.role != 0) {
                    item.role = 3
                }
            })
        }
        // console.log(userRole)
        return userRole

    }

    killedUser(value) {
        this.users.forEach(item => {
            if (item.id === value.id) {
                item.killStatus = 1
            }
        })
        let killed = this.users.filter(user => user.room === value.room && user.kill != 1)
        killed = killed.filter(user => user.name != 'admin')
        console.log(killed)
        return killed
    }

    healthUser(value) {
        let killedIndex = null
        let killedName = ''
        let healthName = ''
        this.users.forEach(item => {
            if (item.id === value.id) {
                item.healthStatus = 1
            }
        })
        let health = this.users.filter(user => user.room === value.room)
        health = health.filter(user => user.kill != 1)
        health.forEach(item => {
            if (item.killStatus === 1 && item.healthStatus != 1) {
                killedIndex = item.index
                killedName = item.name
            }
        })
        let healthCount = health.filter(user => user.healthStatus === 1)
        healthCount.forEach(item => {
            healthName = item.name
        })
        health = health.filter(user => user.name != killedName && user.kill != 1)
        health = health.filter(user => user.name != 'admin')
        let obj = {
            users: health,
            killedName: killedName,
            healthName: healthName,
        }
        console.log(healthName)
        return obj
    }

    getByRoom(room) {
        this.users.forEach(item => {
            if (item.name != 'admin') {
                item.role = 1
            }
        })
        return this.users.filter(user => user.room === room)
    }
    killStatus(obj) {
        let roomId = parseInt(obj.roomId)
        this.users = this.users.filter(user => user.room === roomId && user.kill != 1 && user.name != 'admin')
        this.users.forEach(item => {
            if (item.name === obj.killedName) {
                item.kill = 1
            }
            item.healthStatus = 0
            item.killStatus = 0
        })


    }
}

module.exports = function () {
    return new Users()
}
