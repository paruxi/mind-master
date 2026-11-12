// Loaded after new-game.js. The reset button erases the saved data and starts a fresh game.
// Uses BEST_SCORE_KEY, bestScore and scoreCounter from script.js, and resetGame() from new-game.js.

const STORAGE_KEYS = [BEST_SCORE_KEY]
const NO_SCORE_TEXT = "No score yet"
const CONFIRM_TEXT = "Reset the game and erase your saved best score?"

function clearSavedData() {
  // Storage can be blocked (for example in private mode), so a failure must not stop the reset.
  try {
    STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.log("Could not clear saved data:", error)
  }
}

function resetSavedGame() {
  if (!confirm(CONFIRM_TEXT)) return

  clearSavedData()
  bestScore = null
  game.bestScore = null
  scoreCounter.textContent = NO_SCORE_TEXT
  resetGame()
}

document.getElementById("reset-data-btn").addEventListener("click", resetSavedGame)
