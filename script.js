const codeColors = ["red", "blue", "green", "yellow", "purple", "orange"]

const CODE_LENGTH = 4

// All the data for the current game lives in this one object.
const game = {
  secretCode: [],
  guesses: [],
  currentGuess: [],
  maxAttempts: 10,
  status: "playing",
  bestScore: null,
  selectedPeg: null,
  currentRow: null,
}
const guess = document.querySelector(".guess")
const colorButton = document.querySelector(".color-btn")
const palette = document.getElementById("palette")
const submit = document.getElementById("submit-btn")
const message = document.getElementById("message")

// Returns a brand-new array with CODE_LENGTH random colors.
// Each position is picked on its own, so the same color can appear more than once.
function generateSecretCode() {
  const code = []

  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * codeColors.length)
    code.push(codeColors[randomIndex])
  }

  return code
}

function startGame() {
  game.secretCode = generateSecretCode()
  game.guesses = []
  game.currentGuess = []
  game.status = "playing"
  game.currentRow = document.querySelector('div.row[data-row="0"]')
  game.currentRow.addEventListener(
    "click",
    function (event) {
      onClickCurrentRow(event)
    },
    { signal: clickController.signal },
  )
}

// guess.addEventListener("click", function (event) {
//   const choice = event.target.closest(".peg")
//   if (!choice) return
//   selectedPeg.forEach((el) => el.classList.remove("selected-peg"))
//   choice.classList.toggle("selected-peg")
//   game.selectedPeg = choice
//   console.log(choice.dataset.slot)
// })

function onClickCurrentRow(event) {
  const choice = event.target.closest(".peg")
  console.log("choice:", choice)
  if (!choice) return
  const rowPegs = game.currentRow.querySelectorAll(".peg")
  rowPegs.forEach((el) => el.classList.remove("selected-peg"))
  choice.classList.toggle("selected-peg")
  game.selectedPeg = choice
  console.log(choice.dataset.slot)
}

palette.addEventListener("click", function (event) {
  const colorPicker = event.target.closest(".color-btn")
  if (!colorPicker) return
  if (!game.selectedPeg) return
  console.log(colorPicker.dataset.color)
  const color = colorPicker.dataset.color

  game.selectedPeg.style.background = `var(--${color})`
  game.selectedPeg.dataset.color = color
  console.log(color)
  const index = Number(game.selectedPeg.dataset.slot)
  game.currentGuess[index] = color
  console.log("index:", index, "guess:", game.currentGuess)
})

submit.addEventListener("click", function (event) {
  event.preventDefault()
  if (game.currentGuess.length !== 4) {
    message.textContent = "Pick all 4 colors before check!"
    message.style.color = "red"
    console.log("error")
    return
  }
  game.guesses.push(game.currentGuess)
  console.log(game.guesses)
  startNextRow()
})

function startNextRow() {}
// Start the first round as soon as the page loads. later on we will call this function when the user clicks the start/reset button.
startGame()
