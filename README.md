# Mastermind

A browser game where you crack a secret code of 4 colors in 10 attempts.
After each guess you get clues: a black peg for a right color in the right
spot, and a white peg for a right color in the wrong spot.

## How to run

No install needed. Open `index.html` in a browser, or start a small local server in this folder:

```
python3 -m http.server
```

Then open http://localhost:8000.

## How to play

1. Click a slot in the lit row, then click a color. Press Undo to clear the last color.
2. Press "Check guess" to get clues in the small pegs.
3. Crack the code in 10 attempts. Your best score (fewest attempts) is saved in your browser.
4. Press "New game" to start again at any time.

## Run the tests

You need Node.js 20 or newer. There is nothing to install.

```
npm test
```

See [docs/test-checklist.md](docs/test-checklist.md) for what the tests cover, what to check by hand, and the known bugs.

## Project files

| File | What it does |
|---|---|
| `index.html`, `style.css` | The page and how it looks |
| `script.js` | The `game` object, picking colors, submitting a guess, the attempt counter and the best score |
| `feedback.js` | `calculateFeedback()`: black and white pegs for a guess |
| `game-status.js` | `checkWin()` and `checkLoss()` |
| `board.js` | Draws feedback pegs and the secret code, and clears the board |
| `game-flow.js` | After each guess: shows feedback, ends the game, blocks input once it is over |
| `new-game.js` | `resetGame()` and the New game button |
| `undo.js` | `undoLastColor()` and the Undo button |
| `tests/` | Automated tests, using Node's built-in test runner |

`index.html` loads `script.js` first. The other files are loaded after it and
use its `game` object, so keep that order.

## Team

TBD: add the team members' names.

## License

See [LICENSE](LICENSE).
