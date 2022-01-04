const { username, classp, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

let canPlay_x = false;
let canPlay_o = false;

socket.emit('join', { username, classp, room, canPlay_x, canPlay_o });
