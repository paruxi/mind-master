// The 6 colors the computer can pick from.
const codeColors = ["red", "blue", "green", "yellow", "purple", "orange"];

// The secret code always has 4 positions.
const CODE_LENGTH = 4;

// All the data for the current game lives in this one object.
const game = {
  secretCode: [], // the hidden 4 colors, filled in by startGame()
  guesses: [], // the guesses the player has submitted (up to 10)
  currentGuess: [], // the colors picked so far in the current row
  maxAttempts: 10,
  status: "playing", // "playing", "won", or "lost"
  bestScore: null, // fewest attempts to win; kept between rounds
};

// Returns a brand-new array with CODE_LENGTH random colors.
// Each position is picked on its own, so the same color can appear more than once.
function generateSecretCode() {
  const code = [];

  for (let i = 0; i < CODE_LENGTH; i++) {
    // Math.random() gives a number from 0 up to (but not including) 1.
    // Multiplying by 6 and rounding down gives an index from 0 to 5.
    const randomIndex = Math.floor(Math.random() * codeColors.length);
    code.push(codeColors[randomIndex]);
  }

  return code;
}

// Starts a new round: a new secret code, and empty guesses.
// bestScore is not changed, so it survives between rounds.
function startGame() {
  game.secretCode = generateSecretCode();
  game.guesses = [];
  game.currentGuess = [];
  game.status = "playing";
}

// Start the first round as soon as the page loads.
startGame();
