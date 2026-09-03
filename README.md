# Tic Tac Toe

A Tic-Tac-Toe game built with plain **HTML**, **CSS**, and **JavaScript**. It supports mouse, keyboard, and saves scpre locally.
Play locally against another player or enable an "unbeatable" computer.

## Features

- Classic two-player Tic-Tac-Toe gameplay
- Toggleable **computer opponent** mode
- Human plays as `X`; computer plays as `O` in computer mode
- "Unbeatable" computer using **minimax** algorithm
- Alternating `X` and `O` turns
- Win detection for all rows, columns, and diagonals
- Draw detection
- Highlighted winning cells
- Persistent win scores using `localStorage`
- `X` score displayed on the left of the board and `O` score on the right
- **New round** button that clears the board while preserving scores
- **Reset scores** button that clears saved scores
- Responsive square 3×3 game board
- Keyboard navigation and keyboard play controls

## Controls

| Key / input        | Action                                |
| ------------------ | ------------------------------------- |
| Click a cell       | Place the current player's mark       |
| `W` or `↑`         | Move selection up                     |
| `A` or `←`         | Move selection left                   |
| `S` or `↓`         | Move selection down                   |
| `D` or `→`         | Move selection right                  |
| `Enter` or `Space` | Place the current player's mark       |
| `R`                | Start a new round and keep the scores |

When the page loads, the top-left cell is selected so keyboard controls work immediately.

## Game modes

### Two-player mode

Computer mode is disabled by default.

- Player 1 uses `X`.
- Player 2 uses `O`.
- The status text shows whose turn it is.

### Computer mode

Enable **Play against computer** to play against the AI.

- You are `X`.
- The computer is `O`.
- After your move, the computer briefly shows a “thinking” status before placing O.
- Disabling or enabling computer mode starts a clean new round but keeps the score totals.

## Project structure

```text
.
├── README.md
├── styles.css     # Layout, responsive styling, game visuals
├── script.js      # Game logic, keyboard controls, score persistence
└── index.html     # Page structure and game-board buttons
```

## Score persistence

Wins are stored in the browser using `localStorage` under the key:

```js
"ticTacToeScores";
```

The saved value looks like this:

```json
{
	"X": 3,
	"O": 1
}
```

Scores survive page refreshes and later browser sessions unless browser site data is cleared.

| Action               | Board     | Scores       |
| -------------------- | --------- | ------------ |
| New round button     | Cleared   | Kept         |
| `R` shortcut         | Cleared   | Kept         |
| Toggle computer mode | Cleared   | Kept         |
| Reset scores button  | Unchanged | Reset to 0–0 |

> Scores belong to the current browser and site origin. They are not shared between devices, browsers, or different URLs/ports..

## Computer AI

The computer opponent uses the **minimax algorithm**. It examines possible remaining moves, evaluates the eventual game result, and chooses the move that leads to the best possible outcome for O—assuming X also makes optimal moves.

### Scoring outcomes

```text
Computer O win = positive score
Draw           = 0
Human X win    = negative score
```

At O’s simulated turns, minimax chooses the highest possible score. At X’s simulated turns, it assumes X will choose the lowest score for O.

```text
O tries every legal move
        ↓
X is assumed to make the strongest response
        ↓
O tries the strongest response to that
        ↓
Continue until win, loss, or draw
        ↓
Choose the move with the best final result for O
```

The AI also accounts for move depth:

```js
10 - depth; // Prefer a quicker computer win
depth - 10; // Delay an unavoidable computer loss
```

Tic-Tac-Toe is small enough for the browser to evaluate the complete remaining game tree quickly. With correct minimax implementation, the computer cannot be beaten; the best possible human result is a draw.

## AI delay and timer safety

The computer response delay is controlled in `script.js`:

```js
const COMPUTER_THINKING_DELAY = 120;
```

The value is measured in milliseconds:

|      Value | Effect                                |
| ---------: | ------------------------------------- |
|        `0` | Nearly immediate move                 |
| `50`–`120` | Very fast response                    |
|      `250` | Short natural pause                   |
|      `500` | Noticeable half-second thinking pause |
|     `1000` | One-second thinking pause             |

The game stores the return value from `setTimeout()` in `computerTimerId`. Calling `clearTimeout(computerTimerId)` when a new round starts or the game mode changes prevents an old delayed AI move from being played on a newly reset board.

## Board indexing

The board has nine indexed cells:

```text
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

The JavaScript maintains two matching collections:

```js
board[4]; // Game state: null, "X", or "O"
cells[4]; // Corresponding HTML button element
```

This shared indexing makes it straightforward to validate moves, detect wins, highlight winning cells, reset the grid, and move keyboard focus.

## Technologies

- HTML5
- CSS3
  - CSS Grid
  - Flexbox
  - Responsive `clamp()` typography
  - CSS gradients, shadows, and text strokes
- Vanilla JavaScript
  - DOM events
  - Keyboard events
  - Arrays
  - `localStorage`
  - `setTimeout()` / `clearTimeout()`
  - Recursive minimax search

## Accessibility notes

- Each game square is a native `<button>` element.
- Cells can receive keyboard focus.
- The focused cell receives a visible focus outline.
- Every board cell has an `aria-label` that updates when a player places a mark.
- Keyboard controls allow the full game to be played without a mouse.

## Ideas for future improvements

- Add a single-player mode with an AI opponent
- Add sound effects for moves, wins, and resets
- Add a difficulty selector for the AI
- Add animations when a marker is placed

## Usage of LLMs/AI

- Help me style the page
- To explain minimax and help me implement it
- LLMs have been used to help me make the README
