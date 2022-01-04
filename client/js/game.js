const cellules = document.querySelectorAll('[data-cell]')
const winMess = document.querySelector('[win-message]')
const winID = document.getElementById('win-mess')
const rejouer = document.getElementById('rejouer')

var Class
var isX
//const o_Class = 'O'

var score = 0

var play


const win = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
]

//var alternate = false
var plateau = new Map()


// Réception de la classe du joueur (X ou O)
socket.on('users-info', ({ room, users, classp, canPlay_x, canPlay_o }) => {
	console.log(room, users, classp, canPlay_x, canPlay_o);
	
	if (classp === 'x_Class'){
		play = canPlay_x
		Class = 'X'
		isX = true
	}else{
		play = canPlay_o
		Class = 'O'
		isX = false
	}
	startGame(play)
})

socket.on('test', msg => console.log(msg));


function startGame(play){

	if (play){
		//alternate = false
		cellules.forEach(cell => {
			cell.addEventListener('click', onClick, { once: true })
		})
	}
}

function onClick(e) {

	const currentCell = e.target
	//const currentClass = alternate ? o_Class : x_Class
	const currentClass = Class
	
	var currentID = currentCell.id
	plateau.set(currentID, currentClass)

	socket.emit('plateau', ({ currentID, currentClass }))

	socket.on('refresh', ({ currentID, currentClass }) => {
		applyStyle(currentID, currentClass)
		isWin(plateau)
		tourSwap()
		endGame()
	})
	
}

function applyStyle(id, CurrentClass) {

	cell = document.getElementById(id)
	cell.style.fontSize = '110px'
	cell.style.fontFamily = "Quicksand, sans-serif"
	cell.innerHTML = CurrentClass
}


function tourSwap() {
	play = !play
}


function checkLine(plateau, line) {
	// Verifie si une ligne est composée des 3 mêmes valeurs.

	var a = plateau.get(line[0].toString())
	var b = plateau.get(line[1].toString())
	var c = plateau.get(line[2].toString())

	if ( a===b && a===c ){
		return a
	}
	return false
}

function isWin(plateau) {
	// Itere sur le tableau win et applique checkLine() sur chaque ligne.

	win.forEach( line => {
	  check = checkLine(plateau, line)

	  if ( check === 'X' || check === 'O' ){
	  	winMess.innerText = `${isX ? 'X à gagné !' : 'O à gagné !'}` // Changer isX par un bool qui s'active et se desactive a chaque tour pour chaque joueur
		winID.classList.add('show')
		score++
	  } else if (plateau.size === 9){
	  	winMess.innerText = `Match null !`
	  	winID.classList.add('show')
	  }
	  return false
	})
}

function endGame(){

	rejouer.addEventListener('click', () => {

		socket.emit('end-game', 'mancher terminé')
		console.log(score);

		winID.classList.remove('show')
		plateau.clear()
	
		for (var i = 0; i<9; i++){
			document.getElementById(i.toString()).innerHTML = ''
		}
	
		startGame()
	})
}