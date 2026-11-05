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
}
const guess = document.querySelector(".guess")
const selectedPeg = guess.querySelectorAll(".peg")
const colorButton = document.querySelector(".color-btn")
const row = document.querySelector(".row")
const palette = document.getElementById("palette")

const gameState = {
  row: 0,
  pegs: null,
  guess: [null, null, null, null],
}

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
}

guess.addEventListener("click", function (event) {
  const choice = event.target.closest(".peg")
  if (!choice) return
  selectedPeg.forEach((el) => el.classList.remove("selected-peg"))
  choice.classList.toggle("selected-peg")
  gameState.selectedPeg = choice
  console.log(choice.dataset.slot)
})

palette.addEventListener("click", function (event) {
  const colorPicker = event.target.closest(".color-btn")
  if (!colorPicker) return
  if (!gameState.selectedPeg) return
  console.log(colorPicker.dataset.color)
  const color = colorPicker.dataset.color

  gameState.selectedPeg.style.background = `var(--${color})`
  gameState.selectedPeg.dataset.color = color

  const index = Number(gameState.selectedPeg.dataset.number)
  gameState.guess[index] = color
})

// Start the first round as soon as the page loads. later on we will call this function when the user clicks the start/reset button.
startGame()
