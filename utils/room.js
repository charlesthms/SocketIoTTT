const users = require('./user');

const rooms = [];

function newRoom(socketId, users){
    rooms.push([
        socketId,
        users,
        ['x', 'o']
    ]);
    return rooms;
}

function getChoices(socketId){
    return rooms.filter((room) => {
        room[0] == socketId
    });
}

module.exports = {
    newRoom,
    getChoices
}