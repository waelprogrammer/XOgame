var origBoard;
var aiWinCount = 0;
var playerWinCount = 0;
let tiecount = 0;
const huPlayer = 'X';
const aiPlayer = 'O';
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

function anothergame() {
	document.querySelector(".roundgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
	aiWinCount = 0;
	document.getElementById('aiWins').innerHTML = aiWinCount;
	playerWinCount = 0;
	document.getElementById('playerwins').innerHTML = playerWinCount;
	tiecount = 0;
	document.getElementById('tiecount').innerHTML = tiecount;
}

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer);
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
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
		cell.style.backgroundColor = gameWon.player == huPlayer ? "#d1c4e9" : "#008080";
		cell.style.transition = "background-color 0.3s ease-in-out";
		const symbol = cell.innerText;
		cell.innerHTML = `<span class="dynamic-symbol">${symbol}</span>`;
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	if (gameWon.player == huPlayer) {
		playerWinCount++;
		document.getElementById('playerwins').innerText = playerWinCount;
		if (playerWinCount === 5) {
			declarewingame("You Win!!! the game");
		}
	} else {
		aiWinCount++;
		document.getElementById('aiWins').innerText = aiWinCount;
		if (aiWinCount === 5) {
			declarewingame("You lose the game");
			document.querySelector(".anothergamee").style.display = "inline-block";
			document.querySelector(".anothergamee").innerHTML = "Play another match";
		}
	}
	if (playerWinCount < 5 && aiWinCount < 5) {
		declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
	}
}

function declarewingame(who) {
	document.querySelector(".roundgame").style.display = "block";
	document.querySelector(".roundgame .text2").innerText = who;
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "#008080";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!");
		tiecount++;
		document.getElementById('tiecount').innerText = tiecount;
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();
	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;
		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}
		newBoard[availSpots[i]] = move.index;
		moves.push(move);
	}
	var bestMove;
	if (player === aiPlayer) {
		var bestScore = -10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}
