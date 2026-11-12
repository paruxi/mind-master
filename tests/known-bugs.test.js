// Bugs found in script.js. They were first marked "todo" and are normal tests now that they are fixed.

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { createFakeStorage } = require("./helpers/fake-browser");
const { loadScript } = require("./helpers/load-script");

describe("fixed bugs in script.js", () => {
  for (const badValue of ["abc", ""]) {
    it(
      `does not crash on load when the saved bestScore is "${badValue}"`,
      () => {
        const storage = createFakeStorage({ bestScore: badValue });

        assert.doesNotThrow(() => loadScript({ storage }));
      },
    );
  }

  it(
    "does not crash when the 10th guess is submitted",
    () => {
      const { game, page } = loadScript();
      game.guesses = Array(9).fill(["red", "red", "red", "red"]);
      game.currentGuess = ["red", "red", "red", "red"];
      game.selectedPeg = page.rows[9].pegs[0];
      game.currentRow = page.rows[9];

      assert.doesNotThrow(() =>
        page.elementsById["submit-btn"].listeners.click({ preventDefault: () => {} }),
      );
    },
  );
});
