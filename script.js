const boardEl = document.getElementById("board");
const cells = Array.from(boardEl.querySelectorAll(".cell"));
const statusEl = document.getElementById("status");

const aiModeToggle = document.getElementById("aiModeToggle");

const resetBtn = document.getElementById("resetBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");

const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");

const SCORE_STORAGE_KEY = "ticTacToeScores";

const winningCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameActive = true;
let scores = loadScores();

let aiEnabled = false;
let computerThinking = false;

let computerTimerId = null;

const HUMAN_PLAYER = "X";
const COMPUTER_PLAYER = "O";
const COMPUTER_THINKING_DELAY = 500; // milliseconds

function loadScores() {
	try {
		const savedScores = localStorage.getItem(SCORE_STORAGE_KEY);

		if (!savedScores) {
			return { X: 0, O: 0 };
		}

		const parsedScores = JSON.parse(savedScores);

		return {
			X: Number(parsedScores.X) || 0,
			O: Number(parsedScores.O) || 0,
		};
	} catch {
		return { X: 0, O: 0 };
	}
}

function saveScores() {
	localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(scores));
}

function updateScoreDisplay() {
	xScoreEl.textContent = scores.X;
	oScoreEl.textContent = scores.O;
}

function getWinningCombo() {
	return winningCombos.find(([a, b, c]) => {
		return board[a] !== null && board[a] === board[b] && board[a] === board[c];
	});
}

function getWinningComboFor(testBoard) {
	return winningCombos.find(([a, b, c]) => {
		return (
			testBoard[a] !== null &&
			testBoard[a] === testBoard[b] &&
			testBoard[a] === testBoard[c]
		);
	});
}

function isDraw() {
	return board.every((cell) => cell !== null);
}

function isDrawFor(testBoard) {
	return testBoard.every((cell) => cell !== null);
}

function placeMark(cell, index) {
	board[index] = currentPlayer;
	cell.textContent = currentPlayer;
	cell.classList.add(currentPlayer.toLowerCase());
	cell.setAttribute("aria-label", `${currentPlayer} in cell ${index + 1}`);
}

function playCell(cell, isComputerMove = false) {
	const index = Number(cell.dataset.index);

	/*
    Lock human out of the board while the computer is thinking or moving.
  */
	if (
		aiEnabled &&
		!isComputerMove &&
		(computerThinking || currentPlayer === COMPUTER_PLAYER)
	) {
		return;
	}

	/* Do nothing after the game ends or in an occupied square. */
	if (!gameActive || board[index] !== null) {
		return;
	}

	placeMark(cell, index);

	/* Check for a winning line after the move. */
	const winningCombo = getWinningCombo();

	if (winningCombo) {
		gameActive = false;
		computerThinking = false;

		scores[currentPlayer] += 1;
		saveScores();
		updateScoreDisplay();

		statusEl.textContent = aiEnabled
			? currentPlayer === HUMAN_PLAYER
				? "You win!"
				: "Computer wins!"
			: `Player ${currentPlayer} wins!`;

		winningCombo.forEach((winningIndex) => {
			cells[winningIndex].classList.add("winner");
		});

		return;
	}

	/* Check for a draw only after checking for a win. */
	if (isDraw()) {
		gameActive = false;
		computerThinking = false;
		statusEl.textContent = "It's a draw!";
		return;
	}

	/* No win/draw: turn to the other player. */
	currentPlayer =
		currentPlayer === HUMAN_PLAYER ? COMPUTER_PLAYER : HUMAN_PLAYER;

	/*
    When AI mode is enabled and it is now O's turn:
    schedule the computer's move.
  */
	if (aiEnabled && currentPlayer === COMPUTER_PLAYER) {
		computerThinking = true;
		statusEl.textContent = "Computer is thinking...";

		computerTimerId = setTimeout(makeComputerMove, COMPUTER_THINKING_DELAY);

		return;
	}

	/*
    Either:
    - two-player mode and it is O's turn, or
    - the computer has just played O and it is X's turn.
  */
	statusEl.textContent = aiEnabled
		? "Your turn (X)"
		: `Player ${currentPlayer}'s turn`;
}

function handleCellClick(event) {
	playCell(event.currentTarget);
}

function moveBoardFocus(currentIndex, rowChange, columnChange) {
	const currentRow = Math.floor(currentIndex / 3);
	const currentColumn = currentIndex % 3;

	const nextRow = currentRow + rowChange;
	const nextColumn = currentColumn + columnChange;

	if (nextRow < 0 || nextRow > 2 || nextColumn < 0 || nextColumn > 2) {
		return;
	}

	const nextIndex = nextRow * 3 + nextColumn;
	cells[nextIndex].focus();
}

function handleBoardKeydown(event) {
	const focusedCell = document.activeElement;

	if (!focusedCell.classList.contains("cell")) {
		return;
	}

	const currentIndex = Number(focusedCell.dataset.index);

	/*
    R starts a new round but keeps the saved scores.
  */
	if (event.key === "r" || event.key === "R") {
		event.preventDefault();
		resetGame();
		return;
	}

	/*
    Keyboard navigation:
    W / Arrow Up    = up
    A / Arrow Left  = left
    S / Arrow Down  = down
    D / Arrow Right = right
  */
	switch (event.key) {
		case "w":
		case "W":
		case "ArrowUp":
			event.preventDefault();
			moveBoardFocus(currentIndex, -1, 0);
			break;

		case "a":
		case "A":
		case "ArrowLeft":
			event.preventDefault();
			moveBoardFocus(currentIndex, 0, -1);
			break;

		case "s":
		case "S":
		case "ArrowDown":
			event.preventDefault();
			moveBoardFocus(currentIndex, 1, 0);
			break;

		case "d":
		case "D":
		case "ArrowRight":
			event.preventDefault();
			moveBoardFocus(currentIndex, 0, 1);
			break;

		/*
      Enter and Space place the current player's mark in
      the currently focused cell.
    */
		case "Enter":
		case " ":
			event.preventDefault();
			playCell(focusedCell);
			break;
	}
}

function resetGame() {
	/*
    If O was waiting to move, cancel that old scheduled move.
  */
	if (computerTimerId !== null) {
		clearTimeout(computerTimerId);
		computerTimerId = null;
	}

	board = Array(9).fill(null);
	currentPlayer = HUMAN_PLAYER;
	gameActive = true;
	computerThinking = false;

	statusEl.textContent = aiEnabled ? "Your turn (X)" : "Player X's turn";

	cells.forEach((cell, index) => {
		cell.textContent = "";
		cell.classList.remove("x", "o", "winner");
		cell.setAttribute("aria-label", `Empty cell ${index + 1}`);
	});

	cells[0].focus();
}

function resetScores() {
	scores = { X: 0, O: 0 };

	localStorage.removeItem(SCORE_STORAGE_KEY);
	updateScoreDisplay();

	statusEl.textContent = "Scores reset. Player X's turn";
}

function minimax(testBoard, depth, isMaximizing) {
	const winningCombo = getWinningComboFor(testBoard);

	if (winningCombo) {
		const winner = testBoard[winningCombo[0]];

		if (winner === COMPUTER_PLAYER) {
			return 10 - depth;
		}

		if (winner === HUMAN_PLAYER) {
			return depth - 10;
		}
	}

	if (isDrawFor(testBoard)) {
		return 0;
	}

	const availableMoves = getAvailableMoves(testBoard);

	if (isMaximizing) {
		let bestScore = -Infinity;

		for (const index of availableMoves) {
			testBoard[index] = COMPUTER_PLAYER;
			const score = minimax(testBoard, depth + 1, false);
			testBoard[index] = null; // backtrack

			bestScore = Math.max(score, bestScore);
		}

		return bestScore;
	} else {
		let bestScore = Infinity;

		for (const index of availableMoves) {
			testBoard[index] = HUMAN_PLAYER;
			const score = minimax(testBoard, depth + 1, true);
			testBoard[index] = null; // backtrack

			bestScore = Math.min(score, bestScore);
		}

		return bestScore;
	}
}

function getBestComputerMove() {
	const availableMoves = getAvailableMoves();
	let bestScore = -Infinity;
	let bestMoves = [];

	availableMoves.forEach((index) => {
		/*
      Temporarily try O at this position.
    */
		board[index] = COMPUTER_PLAYER;

		/*
      The next simulated turn belongs to X,
      so `isMaximizing` is false.
    */
		const score = minimax(board, 0, false);

		/*
      Restore the real board before testing the next move.
    */
		board[index] = null;

		if (score > bestScore) {
			bestScore = score;
			bestMoves = [index];
		} else if (score === bestScore) {
			/*
        Several moves can be equally perfect.
        Keep all of them to avoid the AI always choosing
        the exact same opening.
      */
			bestMoves.push(index);
		}
	});

	const randomBestMove = Math.floor(Math.random() * bestMoves.length);
	return bestMoves[randomBestMove];
}

function getAvailableMoves(testBoard = board) {
	return testBoard
		.map((cell, index) => (cell === null ? index : null))
		.filter((index) => index !== null);
}

function makeComputerMove() {
	computerTimerId = null;

	if (
		!gameActive ||
		!aiEnabled ||
		!computerThinking ||
		currentPlayer !== COMPUTER_PLAYER
	) {
		return;
	}

	const availableMoves = getAvailableMoves();

	if (availableMoves.length === 0) {
		return;
	}

	const moveIndex = getBestComputerMove();
	const computerCell = cells[moveIndex];

	computerThinking = false;
	playCell(computerCell, true);

	if (gameActive) {
		cells[moveIndex].focus({ preventScroll: true });
	}
}

cells.forEach((cell) => {
	cell.addEventListener("click", handleCellClick);
});

aiModeToggle.addEventListener("change", () => {
	aiEnabled = aiModeToggle.checked;

	/*
    resetGame() cancels an existing AI timer,
    clears the board, resets the turn, and resets focus.
  */
	resetGame();

	statusEl.textContent = aiEnabled
		? "Computer mode enabled. Your turn (X)"
		: "Two-player mode enabled. Player X's turn";
});

boardEl.addEventListener("keydown", handleBoardKeydown);

resetBtn.addEventListener("click", resetGame);
resetScoreBtn.addEventListener("click", resetScores);

updateScoreDisplay();

/* Start keyboard navigation on the top-left board cell. */
cells[0].focus({ preventScroll: true });
