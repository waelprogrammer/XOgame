var origBoard;// original board
var aiWinCount = 0; // Counter for AI wins
var playerWinCount = 0; // Counter for Player wins
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
	let plays = board.reduce((a, e, i) =>// a howeh metel kiss b7et fi al sha8let yalli badi yeha men reduce 
	(e === player) ? a.concat(i) : a, []); // way to find every index that the player has played in
	// reduce bte5od kel elment b2alb al array w btef7aso 
	// hon 7ettayne e 2enno heyeh ya l X ya l O 7asab wen 3am 3ayet lal function 
	// fa howeh la7 yemshi 3ala kel element bel array 2eza kenet e = X for example la y7et b2alb al a yalli heye array index
	// a.concat(i) bte3mel merge ben al array ye3ni 2awal marra 7at index 1 teni marra 2 byejma3aon b aaray we7ed 
	// 2eza e # X for example byetrok al a metel ma heyeh
	// example : let board = ['X', 'O', 'X', null, 'X', null, null, 'O', null];
	/*For the board above, the iteration would work like this:
    At index 0, e is 'X', so plays becomes [0].
    At index 1, e is 'O', so plays remains [0].
    At index 2, e is 'X', so plays becomes [0, 2].
    At index 4, e is 'X', so plays becomes [0, 2, 4].
    Final plays would be [0, 2, 4], indicating that 'X' played in those positions.*/
		 

	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) { // win = [0,1,2] and index is 0
			/*Example
Let’s say plays is [0, 2, 4] and the current win is [0, 1, 2]. Here’s how the check works:

Iteration with every():
Check for 0: plays.indexOf(0) returns 0 (found), so 0 > -1 is true.
Check for 1: plays.indexOf(1) returns -1 (not found), so 1 > -1 is false. heyeh haydeh iza ma la2et betredeli -1 la 7ala
Check for 2: Not checked because every() already returned false.
Since one element fails the test, every() returns false, and the condition does not execute the block of code within the if.

Example Scenario
Consider the following:

plays: [0, 1, 2] (indicating player 'X' has played in these positions)
Current win being checked: [0, 1, 2]
Check with every():
For 0: found (true)
For 1: found (true)
For 2: found (true)
Since all elements are found, every() returns true, indicating that the player has won.*/
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
	if (gameWon.player == huPlayer) {
        playerWinCount++; // Increment player win count
        document.getElementById('playerWins').innerText = playerWinCount; // Update player wins on button
    } else {
        aiWinCount++; // Increment AI win count
        document.getElementById('aiWins').innerText = aiWinCount; // Update AI wins on button
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
		declareWinner("Tie Game!");// 3atayneha tektob tie game ma7al al variable who
		tiecount++;
		document.getElementById('tiecount').innerText ='Tie Games : '+ tiecount;
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