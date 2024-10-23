var origBoard;// original board
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

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
    // console.log(square.target.id);
	if (typeof origBoard[square.target.id] == 'number') {// ye3ni 2eza la X wala O ye3ni ma 7ada 3am yel3ab
		turn(square.target.id, huPlayer) // to distinct between human and ai players
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)// he get from gamewon if it is not null he do the second function that is gameover
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []); // way to find every index that the player has played in 

	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) { // win = [0,1,2] and index is 0
			gameWon = {index: index, player: player};// ye3ni 3am nbarem 2eza player 3emel 2aya men al win condition yalli fo2
			break;
		}
	}
	return gameWon;// if no body won he return gamewon = null if anybody win he give me the index that where the win is done and wich player won 
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {// la7 nfout al kel index yalli 7aslao 3ala al win combo ye3ni yalli reb7o
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";// 2eza user rebe7 b7et al kel O blue 2eza al ai be7et X kellon red
	}
	for (var i = 0; i < cells.length; i++) { // men shen la ba2a fik tef2os 3ala 2aya cell ta tektob
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");// men 7et win or lose 
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";// yezhor al moraba3 
	document.querySelector(".endgame .text").innerText = who;// yektob b2alb al moraba3 min rebe7
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');// 3am ne5od bas al empty squares
}

function bestSpot() {
    // return emptySquares()[0];
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) { // 2eza kellon ma 3atouni number ma3neton kello melyenin bel X wel O ye3ni ta3adol
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";// 7awelon kellon la green la2an ta3adol
			cells[i].removeEventListener('click', turnClick, false);// kamen ma t5ali yef2os wala shi
		}
		declareWinner("Tie Game!")// 3atayneha tektob tie game ma7al al variable who
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
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}