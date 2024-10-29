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

function anothergame()
{
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
	
	document.getElementById('tiecount').innerHTML =tiecount;
	
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
    if (typeof origBoard[square.target.id] === 'number') {
        turn(square.target.id, huPlayer);
        if (!checkWin(origBoard, huPlayer) && !checkTie()) {
            turn(bestSpotNormal(), aiPlayer); // Use the normal AI
        }
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
	for (let index of winCombos[gameWon.index]) {
		const cell = document.getElementById(index);
	cell.style.backgroundColor = gameWon.player == huPlayer ? "#d1c4e9" : "#008080";
		
		cell.style.transition = "background-color 0.3s ease-in-out"; // Smooth transition for cell background
	
		// Wrap the symbol with a span for targeted animation
		const symbol = cell.innerText;
		cell.innerHTML = `<span class="dynamic-symbol">${symbol}</span>`;
	}
	
	for (var i = 0; i < cells.length; i++) { // men shen la ba2a fik tef2os 3ala 2aya cell ta tektob
		cells[i].removeEventListener('click', turnClick, false);
	}
	if (gameWon.player == huPlayer) {
        playerWinCount++; // Increment player win count
        document.getElementById('playerwins').innerText = playerWinCount; // Update player wins on button
		if (playerWinCount === 5) {
			declarewingame("You Win!!! the game");
		}
    } else {
        aiWinCount++; // Increment AI win count
        document.getElementById('aiWins').innerText = aiWinCount; // Update AI wins on button
		if (aiWinCount === 5) {
			declarewingame("You lose the game");
			
			document.querySelector(".anothergamee").style.display = "inline-block";// yezhor al moraba3
			document.querySelector(".anothergamee").innerHTML = "Play another match"; 
	

		}
    }
	if(playerWinCount<5 && aiWinCount<5){
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");// men 7et win or lose 
	}
}

function declarewingame(who)
{
	document.querySelector(".roundgame").style.display = "block";// yezhor al moraba3 
	document.querySelector(".roundgame .text2").innerText = who;// yektob b2alb al moraba3 min rebe7

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
			cells[i].style.backgroundColor = "#008080";// 7awelon kellon la green la2an ta3adol
			cells[i].removeEventListener('click', turnClick, false);// kamen ma t5ali yef2os wala shi
		}
		declareWinner("Tie Game!");// 3atayneha tektob tie game ma7al al variable who
		tiecount++;
		document.getElementById('tiecount').innerText =tiecount;
		return true;
	}
	return false;
}


function bestSpotNormal() {
    // Check for a winning move first
    const winningMove = findWinningMove(aiPlayer);
    if (winningMove !== null) {
        return winningMove; // AI wins
    }

    // Check if the player has a winning move that needs to be blocked
    const blockingMove = findWinningMove(huPlayer);
    if (blockingMove !== null) {
        return blockingMove; // Block player's win
    }

    // If no winning or blocking move, pick a random spot
    const availableSpots = emptySquares();
    return availableSpots[Math.floor(Math.random() * availableSpots.length)];
}

function findWinningMove(player) {
    for (let combo of winCombos) {
        const plays = combo.map(index => origBoard[index]);
        const emptyIndex = combo.find(index => origBoard[index] === null);
        const countPlayer = plays.filter(p => p === player).length;

        // Check if the player can win with this move
        if (countPlayer === 2 && emptyIndex !== undefined) {
            return emptyIndex; // Return the index to make the winning move
        }
    }
    return null; // No winning move found
}
