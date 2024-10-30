var origBoard;
var aiWinCount = 0;
var playerWinCount = 0;
let tiecount = 0;
let isMuted = false; // Variable to track sound state
const xSound = document.getElementById('xSound');
const oSound = document.getElementById('oSound');
const winSound = document.getElementById('winSound');
const failSound = document.getElementById('failSound');
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
function toggleSound() {
    isMuted = !isMuted; // Toggle the sound state

    const soundIcon = document.getElementById('soundIcon');

    // Change the icon based on the mute state
    if (isMuted) {
        soundIcon.classList.remove('fa-volume-up'); // Remove sound on icon
        soundIcon.classList.add('fa-volume-mute'); // Add mute icon
        // Mute all sounds
        winSound.muted = true;
        failSound.muted = true;
        xSound.muted = true;
        oSound.muted = true;
    } else {
        soundIcon.classList.remove('fa-volume-mute'); // Remove mute icon
        soundIcon.classList.add('fa-volume-up'); // Add sound on icon
        // Unmute all sounds
        winSound.muted = false;
        failSound.muted = false;
        xSound.muted = false;
        oSound.muted = false;
    }
}
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

function bestSpotEasy() {
	const availableSpots = emptySquares();
	return availableSpots[Math.floor(Math.random() * availableSpots.length)];
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer);
		if (!checkWin(origBoard, huPlayer) && !checkTie()) {
			turn(bestSpotEasy(), aiPlayer);
		}
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	if (player === huPlayer) {
        xSound.play(); // Play 'X' sound
    }
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = { index: index, player: player };
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
			winSound.play();
		}
	} else {
		aiWinCount++;
		document.getElementById('aiWins').innerText = aiWinCount;
		if (aiWinCount === 5) {
			declarewingame("You lose the game");
			failSound.play();
			document.querySelector(".anothergamee").style.display = "inline-block";
			document.querySelector(".anothergamee").innerHTML = "Play another match";
		}
	}
	if (playerWinCount < 5 && aiWinCount < 5) {
		declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
		if (gameWon.player == huPlayer) {
            winSound.play(); // Play you win sound for intermediate wins
        } else {
            failSound.play(); // Play you lose sound for intermediate losses
        }
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
