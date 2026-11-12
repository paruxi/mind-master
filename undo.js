// Loaded after script.js. The Undo button clears the last filled slot of the current row.
// Uses `game` from script.js: game.currentGuess has one color per slot, and
// game.currentRow is the row being played.

// Returns the position of the last slot that has a color, or -1 when the row is empty.
function lastFilledSlot(currentGuess) {
  for (let i = currentGuess.length - 1; i >= 0; i--) {
    if (currentGuess[i]) return i
  }

  return -1
}

function undoLastColor() {
  if (game.status !== "playing") return

  const slot = lastFilledSlot(game.currentGuess)
  if (slot === -1) return

  // Cut the guess back to the slots before this one, so it is never longer than the colors picked.
  game.currentGuess.length = slot

  const pegs = [...game.currentRow.querySelectorAll(".guess .peg")]
  pegs.forEach((peg) => peg.classList.remove("selected-peg"))

  const peg = pegs[slot]
  peg.style.background = ""
  delete peg.dataset.color
  peg.classList.add("selected-peg")
  game.selectedPeg = peg
}

document.getElementById("undo-btn").addEventListener("click", undoLastColor)
