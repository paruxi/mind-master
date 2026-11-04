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
const pegs = guess.querySelectorAll(".peg")

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
  console.log(choice)
  pegs.forEach((el) => el.classList.remove("selected-peg"))
  choice.classList.toggle("selected-peg")
})

// Start the first round as soon as the page loads. later on we will call this function when the user clicks the start/reset button.
startGame()
