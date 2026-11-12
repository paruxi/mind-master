// Uses the `game` object from script.js. game.feedback[i] is the { black, white }
// result for game.guesses[i].
// Call checkWin() before checkLoss(), so a win on the last attempt is a win.

function checkWin() {
  const latestFeedback = game.feedback[game.feedback.length - 1]
  if (!latestFeedback) return

  if (latestFeedback.black === game.secretCode.length) {
    game.status = "won"
  }
}

function checkLoss() {
  if (game.status !== "playing") return

  if (game.guesses.length >= game.maxAttempts) {
    game.status = "lost"
  }
}
