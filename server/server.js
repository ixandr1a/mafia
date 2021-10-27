const app = require('express')();
const http = require('http').Server(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "http://192.168.0.102:8080",
        methods: ["GET", "POST"]
    }
});
const users = require('./users')();
const messages = require('./messages')();
const { Console } = require('console');
const cors = require('cors');


app.use(cors())

io.on('connection', socket => {

    socket.on('newuser', (username, room) => {
        console.log(`Пользователь: ${username}; Подключился к комнате ${room}`);
        socket.username = username;
        let roomId = parseInt(room)
        let valid = users.adminValidate(username, roomId)
        if (valid === true) {
            users.add({
                id: socket.id,
                name: username,
                room: roomId,
                index: null,
                role: 0,
                killStatus: 0,
                healthStatus: 0,
                kill: 0,
            })
            socket.join(roomId)
        } else {
            console.log('ne')
        }
        io.to(roomId).emit('userOnline', users.getByRoom(roomId));
        io.to(roomId).emit('AllMessagesInByRoom', messages.getByRoom(room));
    });

    socket.on('getByRole', room => {
        let roomId = parseInt(room)
        let userRole = users.getByRole(roomId)
        let adminInfo = 'Игра началась, все игроки получили свои роли'
        io.to(roomId).emit('userRole', userRole, adminInfo)
    })
    socket.on('killedUser', value => {
        let killed = users.killedUser(value)
        io.to(value.room).emit('killed', killed)
        // console.log('Здесь чисто убитый', killed)
    })

    socket.on('healthUser', value => {
        let health = users.healthUser(value)
        io.to(value.room).emit('health', health)
    })

    socket.on('resetStatus', value => {
        users.killStatus(value)
    })
    socket.on('dayAndNight', value => {
        let roomId = parseInt(value.room)
        io.to(roomId).emit('getDayAndNight', value.step)
    })

    socket.on('msg', msg => {
        messages.add({
            msg: msg.msg,
            name: msg.name,
            room: msg.room,
        })
        // let test = users.getByRoom(parseInt(msg.room))
        io.to(parseInt(msg.room)).emit('newMsg', messages.getByRoom(msg.room), msg)
    });

    socket.on("disconnect", () => {
        console.log(`${socket.username} Отключился.`);
        let userLeft = users.remove(socket.id)
        io.to(userLeft.room).emit("userLeft", users.getByRoom(userLeft.room));
    });

})

http.listen(process.env.PORT || 3000, () => {
    console.log('server connect', process.env.PORT || 3000)
})