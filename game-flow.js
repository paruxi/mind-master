// Loaded after script.js. The submit handler in script.js stores a valid guess
// in game.guesses; this file then gives it feedback pegs, ends the game when it
// is won or lost, and blocks all input once the game is over.
// Uses `game` and `codeColors` from script.js.

// game.feedback[i] is the { black, white } result for game.guesses[i].
game.feedback = []

const INPUT_SELECTORS = "#palette, #board, #submit-btn, #undo-btn"

function gradeLatestGuess() {
  // An incomplete guess was rejected by script.js, so there is nothing new to grade.
  if (game.guesses.length === game.feedback.length) return

  const rowNumber = game.guesses.length - 1
  const feedback = calculateFeedback(game.guesses[rowNumber], game.secretCode)

  game.feedback.push(feedback)
  renderFeedback(rowNumber, feedback)

  checkWin()
  checkLoss()
  renderSecret()
  renderAttemptProgress()
}

// Runs before any other click listener (capture phase) and stops the click
// from reaching the board, palette and buttons when the game is over.
function blockInputAfterGameEnd(event) {
  if (game.status === "playing") return

  if (event.target.closest(INPUT_SELECTORS)) {
    event.stopPropagation()
  }
}

document.addEventListener("click", blockInputAfterGameEnd, true)
document.getElementById("submit-btn").addEventListener("click", gradeLatestGuess)
