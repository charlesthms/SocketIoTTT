const socket = io();
const options = document.getElementById('classp');
const rooms = document.getElementById('room');

socket.on('update-class', ({ msg, room, classp }) => {
    let current_room = rooms.options[rooms.selectedIndex].value;
    options.innerHTML = `<option id="opt" value="${classp[0]}">${classp[0].toUpperCase()}</option>`;
});

socket.on('connection', ({ choices }) => {
    getCurrentChoices();
});

socket.on('users-info', ( { room, users, classp, canPlay_x, canPlay_o } ) => {
    console.log({
        room, users, classp, canPlay_x, canPlay_o
    });
})



rooms.addEventListener('change', () => {
    getCurrentChoices();
})

const getCurrentChoices = async () => {
    let current_room = rooms.options[rooms.selectedIndex].value;

    if(current_room==1){
        fetch('/api/choices/1').then(async (res) => {
            const updated_c = await res.json();
            const array = updated_c.choices;

            options.innerHTML = "";
            for (let i = 0; i < array.length; i++) {
                const mark = array[i];
                options.innerHTML += `<option id="opt" value="${mark}">${mark.toUpperCase()}</option>`
            }
        });
    } else {
        fetch('/api/choices/2').then(async (res) => {
            const updated_c = await res.json();
            const array = updated_c.choices;
            
            options.innerHTML = "";
            for (let i = 0; i < array.length; i++) {
                const mark = array[i];
                options.innerHTML += `<option id="opt" value="${mark}">${mark.toUpperCase()}</option>`
            }
        });
    }
}