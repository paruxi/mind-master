# GitHub issues for the Mastermind game

Each issue below has a **Title**, a **Labels** line (add these in GitHub), and a **Body** (paste it into the description). `generateSecretCode()` already exists in `script.js`, so it is not repeated here.

## Timeline

| Checkpoint | Dates | Focus |
|---|---|---|
| CP1 | Oct 22 - Oct 27 | Setup and static page (done) |
| CP2 | Oct 28 - Nov 3 | Game logic in small slices: secret code, color picking, submit, feedback, win/lose. One function at a time. |
| CP3 | Nov 4 - Nov 6 | Attempt counter, reset, best score in localStorage, win/lose messages |
| CP4 | Nov 7 - Nov 9 | Test checklist, clean-up, how-to-play box, optional extras |
| CP5 | Nov 10 - Nov 11 | Code freeze, demo run, everyone explains their part |
| Buffer | Nov 12 / Nov 13 | Presentation and final delivery |

## Conventions

- **Branches:** one branch per issue, named `<issue-number>-<short-name>`, for example `5-select-remove-color`.
- **Build order:** 4, 7, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16. Issue 7 comes early because it needs no DOM and Issue 6 depends on it.
- **Status values:** plain strings `"playing"`, `"won"`, `"lost"`. Do not import a `types` file.
- **Palette:** six colors: `red`, `blue`, `green`, `yellow`, `purple`, `orange`.
- **Page elements** (`index.html`): `#board`, `.row[data-row="N"]` (N = 0 to 9), `.guess .peg[data-slot]` (the four color slots in a row), `.feedback .mini` (the four feedback pegs in a row), `#secret`, `#palette` with `.color-btn[data-color]`, `#submit-btn` ("Check guess"), `#undo-btn`, `#new-game-btn`, `#message`. Issue 9 adds `#attempts` and `#best-score`.

## Team and owners

Team members: **TBD**

| Function or part | Issue | Owner |
|---|---|---|
| `generateSecretCode()` | CP1 (done) | Done |
| `startGame()` | 4 | TBD |
| `selectColor()`, `removeColor()`, `renderCurrentGuess()`, Undo | 5 | TBD |
| `submitGuess()`, `showMessage()` | 6 | TBD |
| `calculateFeedback()` | 7 | TBD |
| `checkWin()`, `checkLoss()`, `renderBoard()` | 8 | TBD |
| `updateScoreDisplay()` | 9 | TBD |
| `resetGame()` | 10 | TBD |
| `loadBestScore()`, `saveBestScore()` | 11 | TBD |
| Win and loss messages, CSS classes | 12 | TBD |
| Test checklist | 13 | TBD |
| Clean-up | 14 | TBD |
| How-to-play box | 15 | TBD |
| Optional extra | 16 | TBD |
| README and v1.0 tag | 17 | TBD |
| Demo | 18 | TBD |

**Brief requirements:** TBD. Paste the brief's requirements into Issue 13 so the checklist can be ticked off.

---

# CP1: Setup and static page (Oct 22 - Oct 27) - Done

Delivered: repo, `index.html`, `style.css`, `script.js`, the palette and board layout, and the `Assets` folder. No issues are listed for CP1.

---

# CP2: Game logic in small slices (Oct 28 - Nov 3)

---

## Issue 4

**Title:** Create the game object and startGame()
**Labels:** `CP2`, `must have`

### Summary

Create one object that holds all round data, and a `startGame()` function that sets up a new round. The object already exists in `script.js`. This issue makes it match this plan.

### Why

Everything else (guesses, feedback, score) reads from this object. If the structure is agreed on early, three people can write functions that fit together.

### What to build

A `game` object and a `startGame()` function in `script.js`.

```js
const game = {
  secretCode: [],
  guesses: [],
  currentGuess: [],
  maxAttempts: 10,
  status: "playing",
  bestScore: null
};
```

### Rules

- `status` is one of `"playing"`, `"won"`, `"lost"` (plain strings)
- `startGame()` resets everything that belongs to one round, but keeps `bestScore`
- `startGame()` creates the secret code with `generateSecretCode()`
- `generateSecretCode()` appends to `game.secretCode`, so `startGame()` must empty that array first

### Steps

1. Remove the `import ... from "./types"` line and the `if (game.status !== ...)` block at the bottom of `script.js`
2. Write `startGame()`: set `game.secretCode = []`, call `generateSecretCode()`, empty `guesses` and `currentGuess`, set `status` to `"playing"`. Do not change `bestScore`.
3. Call `startGame()` once when the page loads. If Issue 11 is done, call `loadBestScore()` before it.
4. Agree as a team on these field names before anyone writes other functions

### Acceptance criteria

- [x] `game` has the agreed fields and plain-string status
- [x] `startGame()` gives a fresh round every time it is called
- [x] After each call, `secretCode` has exactly 4 colors from the six-color palette
- [x] The page loads without errors and calls `startGame()` on load
- [x] The whole team has approved the field names

### How to test

After loading, run `console.log(game)`. Call `startGame()` again and check that `secretCode` still has 4 colors (not 8), `guesses` and `currentGuess` are empty, and `status` is `"playing"`. Do not expect the code itself to change every time: there is a 1 in 1296 chance it stays the same.

### Notes for beginners

- Estimated time: 1-2 hours
- Pair with a teammate on this one, because the other tasks depend on it.

### Checkpoint

CP2: Game logic

---

## Issue 5

**Title:** Pick and remove colors for the current guess (selectColor, removeColor, Undo)
**Labels:** `CP2`, `must have`, `good first task`

### Summary

Let the player click a color in the palette to add it to the current guess, click a filled slot to remove it, and use Undo to remove the last color.

### Why

This is how the player builds a guess. It is also the first use of DOM events in the project.

### What to build

`selectColor(color)`, `removeColor(index)` and `renderCurrentGuess()`, plus click listeners on the palette buttons, the filled slots in the current row, and `#undo-btn`.

### Rules

- The current guess can hold at most 4 colors
- Clicking a color when the guess is full does nothing
- Nothing can be picked when `game.status` is not `"playing"`
- Duplicate colors are allowed
- The current row is `.row[data-row="N"]`, where `N = game.guesses.length`

### Steps

1. Add a click listener to each `.color-btn`. Its `data-color` gives the color. The listener calls `selectColor(color)`.
2. In `selectColor`, check the status and that there is room, then `push` the color to `game.currentGuess`
3. In `removeColor`, remove the color at that index with `splice`
4. Add a click listener to `#undo-btn` that removes the last color with `pop()`
5. In `renderCurrentGuess`, update the current row's slots from `game.currentGuess`. Empty slots stay empty.

### Acceptance criteria

- [ ] Clicking a palette color fills the next empty slot
- [ ] A fifth color is not added
- [ ] Clicking a filled slot removes that color
- [ ] Undo removes the last color, and does nothing when the row is empty
- [ ] The same color can be used more than once

### How to test

Click colors until the row is full, click once more, then remove a color and check that the row updates. Press Undo until the row is empty.

### Notes for beginners

- Estimated time: 2-3 hours
- Useful to read: `addEventListener`, `dataset`, `array.push()`, `array.splice()`, `array.pop()`, `classList`

### Checkpoint

CP2: Game logic

---

## Issue 6

**Title:** Write submitGuess() with validation
**Labels:** `CP2`, `must have`

### Summary

When the player presses "Check guess", check that the guess is complete, store it, and move to the next attempt.

### Why

This function connects picking colors with feedback and win/lose, so it is the center of the game loop.

### What to build

`submitGuess()` and `showMessage(text, type)` in `script.js`. `submitGuess()` is called by `#submit-btn`. `showMessage` is written here so the incomplete-guess message works in CP2. Issue 12 adds the win and lose messages and styling.

### Rules

- A guess with fewer than 4 colors is rejected with a message
- Submitting does nothing if the game is already won or lost
- Each stored guess looks like `{ code: [...], black: 0, white: 0 }`
- The stored `code` is a copy (`[...game.currentGuess]`). Then set `game.currentGuess = []`. If `code` shared the same array, clearing the current guess would also empty the stored guess.

### Steps

1. Add a click listener to `#submit-btn`
2. Check `game.status` and the length of `currentGuess`. If invalid, call `showMessage(...)` and stop.
3. Call `calculateFeedback(game.currentGuess, game.secretCode)` (Issue 7)
4. Push `{ code: [...game.currentGuess], black, white }` into `game.guesses`, then set `game.currentGuess = []`
5. Call `checkWin()` first, then `checkLoss()` only if the game is still `"playing"`, then `renderBoard()`, `renderCurrentGuess()` and `updateScoreDisplay()` (Issues 8 and 9)

### Acceptance criteria

- [ ] An incomplete guess shows a message and is not stored
- [ ] A valid guess is stored with its feedback
- [ ] The current row is cleared after submitting
- [ ] Double-clicking Submit does not add two guesses. A second click sees an empty row and shows the incomplete-guess message, which is acceptable.

### How to test

Try submitting with 0, 3 and 4 colors, then double-click Submit.

### Notes for beginners

- Estimated time: 2-3 hours
- Pair with the person who writes `calculateFeedback()`.
- Depends on Issue 7. Until Issues 8 and 9 are done, run steps 1 to 4 and check the result in the console.

### Checkpoint

CP2: Game logic

---

## Issue 7

**Title:** Write calculateFeedback() for black and white pegs
**Labels:** `CP2`, `must have`, `hard`, `pair-programming`

### Summary

Compare a guess with the secret code and return how many colors are right in the right place (black) and right color in the wrong place (white).

### Why

This is the core rule of the game, and the trickiest part because of duplicate colors. It must be right before anything else is trusted. It needs no DOM, so it is the first issue to build.

### What to build

`calculateFeedback(guess, secret)` that returns `{ black, white }`.

### Rules

- **Black** = same color in the same position
- **White** = a color that is in the secret code but in a different position
- A peg in the secret code can only be counted once (no reusing)
- Count black first, then white using the leftover colors
- The function does not change the `guess` or `secret` arrays

### Steps

1. Create two boolean arrays, `usedSecret` and `usedGuess`, each with 4 `false` values
2. Loop through the positions. If `guess[i] === secret[i]`, count a black and set `usedSecret[i]` and `usedGuess[i]` to `true`
3. Loop through the positions where `usedGuess` is `false`. For each, look for the same color at a position where `usedSecret` is `false`. If found, count a white and mark both positions as used.
4. Return `{ black, white }`

### Acceptance criteria

- [ ] Secret `red red blue green` and guess `red blue red red` gives black 1, white 2
- [ ] Secret `red blue green yellow` and guess `red blue green yellow` gives black 4, white 0
- [ ] Secret `red red red red` and guess `blue blue blue blue` gives black 0, white 0
- [ ] Secret `red blue green yellow` and guess `yellow green blue red` gives black 0, white 4
- [ ] Black and white together never exceed 4
- [ ] The input arrays are not changed

### How to test

Test these cases in the console before building any UI, for example `console.log(calculateFeedback(["red","blue","red","red"], ["red","red","blue","green"]))`.

### Notes for beginners

- Estimated time: 3-5 hours
- Work in pairs: one person types, one reads and thinks, then swap.
- Draw the examples on paper first.

### Checkpoint

CP2: Game logic

---

## Issue 8

**Title:** Detect win and loss, and show the board (checkWin, checkLoss, renderBoard)
**Labels:** `CP2`, `must have`

### Summary

Decide when the game is won or lost, and draw all previous guesses with their feedback on the board.

### Why

The brief requires a way to win and lose, and the player must see their progress.

### What to build

`checkWin()`, `checkLoss()` and `renderBoard()`. `renderBoard()` fills each row `.row[data-row="N"]` with the four colors in `.guess .peg` and the feedback in `.feedback .mini` (black pegs first, then white, then empty).

### Rules

- Win: the latest guess has 4 black pegs. Set `game.status = "won"`.
- Loss: the player has used all attempts (`game.guesses.length === game.maxAttempts`) without winning. Set `game.status = "lost"`.
- A win on the 10th guess is a win, not a loss. Check the win first.
- When the game ends, reveal the secret code in `#secret` (remove the `hidden` class and set each peg's color)
- After the game ends, no more input is accepted (Issues 5 and 6 check the status)

### Steps

1. Write `checkWin()` that looks at the last guess
2. Write `checkLoss()` that compares `game.guesses.length` to `game.maxAttempts`. It only sets `"lost"` when the game is still `"playing"`.
3. Write `renderBoard()` that loops through `game.guesses` and fills each row
4. Reveal the secret code when the status becomes `"won"` or `"lost"`
5. The calls after each guess are listed in Issue 6, step 5. Do not add them a second time.

### Acceptance criteria

- [ ] The game is won when the guess matches the secret code
- [ ] The game is lost after the 10th wrong guess
- [ ] A win on the 10th guess is shown as a win
- [ ] Every previous guess appears with its feedback
- [ ] The secret code is revealed only at the end

### How to test

Temporarily log the secret code, win on purpose, then play a game with only wrong guesses. Remove the log before committing (Issue 14).

### Notes for beginners

- Estimated time: 3-4 hours
- Useful to read: `forEach`, `classList`, `textContent`

### Checkpoint

CP2: Game logic

---

# CP3: Score and storage (Nov 4 - Nov 6)

---

## Issue 9

**Title:** Show the attempt counter and best score
**Labels:** `CP3`, `must have`, `good first task`

### Summary

Show the player which attempt they are on, for example "Attempt 3 of 10", and show the best score.

### Why

The brief requires the current score or progress to be visible. Attempts are also the game's score.

### What to build

`updateScoreDisplay()` that writes to two elements that do not exist yet in `index.html`: `#attempts` and `#best-score`.

### Rules

- While playing, the counter shows `"Attempt N of 10"`, where `N = game.guesses.length + 1`. At the start it shows "Attempt 1 of 10".
- After the game is won, it shows `"Solved in N attempts"`. After the game is lost, it shows `"Lost after 10 attempts"`.
- `#best-score` shows `"Best: N"`, or `"Best: No score yet"` when `game.bestScore` is `null`
- The counter never shows more than 10 attempts

### Steps

1. Add `<span id="attempts"></span>` and `<p id="best-score"></p>` to `index.html`, under the title
2. Write `updateScoreDisplay()` using the rules above, with `textContent`
3. Call it after every guess, on a new game, and on page load

### Acceptance criteria

- [ ] The counter starts at "Attempt 1 of 10"
- [ ] The counter updates after each valid guess
- [ ] It never shows more than 10 attempts
- [ ] It resets on a new game
- [ ] The best score text is shown on page load

### How to test

Play a full game and watch the counter, then press New game.

### Notes for beginners

- Estimated time: 1 hour
- Useful to read: `textContent`, template strings

### Checkpoint

CP3: Score and storage

---

## Issue 10

**Title:** Write resetGame() and connect the New game button
**Labels:** `CP3`, `must have`, `good first task`

### Summary

Let the player start a new round at any time, even in the middle of a game.

### Why

The brief requires a way to start a new game or reset the current one.

### What to build

`resetGame()`, connected to `#new-game-btn`. It calls `startGame()`, then re-draws the page from `game`. It does not clear the DOM by hand.

### Rules

- Keeps the best score
- Clears the board, current guess, message and attempt counter (through the render functions)
- Creates a new secret code and hides the secret code again
- Unlike `startGame()`, `resetGame()` also updates the page

### Steps

1. Add a click listener to `#new-game-btn`
2. Call `startGame()`
3. Call `renderBoard()`, `renderCurrentGuess()` and `updateScoreDisplay()`, and hide the secret code again
4. Reset `#message` to the default text from `index.html` ("Pick 4 colors, then check your guess.")

### Acceptance criteria

- [ ] Pressing New game mid-game gives an empty board
- [ ] The secret code changes
- [ ] The best score stays the same
- [ ] The secret code is hidden again until the end
- [ ] The game works normally afterwards

### How to test

Play two guesses, press New game, then play to the end.

### Notes for beginners

- Estimated time: 1-2 hours
- Depends on Issues 4 and 9.

### Checkpoint

CP3: Score and storage

---

## Issue 11

**Title:** Save, compare and load the best score with localStorage
**Labels:** `CP3`, `must have`

### Summary

Store the player's best score (the fewest attempts needed to win) in the browser, so it survives a page refresh.

### Why

The brief requires storing, retrieving, comparing and updating a high score in browser storage.

### What to build

`loadBestScore()` and `saveBestScore(attempts)`.

### Rules

- Lower is better: the best score is the fewest attempts in a win
- Only update when the new score beats the old one, or when no score exists
- `saveBestScore` returns `true` when it saved a new best, and `false` otherwise. Issue 12 uses this.
- `loadBestScore()` runs on page load, before `startGame()`
- The storage key is `"mastermindBestScore"`
- Empty or invalid stored data is treated as "no score" and must not crash the game
- A stored value only counts if it is a whole number from 1 to 10

### Steps

1. Use the key `"mastermindBestScore"`
2. In `loadBestScore()`, read with `localStorage.getItem`. If the result is `null` or `""`, set `game.bestScore = null`. Otherwise convert with `Number`, and set `null` if the result is not a whole number from 1 to 10. Careful: `Number(null)` is `0`, and a best score of 0 can never be beaten.
3. In `saveBestScore(attempts)`, if `game.bestScore === null || attempts < game.bestScore`, set `game.bestScore`, save with `localStorage.setItem`, and return `true`. Otherwise return `false`.
4. Call `saveBestScore(game.guesses.length)` when the game is won, before the win message is shown (Issue 12)
5. Show the value with `updateScoreDisplay()`

### Acceptance criteria

- [ ] Winning in 6 attempts saves 6 when there is no previous score
- [ ] Winning in 8 attempts later does not replace 6
- [ ] Winning in 4 attempts replaces 6
- [ ] Refreshing the page keeps the best score
- [ ] Clearing localStorage shows "Best: No score yet" without errors
- [ ] A corrupted value such as `"abc"` is ignored without errors

### How to test

Win a game, refresh, then check DevTools under Application > Local Storage. Clear the key, refresh, and check the empty state. Set the value to `abc`, refresh, and check the page still works.

### Notes for beginners

- Estimated time: 2-3 hours
- Useful to read: `localStorage.getItem`, `setItem`, `Number()`, `Number.isInteger()`

### Checkpoint

CP3: Score and storage

---

## Issue 12

**Title:** Show clear win and lose messages
**Labels:** `CP3`, `must have`, `good first task`

### Summary

Tell the player clearly when they won or lost, and point to the secret code.

### Why

The brief requires clear feedback when the game ends.

### What to build

Extend `showMessage(text, type)` (created in Issue 6) so `type` is `"win"`, `"lose"` or `"info"`, and add CSS classes for win and lose.

### Rules

- Win: `"Solved in N attempts."`. If `saveBestScore()` returned `true`, add `"New best score!"`.
- Loss: `"Game over. The secret code is shown above."`
- Messages for invalid actions (Issue 6) use the same area with the default style

### Steps

1. Extend `showMessage(text, type)` in `script.js` so it sets a class on `#message` for each type
2. In the win logic, call `saveBestScore()` first, then `showMessage()` with the win text
3. In the loss logic, call `showMessage()` with the loss text
4. Add `.message-win` (green) and `.message-lose` (red) rules to `style.css`

### Acceptance criteria

- [ ] Winning shows a message with the number of attempts
- [ ] "New best score!" appears only when a new best is saved
- [ ] Losing shows the message and the secret code is revealed
- [ ] The message resets to the default text on a new game

### How to test

Win a game, lose a game, submit an incomplete guess, and win again with a worse score (no "New best score!" text).

### Notes for beginners

- Estimated time: 1-2 hours

### Checkpoint

CP3: Score and storage

---

# CP4: Testing and polish (Nov 7 - Nov 9)

---

## Issue 13

**Title:** Run the full test checklist and fix bugs
**Labels:** `CP4`, `must have`, `testing`

### Summary

Test every rule of the game and every item in the brief, and fix what fails.

### Why

A small game that works is better than a big one with bugs. This is where the team confirms that.

### What to build

A tested game and a list of results, with one new issue for each bug found.

### Rules

- Test in Chrome and Firefox (default; change if the team agrees otherwise)
- Each teammate tests a part they did not write
- Test from a local server (see Issue 17)

### Steps

1. Go through the checklist below
2. Write each failed test as a new issue with steps to reproduce
3. Fix the bugs and test again

### Acceptance criteria

- [ ] Feedback is correct with duplicate colors
- [ ] An incomplete guess is blocked with a message
- [ ] No input is accepted after win or loss
- [ ] New game clears everything and creates a new code
- [ ] The best score only updates when beaten and survives a refresh
- [ ] Empty or corrupted localStorage does not crash the game
- [ ] Rapid clicks on Submit do not add two guesses
- [ ] Every requirement in the brief is ticked off

### Brief requirements

- TBD: paste the brief's requirements here, one per line.

### How to test

Use the checklist above. Keep the console open to catch errors.

### Notes for beginners

- Estimated time: 3-4 hours, split between the team
- Testing someone else's code is a good way to learn it.

### Checkpoint

CP4: Testing and polish

---

## Issue 14

**Title:** Clean up the code
**Labels:** `CP4`, `must have`

### Summary

Make the code readable, remove repetition, and make sure names are meaningful.

### Why

The brief grades code structure, and everyone must be able to explain the code in the presentation.

### What to build

A cleaned `script.js`, `style.css` and `index.html`.

### Rules

- Each function has one job
- No unused code, no commented-out experiments
- Names say what things are (`calculateFeedback`, not `calc2`)
- Test `console.log` lines are removed

### Steps

1. Read through each file as a team
2. Remove the known leftovers: the `import` from `./types` (if it is still there), the `// function gameStart() {}` stub, the `console.log(game.secretCode)` at the bottom of `script.js`, and any `console.log` added during testing
3. Rename unclear variables and functions
4. Merge repeated code into functions
5. Add short comments only where the logic is hard (for example in `calculateFeedback`)
6. Test the game again after the changes

### Acceptance criteria

- [ ] No unused code or leftover `console.log`
- [ ] Every function name describes what it does
- [ ] The game still works after cleanup

### How to test

Play a full game and run through the Issue 13 checklist quickly.

### Notes for beginners

- Estimated time: 2 hours

### Checkpoint

CP4: Testing and polish

---

## Issue 15

**Title:** Write the "How to play" box
**Labels:** `CP4`, `must have`, `good first task`

### Summary

Add a short explanation of the rules so a new player understands the game without help.

### Why

The brief says the player should understand how to play.

### What to build

Replace the existing `<p class="rules">` in `index.html` with a short "How to play" box. The current text explains the pegs in two sentences. The box must cover the goal, the six colors, the black and white pegs, and the 10 attempts.

### Rules

- Maximum 5 short lines
- Written in plain language
- Explain black and white pegs clearly

### Steps

1. Write the text on paper first
2. Replace the text of `<p class="rules">` in `index.html` with the box
3. Style it in `style.css` so it is easy to read
4. Ask someone outside the team to read it and tell you what they understand

### Acceptance criteria

- [ ] The goal and both peg types are explained
- [ ] It fits on screen without scrolling
- [ ] A person who has never seen the game can start playing

### How to test

Ask a classmate to play using only the text.

### Notes for beginners

- Estimated time: 1 hour

### Checkpoint

CP4: Testing and polish

---

## Issue 16

**Title:** Optional extras (only if everything else is done)
**Labels:** `CP4`, `could have`

### Summary

Add one small improvement, only after Issues 13 and 14 are finished.

### Why

Extras make the game nicer, but they are never worth risking a working game.

### What to build

Choose **one**: difficulty levels, symbols on the pegs for colorblind players, a hint button, sound with a mute toggle, or a responsive layout for phones.

### Rules

- Start only when the checklist passes
- Work on a branch named `16-<extra-name>` and merge only if it works
- If it is not finished by Nov 9, drop it

### Steps

1. Pick one extra as a team
2. Create the branch
3. Build it, test it, and merge it only if nothing else breaks

### Acceptance criteria

- [ ] The extra works and the core game still passes the test checklist
- [ ] The code is clean and understood by the whole team

### How to test

Repeat the Issue 13 checklist after merging.

### Notes for beginners

- Estimated time: 2-4 hours, depending on the option

### Checkpoint

CP4: Testing and polish

---

# CP5: Freeze and rehearse (Nov 10 - Nov 11)

---

## Issue 17

**Title:** Code freeze on Nov 11
**Labels:** `CP5`, `must have`

### Summary

Stop changing the code, and make sure the final version is the one that gets presented.

### Why

Last-minute changes cause last-minute bugs.

### What to build

A final, tagged version of the repo, with an updated README.

### Rules

- After the freeze, only fix bugs that break the game, and tell the team first
- No new features

### Steps

1. Make sure all branches are merged and the main branch works
2. Check that the repo contains `index.html`, `script.js`, `style.css` and `README.md`
3. Update `README.md` (currently only a title): project name, how to run the game, and team members
4. Create a Git tag or release named `v1.0`
5. Everyone pulls the final version and confirms it runs

### Acceptance criteria

- [ ] The main branch has the final code
- [ ] `README.md` explains how to run the game
- [ ] All three teammates have run the final version
- [ ] A `v1.0` tag exists

### How to test

Clone the repo into a new folder and start a local server in that folder (for example VS Code's Live Server, or `python3 -m http.server`). Open the page through the server. Opening `index.html` directly from the file system does not work, because the game script loads as a module.

### Notes for beginners

- Estimated time: 1 hour

### Checkpoint

CP5: Freeze and rehearse

---

## Issue 18

**Title:** Prepare and rehearse the demo
**Labels:** `CP5`, `must have`

### Summary

Prepare a short demo that shows the game and the code, and practise it once.

### Why

The presentation is on Nov 12, and Nov 13 is the buffer for final delivery. A clear demo shows that the game works and that the team understands it.

### What to build

A demo script of the order you will present things in, and one full rehearsal.

### Rules

- The demo shows a win, a loss, and the best score surviving a refresh
- Each teammate speaks about their own part (see Team and owners)
- Time limit: TBD. Confirm it with the course and keep within it.

### Steps

1. Write the order: intro, how to play, a win, a loss, refresh to show the saved score, code walkthrough
2. Decide who presents each part
3. Do one full run with a timer
4. Make a backup plan (for example a screen recording) in case the browser or internet fails

### Acceptance criteria

- [ ] The demo covers every requirement in the brief
- [ ] One full rehearsal is done
- [ ] A backup is ready

### How to test

Run the demo for a classmate and ask what was unclear.

### Notes for beginners

- Estimated time: 2 hours

### Checkpoint

CP5: Freeze and rehearse

---

## Issue 19

**Title:** Everyone can explain their own functions
**Labels:** `CP5`, `must have`

### Summary

Each teammate prepares to explain at least two functions in their own words.

### Why

The brief's final advice is to build something you understand and can explain.

### What to build

A short explanation (about one minute each) of two functions per person. Pick functions from the Team and owners table.

### Rules

- Cover what the function does, what it receives, what it returns, and where it is used
- Everyone also knows the overall flow of the game

### Steps

1. Each person picks two functions they wrote or worked on
2. Write 3 or 4 bullet points about each
3. Explain them to a teammate and answer their questions
4. Swap, so each person has also heard the hardest function (`calculateFeedback`) explained

### Acceptance criteria

- [ ] Each teammate has explained two functions to the team
- [ ] Each teammate can describe the `calculateFeedback()` logic in simple words

### How to test

A teammate asks "why did you write it this way?" and the author can answer.

### Notes for beginners

- Estimated time: 1-2 hours

### Checkpoint

CP5: Freeze and rehearse
