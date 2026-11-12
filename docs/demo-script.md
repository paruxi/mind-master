# Demo script (Issue 18)

Time limit: TBD. Confirm it with the course and keep within it.

## Before the demo

- [ ] Run `npm test` and check it passes
- [ ] Open the game from a local server (`python3 -m http.server`) in the browser you will present with
- [ ] Clear `bestScore` in DevTools > Application > Local Storage, so the best score starts empty
- [ ] Record the whole demo once as a backup in case the browser fails

## Order

| # | Part | What to show | Who |
|---|---|---|---|
| 1 | Intro | The game and the goal | TBD |
| 2 | How to play | The "How to play" box, then pick a slot and a color, and use Undo | TBD |
| 3 | A win | Play a few guesses, point out black and white pegs, win. Show the revealed code and the attempt message | TBD |
| 4 | A loss | Press New game and use 10 wrong guesses. Show "You lost!" and the revealed code | TBD |
| 5 | Saved score | Refresh the page. The best score is still there. Show `bestScore` in DevTools > Local Storage | TBD |
| 6 | Code walkthrough | `calculateFeedback()` first (the hardest part), then `game-flow.js` and how the files fit together | TBD |

Tip: while rehearsing you can type `game.secretCode` in the console to see the code. Do not do this during the real demo.

## Code walkthrough notes

- **`calculateFeedback(guess, secret)`**: first count exact matches (black), then match the leftover colors (white). Each peg is used once, which is why duplicate colors work.
- **`gradeLatestGuess()`** (`game-flow.js`): runs after `script.js` stores a valid guess. It gets the feedback, shows the pegs, then calls `checkWin()` before `checkLoss()` so a win on attempt 10 is a win.
- **`blockInputAfterGameEnd()`**: a click listener that runs first and stops clicks once the game is over.
- **`resetGame()`**: calls `startGame()` from `script.js`, then clears the board and puts the messages back.
- **Flow**: click -> `script.js` stores the guess -> `game-flow.js` grades it -> the page shows the result.

## Rehearsal

- [ ] One full run with a timer
- [ ] Run it for a classmate and ask what was unclear
