// Shows where the player is: the progress bar under the title and the lit row on the board.
// Uses the `game` object from script.js.

// One state per attempt: "done" (played), "current" (being played) or "" (still to come).
function progressStates(attemptsUsed, status, totalAttempts) {
  return Array.from({ length: totalAttempts }, (_, index) => {
    if (index < attemptsUsed) return "done"
    if (index === attemptsUsed && status === "playing") return "current"
    return ""
  })
}

function setClass(element, className, isOn) {
  if (isOn) {
    element.classList.add(className)
  } else {
    element.classList.remove(className)
  }
}

function renderAttemptProgress() {
  const states = progressStates(game.guesses.length, game.status, game.maxAttempts)

  document.querySelectorAll("#progress .progress-step").forEach((step, index) => {
    setClass(step, "done", states[index] === "done")
    setClass(step, "current", states[index] === "current")
  })

  document.querySelectorAll(".row").forEach((row, index) => {
    setClass(row, "active", states[index] === "current")
  })
}

renderAttemptProgress()
