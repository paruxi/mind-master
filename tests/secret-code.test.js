// Tests for generateSecretCode() and startGame() in script.js.
//
// Run them from the project folder with:
//   npm test
//
// These tests use Node's built-in test tools, so nothing needs to be installed.

const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// The 6 colors the game is allowed to use.
// The tests keep their own copy, so they check the real rule, not just whatever script.js says.
const ALLOWED_COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];

// The secret code must always have 4 positions.
const EXPECTED_CODE_LENGTH = 4;

// script.js lives one folder up from this test file.
const scriptPath = path.join(__dirname, "..", "script.js");
const scriptSource = fs.readFileSync(scriptPath, "utf8");

// Math.random() as it was before any test changed it.
const realMathRandom = Math.random;

// Load a fresh copy of script.js, so every test starts with a new game.
// script.js is written as a normal browser script, so we wrap it in a function
// and return the parts the tests need.
function loadScript() {
  return new Function(
    scriptSource +
      `
      return { generateSecretCode, startGame, game };
      `,
  )();
}

// Replace Math.random() with a fixed list of numbers, so results are predictable.
// Each call to Math.random() uses the next number in the list.
function useFixedRandomNumbers(numbers) {
  let nextIndex = 0;
  Math.random = () => numbers[nextIndex++];
}

describe("secret code", () => {
  // Load a fresh copy of the game before each test.
  let game;
  let generateSecretCode;
  let startGame;

  beforeEach(() => {
    ({ game, generateSecretCode, startGame } = loadScript());
  });

  // Put the real Math.random() back after each test that changed it.
  afterEach(() => {
    Math.random = realMathRandom;
  });

  describe("generateSecretCode()", () => {
    it("returns an array", () => {
      const code = generateSecretCode();

      assert.ok(Array.isArray(code));
    });

    it("returns exactly 4 colors", () => {
      const code = generateSecretCode();

      assert.equal(code.length, EXPECTED_CODE_LENGTH);
    });

    it("only uses the 6 allowed colors", () => {
      // Check many codes, so a rare bad color would still be caught.
      for (let i = 0; i < 100; i++) {
        const code = generateSecretCode();

        for (const color of code) {
          assert.ok(
            ALLOWED_COLORS.includes(color),
            `"${color}" is not one of the allowed colors`,
          );
        }
      }
    });

    it("returns a new array each time it is called", () => {
      const first = generateSecretCode();
      const second = generateSecretCode();

      // notStrictEqual checks that these are two different arrays in memory.
      assert.notStrictEqual(first, second);
    });

    it("does not change game.secretCode", () => {
      const before = [...game.secretCode];

      generateSecretCode();

      assert.deepEqual(game.secretCode, before);
    });

    it("can repeat a color in the same code", () => {
      // If Math.random() always returns 0, every position gets the first color.
      useFixedRandomNumbers([0, 0, 0, 0]);

      const code = generateSecretCode();

      assert.deepEqual(code, ["red", "red", "red", "red"]);
    });

    it("picks colors from the list using Math.random()", () => {
      // Math.random() * 6, then rounded down, gives positions 0, 1, 2, 3.
      // 0.0 -> red, 0.2 -> blue, 0.4 -> green, 0.6 -> yellow
      useFixedRandomNumbers([0, 0.2, 0.4, 0.6]);

      const code = generateSecretCode();

      assert.deepEqual(code, ["red", "blue", "green", "yellow"]);
    });

    it("can pick the last color (orange)", () => {
      // 0.99 * 6 = 5.94, which rounds down to 5, the last color in the list.
      useFixedRandomNumbers([0.99, 0.99, 0.99, 0.99]);

      const code = generateSecretCode();

      assert.deepEqual(code, ["orange", "orange", "orange", "orange"]);
    });

    it("sometimes repeats a color when using real randomness", () => {
      // With 6 colors and 4 positions, about 72% of codes have a repeat.
      // Over 200 codes, at least one repeat is practically certain.
      let codesWithRepeat = 0;

      for (let i = 0; i < 200; i++) {
        const code = generateSecretCode();

        if (new Set(code).size < code.length) {
          codesWithRepeat++;
        }
      }

      assert.ok(codesWithRepeat > 0, "no code had a repeated color in 200 tries");
    });
  });

  describe("startGame()", () => {
    it("stores a new 4-color secret code in game.secretCode", () => {
      startGame();

      assert.equal(game.secretCode.length, EXPECTED_CODE_LENGTH);
      for (const color of game.secretCode) {
        assert.ok(ALLOWED_COLORS.includes(color));
      }
    });

    it("creates a different secret code when it is called again", () => {
      // Fixed numbers make the two codes different on purpose,
      // so this test never fails by chance.
      useFixedRandomNumbers([0, 0, 0, 0]);
      startGame();
      assert.deepEqual(game.secretCode, ["red", "red", "red", "red"]);

      useFixedRandomNumbers([0.99, 0.99, 0.99, 0.99]);
      startGame();
      assert.deepEqual(game.secretCode, ["orange", "orange", "orange", "orange"]);
    });

    it("empties the guesses and the current guess", () => {
      game.guesses = [["red", "blue", "green", "yellow"]];
      game.currentGuess = ["purple"];

      startGame();

      assert.deepEqual(game.guesses, []);
      assert.deepEqual(game.currentGuess, []);
    });

    it("sets the status back to playing", () => {
      game.status = "won";

      startGame();

      assert.equal(game.status, "playing");
    });

    it("keeps the best score", () => {
      game.bestScore = 6;

      startGame();

      assert.equal(game.bestScore, 6);
    });

    it("runs when the script loads, so the first round is ready", () => {
      // loadScript() runs the whole file, including the startGame() call at the bottom.
      assert.equal(game.secretCode.length, EXPECTED_CODE_LENGTH);
      assert.equal(game.status, "playing");
    });
  });
});
