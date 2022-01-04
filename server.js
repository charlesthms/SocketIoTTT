const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const { env } = require('process');
const ip = require('ip');
const { userJoin, currentUser, userLeave, getRoomUsers } = require('./utils/user');
const { newRoom, getChoices } = require('./utils/room');


const PORT = 4000 || process.env.PORT;
const initial_path = path.join(__dirname, '/');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(initial_path + "client"));

let class_choices = {
    room1: ['x', 'o'],
    room2: ['x', 'o']
};

io.on('connection', (socket) => {

    socket.on('join', ({ username, classp, room, canPlay_x, canPlay_o }) => {
        const user = userJoin(socket.id, username, classp, room, canPlay_x, canPlay_o);
        socket.join(user.room);

        console.log({
            username,
            classp,
            room,
        });

        let curr_room = [];
        if(room==1){
            curr_room = class_choices.room1;
        } else {
            curr_room = class_choices.room2;
        }

        let class_left;
        if(classp == "x"){
            curr_room.splice(curr_room.indexOf("x"), 1);
        } else {
            curr_room.splice(curr_room.indexOf("o"), 1)
        }

        newRoom(socket.id, getRoomUsers(user.room));
        console.log('id:' + socket.id);
        io.emit('test', getChoices(socket.id));

        io.emit('update-class', {
            msg: "update",
            room: room,
            classp: curr_room
        });

        io.to(user.room).emit('users-info', { 
            room: user.room, 
            users: getRoomUsers(user.room), 
            classp: user.classp,
            canPlay_x: user.canPlay_x,
            canPlay_o: user.canPlay_o
        });

    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user){
            console.log(`${user.username} s'est déconnecté...`);

            io.emit('users-info', { 
                room: user.room, 
                users: getRoomUsers(user.room), 
                classp: user.classp,
                canPlay_x: user.canPlay_x,
                canPlay_o: user.canPlay_o
             });
        }
    })

})

app.get('/', (req, res) => {
    res.status(200).sendFile(initial_path + 'client/form.html');
});
    
app.get('/game', (req, res) => {
    res.sendFile(initial_path + 'client/game.html');
});

app.get('/api/choices/:room', (req, res) => {
    if(req.params.room == 1){
        res.json({choices: class_choices.room1});
    } else {
        res.json({choices: class_choices.room2});
    }
})
    

server.listen(PORT, () => {
    console.log("\x1b[35m" ,`Serveur lancé:\n`);
    console.log("\x1b[32m", `   - http://localhost:${PORT}/\n    - http://${ip.address()}:${PORT}/`);
});