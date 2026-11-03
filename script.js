const codeColors = ["red", "blue", "green", "yellow", "purple", "orange"];

const game = {
  secretCode: [],
  guesses: [], //10 guesses
  currentGuess: [],
  maxAttempts: 10,
  status: "playing",
  bestScore: null,
};

// function gameStart() {

// }

function generateSecretCode() {
  for (let i = 0; i < 4; i++) {
    game.secretCode.push(
      codeColors[Math.floor(Math.random() * codeColors.length)],
    );
  }
  return game.secretCode;
}

console.log(game.secretCode);
