# Tic Tac Toe

A Tic-Tac-Toe game built with plain **HTML**, **CSS**, and **JavaScript**. It supports mouse, keyboard, and saves scpre locally.

## Features

- Classic two-player Tic-Tac-Toe gameplay
- Alternating `X` and `O` turns
- Win detection for all rows, columns, and diagonals
- Draw detection
- Highlighted winning cells
- Persistent win scores using `localStorage`
- `X` score displayed to the left of the board
- `O` score displayed to the right of the board
- **New round** button that clears the board while preserving scores
- **Reset scores** button that clears saved scores
- Responsive square 3×3 game board
- Keyboard navigation and keyboard play controls
- Styled title, glowing markers, marker outlines, shadows, and focus states

## Controls

| Key / input | Action |
|---|---|
| Click a cell | Place the current player's mark |
| `W` or `↑` | Move selection up |
| `A` or `←` | Move selection left |
| `S` or `↓` | Move selection down |
| `D` or `→` | Move selection right |
| `Enter` or `Space` | Place the current player's mark |
| `R` | Start a new round and keep the scores |

When the page loads, the top-left cell is selected so keyboard controls work immediately.

## Project structure

```text
.
├── index.html     # Page structure and game-board buttons
├── styles.css     # Layout, responsive styling, game visuals
├── script.js      # Game logic, keyboard controls, score persistence
└── README.md
```

## Score persistence

Wins are stored in the browser using `localStorage` under the key:

```js
"ticTacToeScores"
```

The saved value looks like this:

```json
{
  "X": 3,
  "O": 1
}
```

Scores remain after refreshing the page or reopening the browser, as long as the browser's site data is not cleared.

- **New round** clears only the current game board.
- **Reset scores** sets both scores to `0` and removes the saved score data.

## How the board works

The nine squares use indexes from `0` to `8`:

```text
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

The JavaScript keeps two aligned arrays:

```js
board[4]; // Game state at index 4: null, "X", or "O"
cells[4]; // The actual HTML button at index 4
```

This makes it easy to:

- Check whether a move is valid
- Detect winning combinations
- Highlight a winning line
- Move keyboard focus between cells
- Reset the board

## Technologies

- HTML5
- CSS3
  - CSS Grid
  - Flexbox
  - `clamp()` responsive typography
  - Gradients, text shadows, and text strokes
- Vanilla JavaScript
  - DOM events
  - Keyboard events
  - Arrays
  - `localStorage`

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
