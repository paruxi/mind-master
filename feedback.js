// Returns { black, white } for a guess: black = right color in the right
// position, white = right color in the wrong position. Each peg counts once.
function calculateFeedback(guess, secret) {
  const usedGuess = guess.map(() => false)
  const usedSecret = secret.map(() => false)
  let black = 0
  let white = 0

  // Exact matches first, so they can't be used up as white pegs.
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secret[i]) {
      black++
      usedGuess[i] = true
      usedSecret[i] = true
    }
  }

  // Then match the leftover guess pegs with the free secret pegs.
  for (let i = 0; i < guess.length; i++) {
    if (usedGuess[i]) continue

    for (let j = 0; j < secret.length; j++) {
      if (!usedSecret[j] && guess[i] === secret[j]) {
        white++
        usedGuess[i] = true
        usedSecret[j] = true
        break
      }
    }
  }

  return { black, white }
}

if (typeof module !== "undefined") {
  module.exports = { calculateFeedback }
}
