// Loaded after the other game files. When a round ends it locks the controls,
// plays the win or lose effect and opens the result panel. Play again starts a new round.
// Uses `game` and bestScore from script.js, setPegColor() from board.js, setClass() from attempt-progress.js
// and resetGame() from new-game.js.

const CONTROL_SELECTORS = "#palette .color-btn, #undo-btn, #submit-btn"

// The words and symbol the panel shows for a finished round.
function resultContent(status, attemptsUsed, bestScore, isNewBest) {
  if (status === "won") {
    const unit = attemptsUsed === 1 ? "attempt" : "attempts"
    return {
      icon: "★",
      title: "You cracked it!",
      text: `Solved in ${attemptsUsed} ${unit}.`,
      best: isNewBest ? "New best score!" : `Best score: ${bestScore} attempts`,
    }
  }

  return {
    icon: "✕",
    title: "Out of attempts",
    text: "The secret code was:",
    best: "",
  }
}

function setControlsDisabled(isDisabled) {
  document.querySelectorAll(CONTROL_SELECTORS).forEach((control) => {
    control.disabled = isDisabled
  })
}

function fillResultPanel(content) {
  document.getElementById("result-icon").textContent = content.icon
  document.getElementById("result-title").textContent = content.title
  document.getElementById("result-text").textContent = content.text
  document.getElementById("result-best").textContent = content.best

  document.querySelectorAll("#result-code .peg").forEach((peg, index) => {
    setPegColor(peg, game.secretCode[index])
  })
}

// Makes the page match game.status: locked with a result panel when the round is over, normal otherwise.
function renderResult() {
  const isOver = game.status !== "playing"
  const panel = document.getElementById("result-panel")
  const main = document.querySelector(".game")

  setControlsDisabled(isOver)
  setClass(main, "result-won", game.status === "won")
  setClass(main, "result-lost", game.status === "lost")

  if (!isOver) {
    if (panel.open) panel.close()
    return
  }

  if (panel.open) return

  const content = resultContent(game.status, game.guesses.length, bestScore, game.newBest)
  fillResultPanel(content)
  document.getElementById("result-announcement").textContent = `${content.title} ${content.text} ${content.best}`
  panel.showModal()
}

function playAgain() {
  resetGame()
  renderResult()
}

// These listeners are added after the ones in game-flow.js, new-game.js and reset-data.js,
// so game.status is already up to date when renderResult() runs.
document.getElementById("submit-btn").addEventListener("click", renderResult)
document.getElementById("new-game-btn").addEventListener("click", renderResult)
document.getElementById("reset-data-btn").addEventListener("click", renderResult)
document.getElementById("play-again-btn").addEventListener("click", playAgain)
