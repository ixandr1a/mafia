class Users {
    constructor() {
        this.messages = []
    }

    add(msg) {
        this.messages.push(msg)
    }


    getByRoom(room) {
        return this.messages.filter(msg => msg.room === room)
    }
}

module.exports = function () {
    return new Users()
}
