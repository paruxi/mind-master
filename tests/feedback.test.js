const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { calculateFeedback } = require("../feedback.js");

describe("calculateFeedback()", () => {
  describe("examples from the issue", () => {
    it("counts duplicates correctly: black 1, white 2", () => {
      const secret = ["red", "red", "blue", "green"];
      const guess = ["red", "blue", "red", "red"];

      assert.deepEqual(calculateFeedback(guess, secret), { black: 1, white: 2 });
    });

    it("gives 4 black when the guess is exactly the secret", () => {
      const secret = ["red", "blue", "green", "yellow"];

      assert.deepEqual(calculateFeedback([...secret], secret), { black: 4, white: 0 });
    });

    it("gives nothing when no color matches", () => {
      const secret = ["red", "red", "red", "red"];
      const guess = ["blue", "blue", "blue", "blue"];

      assert.deepEqual(calculateFeedback(guess, secret), { black: 0, white: 0 });
    });

    it("gives 4 white when all colors are right but in the wrong places", () => {
      const secret = ["red", "blue", "green", "yellow"];
      const guess = ["yellow", "green", "blue", "red"];

      assert.deepEqual(calculateFeedback(guess, secret), { black: 0, white: 4 });
    });
  });

  describe("duplicate colors", () => {
    it("does not count one secret peg twice", () => {
      const secret = ["red", "blue", "green", "yellow"];
      const guess = ["blue", "red", "red", "red"];

      assert.deepEqual(calculateFeedback(guess, secret), { black: 0, white: 2 });
    });

    it("gives black pegs priority over white pegs", () => {
      const secret = ["red", "blue", "green", "yellow"];
      const guess = ["red", "red", "purple", "purple"];

      assert.deepEqual(calculateFeedback(guess, secret), { black: 1, white: 0 });
    });

    it("counts a repeated color that is in the secret twice", () => {
      const secret = ["red", "red", "blue", "blue"];
      const guess = ["blue", "blue", "red", "red"];

      assert.deepEqual(calculateFeedback(guess, secret), { black: 0, white: 4 });
    });

    it("handles a secret made of one color", () => {
      const secret = ["green", "green", "green", "green"];
      const guess = ["green", "red", "green", "red"];

      assert.deepEqual(calculateFeedback(guess, secret), { black: 2, white: 0 });
    });
  });

  describe("rules that always hold", () => {
    it("never gives more than 4 pegs in total", () => {
      const colors = ["red", "blue", "green", "yellow", "purple", "orange"];

      for (let a = 0; a < colors.length; a++) {
        for (let b = 0; b < colors.length; b++) {
          const secret = [colors[a], colors[b], colors[a], colors[b]];
          const guess = [colors[b], colors[b], colors[a], colors[a]];

          const { black, white } = calculateFeedback(guess, secret);

          assert.ok(black + white <= 4, `${black} + ${white} is more than 4`);
        }
      }
    });

    it("gives the same result when the guess and secret are swapped", () => {
      const secret = ["red", "red", "blue", "green"];
      const guess = ["red", "blue", "red", "red"];

      assert.deepEqual(
        calculateFeedback(guess, secret),
        calculateFeedback(secret, guess),
      );
    });

    it("does not change the guess or the secret", () => {
      const secret = ["red", "red", "blue", "green"];
      const guess = ["red", "blue", "red", "red"];

      calculateFeedback(guess, secret);

      assert.deepEqual(secret, ["red", "red", "blue", "green"]);
      assert.deepEqual(guess, ["red", "blue", "red", "red"]);
    });
  });
});
