// The 6 colors the computer can pick from.
const codeColors = ["red", "blue", "green", "yellow", "purple", "orange"];

// The secret code always has 4 positions.
const CODE_LENGTH = 4;

const game = {
  secretCode: [],
  guesses: [], //10 guesses
  currentGuess: [],
  maxAttempts: 10,
  status: "playing",
  bestScore: null,
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

console.log(game.secretCode);
