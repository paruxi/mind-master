// Loaded after script.js. Starts a fresh round at any time.
// Uses startGame(), clickController and game from script.js.

const DEFAULT_MESSAGE = "Pick 4 colors, then check your guess."

// script.js replaces the text of #attemptMessage when the game ends.
// Keep what was there at the start, so it can be put back.
const attemptMessageContent = [...document.getElementById("attemptMessage").childNodes]

function resetMessages() {
  const message = document.getElementById("message")
  const attemptMessage = document.getElementById("attemptMessage")

  message.textContent = DEFAULT_MESSAGE
  message.style.color = ""

  // The same nodes go back, so #attemptsNumber is the element script.js keeps updating.
  attemptMessage.style.color = ""
  attemptMessage.replaceChildren(...attemptMessageContent)
  document.getElementById("attemptsNumber").textContent = "1"
}

function resetGame() {
  // Remove the click listener of the row being played, or two rows would react to clicks.
  clickController.abort()
  clickController = new AbortController()

  startGame()
  game.feedback = []
  game.selectedPeg = null

  clearBoard()
  renderSecret()
  resetMessages()
  renderAttemptProgress()
}

document.getElementById("new-game-btn").addEventListener("click", resetGame)
