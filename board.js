// Draws the feedback pegs and the secret code.
// Uses `game` and `codeColors` from script.js.

// Black pegs first, then white, then empty: feedbackClasses(1, 2, 4) is ["hit", "near", "near", ""]
function feedbackClasses(black, white, slots) {
  const classes = []

  for (let i = 0; i < slots; i++) {
    if (i < black) {
      classes.push("hit")
    } else if (i < black + white) {
      classes.push("near")
    } else {
      classes.push("")
    }
  }

  return classes
}

function setPegColor(peg, color) {
  codeColors.forEach((name) => peg.classList.remove(name))

  if (color) {
    peg.classList.add(color)
  }
}

function setFeedbackPeg(mini, feedbackClass) {
  mini.classList.remove("hit")
  mini.classList.remove("near")

  if (feedbackClass) {
    mini.classList.add(feedbackClass)
  }
}

// Shows the black and white pegs for one row. `feedback` is { black, white }.
function renderFeedback(rowNumber, feedback) {
  const row = document.querySelector(`.row[data-row="${rowNumber}"]`)
  if (!row) return

  const minis = row.querySelectorAll(".feedback .mini")
  const classes = feedbackClasses(feedback.black, feedback.white, minis.length)

  minis.forEach((mini, index) => setFeedbackPeg(mini, classes[index]))
}

// Shows the secret code once the game is over, and hides it again while playing.
function renderSecret() {
  const pegs = document.querySelectorAll("#secret .peg")
  const isOver = game.status !== "playing"

  pegs.forEach((peg, index) => {
    if (isOver) {
      peg.classList.remove("hidden")
      setPegColor(peg, game.secretCode[index])
    } else {
      setPegColor(peg, null)
      peg.classList.add("hidden")
    }
  })
}
