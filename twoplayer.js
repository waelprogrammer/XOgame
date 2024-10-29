let origBoard; // Original board
var player1WinCount = 0; // Counter for Player 1 wins
var player2WinCount = 0; // Counter for Player 2 wins
var tieCount = 0;
const player1 = 'X';
const player2 = 'O';
let currentPlayer = player1; // Start with Player 1
let starterplayer=player1;
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
];

const cells = document.querySelectorAll('.cell');
startGame();
document.querySelector('.play-again').addEventListener('click',()=>{changestarter();startGame();})
function changestarter()
{
    starterplayer = starterplayer === player1 ? player2 : player1;
}
function anothergame()
{
	document.querySelector(".roundgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
	player2WinCount = 0;
	document.getElementById('player2wins').innerHTML = player2WinCount;
	player1WinCount = 0;
	document.getElementById('player1wins').innerHTML = player1WinCount;
	tiecount = 0;
	document.getElementById('tiecount').innerHTML =tiecount;
	
}

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	currentPlayer =starterplayer;
	document.querySelector('.turnxory').innerHTML = currentPlayer + ' ' + 'Turn';


	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
   
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, currentPlayer);
		if (!checkWin(origBoard, currentPlayer) && !checkTie()) {
			// Switch players after each turn
			currentPlayer = currentPlayer === player1 ? player2 : player1;
			document.querySelector('.turnxory').innerHTML = currentPlayer + ' ' + 'Turn';
		}
	}
}
//nafsa
function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon) gameOver(gameWon);
}
//nafsa
function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		const cell = document.getElementById(index);
		cell.style.backgroundColor = gameWon.player == player1 ? "#008080" : "#008080";
		cell.style.transition = "background-color 0.3s ease-in-out";
		// Wrap the symbol with a span for targeted animation
		const symbol = cell.innerText;
		cell.innerHTML = `<span class="dynamic-symbol">${symbol}</span>`;



	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	if (gameWon.player == player1) {
		player1WinCount++;
		document.getElementById('player1wins').innerText = player1WinCount;
		if (player1WinCount === 5) {
			declarewingame("X Win the Game!");
		}
	} else {
		player2WinCount++;
		document.getElementById('player2wins').innerText = player2WinCount;
		if (player2WinCount === 5) {
			declarewingame("O Win the Game!");
		}
	}
	if (player1WinCount < 2 && player2WinCount < 5) {
		declareWinner(gameWon.player == player1 ? "X Wins!" : "O Wins!");
	}
}

function declarewingame(who)
{
	 
	document.querySelector(".roundgame").style.display = "block";// yezhor al moraba3 
	document.querySelector(".roundgame .text2").innerText = who;// yektob b2alb al moraba3 min rebe7

}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "#008080";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!");
		tieCount++;
		document.getElementById('tiecount').innerText = tieCount;
       
		return true;
	}
	return false;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}
