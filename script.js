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
function getCurrentRowNumber() {
  return game.guesses.length
}
const guess = document.querySelector(".guess")
const colorButton = document.querySelector(".color-btn")
const palette = document.getElementById("palette")
const submit = document.getElementById("submit-btn")
const message = document.getElementById("message")
let clickController = new AbortController()

const attemptsNumber = document.getElementById("attemptsNumber")
const attemptMessage = document.getElementById("attemptMessage")
const scoreCounter = document.getElementById("scoreCounter")
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
  if (bestScore !== null) {
    scoreCounter.textContent = `Won with ${bestScore} attempts`
  }
}

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

  const rowPegs = [...game.currentRow.querySelectorAll(".peg")]
  const selectedPegIndex = rowPegs.indexOf(game.selectedPeg)
  const nextIndex = (selectedPegIndex + 1) % rowPegs.length // circular
  rowPegs[nextIndex].click()
})

submit.addEventListener("click", function (event) {
  event.preventDefault()
  console.log("currentguess:", game.currentGuess)
  if (game.currentGuess.includes(undefined) || game.currentGuess.length !== 4) {
    message.textContent = "Pick all 4 colors before check!"
    message.style.color = "red"
    console.log("error")
    return
  }
  message.textContent = "Pick 4 colors, then check your guess."
  message.style.color = ""
  game.guesses.push(game.currentGuess)
  console.log(game.guesses)
  handleAttempts()
  startNextRow()
})

function startNextRow() {
  game.currentGuess = []

  // deselect previous peg
  game.selectedPeg.classList.remove("selected-peg")
  clickController.abort()
  clickController = new AbortController()
  // move row
  const rowNumber = getCurrentRowNumber()
  const nextRow = document.querySelector(`div.row[data-row="${rowNumber}"]`)
  game.currentRow = nextRow
  game.currentRow.addEventListener(
    "click",
    function (event) {
      onClickCurrentRow(event)
    },
    { signal: clickController.signal },
  )

  // select first peg in new row
  const nextPeg = nextRow.querySelector('[data-slot="0"]')
  nextPeg.classList.add("selected-peg")
  game.selectedPeg = nextPeg
}

//compares the current guess array and secret code array
function codesMatch(currentGuess, secretCode) {
  return (
    currentGuess.length === secretCode.length &&
    currentGuess.every((color, i) => color === secretCode[i])
  )
}

function handleAttempts() {
  const currentAttemptNumber = getCurrentRowNumber() + 1
  if (
    currentAttemptNumber <= 11 &&
    codesMatch(game.currentGuess, game.secretCode)
  ) {
    const score = currentAttemptNumber - 1
    attemptMessage.textContent = `Nice Job! You solved it in ${score} attempts`
    attemptMessage.style.color = "green"
    if (score < bestScore || bestScore === null) {
      localStorage.setItem("bestScore", JSON.stringify(score))
      scoreCounter.textContent = `Won with ${score} attempts`
    }
    return
    // bestScore = currentAttemptNumber
  }

  if (currentAttemptNumber === 11 && game.currentGuess != game.secretCode) {
    console.log("test:", game.currentGuess)
    console.log(game.secretCode)
    attemptMessage.textContent = "You lost!"
    attemptMessage.style.color = "red"
    return
  }

  if (currentAttemptNumber < 11 && game.currentGuess != game.secretCode) {
    attemptsNumber.textContent = currentAttemptNumber
    return
  }
}

let bestScore = JSON.parse(localStorage.getItem("bestScore"))

// Start the first round as soon as the page loads. later on we will call this function when the user clicks the start/reset button.
startGame()
console.log(game.secretCode)
