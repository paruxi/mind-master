# Test checklist (Issue 13)

Run `npm test` for the automated checks. They run the game files in Node with
a fake page, so they cover the game rules but **not** how the page looks in a
real browser.

## Automated (covered by `npm test`)

| Rule from Issue 13 | Where it is tested |
|---|---|
| Feedback is correct with duplicate colors | `tests/feedback.test.js` |
| An incomplete guess is blocked with a message | `script.js` (teammate's code); the guess is not graded: `tests/game-flow.test.js` |
| No input is accepted after win or loss | `tests/game-flow.test.js` ("blockInputAfterGameEnd") |
| New game clears everything and creates a new code | `tests/new-game.test.js` |
| A win on the 10th guess is a win | `tests/game-status.test.js`, `tests/game-flow.test.js` |
| The secret code is revealed only at the end | `tests/board.test.js`, `tests/game-flow.test.js` |
| `index.html` has every element and script the game needs | `tests/page-structure.test.js` |

## Manual (needs a person in a real browser)

Test in Chrome and Firefox with the console open. Ask a teammate to test the part they did not write.

- [ ] The page opens without console errors
- [ ] Click a slot in the lit row, then a color: the color appears and the next slot is selected
- [ ] Undo clears the last color; pressing it on an empty row does nothing
- [ ] Check guess with fewer than 4 colors shows "Pick all 4 colors before check!"
- [ ] Feedback pegs look right: black first, then white
- [ ] The secret code stays hidden until the game ends, then shows the right colors
- [ ] After a win or a loss, clicking the board, palette, Undo and Check guess does nothing
- [ ] New game in the middle of a game and after a game gives an empty board, and the game works normally afterwards
- [ ] Win a game, refresh: the best score is still shown
- [ ] Double-click "Check guess" quickly: only one guess is added
- [ ] The whole game fits on a phone-sized screen

## Brief requirements

TBD: paste the brief's requirements here, one per line, and tick them off.

## Bugs found

These are in `script.js` and are marked `todo` in `tests/known-bugs.test.js`.
Open one GitHub issue for each (Issue 13, step 2).

1. **A bad saved best score stops the game from loading.** `script.js` reads it with
   `JSON.parse(localStorage.getItem("bestScore"))`. A value like `abc`, or an empty
   string, throws an error, so nothing in `script.js` runs. Issue 11 says bad data
   must be treated as "no score". Reproduce: in DevTools > Application > Local Storage
   set `bestScore` to `abc` and refresh.
2. **Submitting the 10th guess throws an error.** `startNextRow()` looks for row 10,
   which does not exist, and fails on `game.currentRow.addEventListener`. The game
   still ends correctly, but the console shows an error.
3. **Best score key and format differ from Issue 11.** The key is `bestScore` (the
   issue says `mastermindBestScore`), and values are not checked to be whole numbers
   from 1 to 10.
4. **Leftover `console.log` calls** in `script.js` (Issue 14).
5. **Cosmetic:** after the game ends, the first slot of the next row still has the
   "selected" highlight.
