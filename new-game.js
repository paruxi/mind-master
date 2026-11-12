// Loaded after script.js. Starts a fresh round at any time.
// Uses startGame(), clickController, attemptsNumber and game from script.js.

const DEFAULT_MESSAGE = "Pick 4 colors, then check your guess."

function resetMessages() {
  const message = document.getElementById("message")
  const attemptMessage = document.getElementById("attemptMessage")

  message.textContent = DEFAULT_MESSAGE
  message.style.color = ""

  // script.js replaces this text when the game ends, which removes the number from it.
  // Put the same #attemptsNumber element back so script.js can keep updating it.
  attemptMessage.style.color = ""
  attemptMessage.replaceChildren("Attempt ", attemptsNumber, " /10")
  attemptsNumber.textContent = " 1 "
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
}

document.getElementById("new-game-btn").addEventListener("click", resetGame)
