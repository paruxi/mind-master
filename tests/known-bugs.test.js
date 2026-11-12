// Bugs found in script.js. They are marked "todo": the test shows up as TODO
// in the results and does not fail `npm test`. When the bug is fixed, remove
// the `todo` option and the test becomes a normal test.

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { createFakeStorage } = require("./helpers/fake-browser");
const { loadScript } = require("./helpers/load-script");

describe("known bugs in script.js", () => {
  for (const badValue of ["abc", ""]) {
    it(
      `does not crash on load when the saved bestScore is "${badValue}"`,
      { todo: "script.js reads bestScore with JSON.parse, which throws on bad data" },
      () => {
        const storage = createFakeStorage({ bestScore: badValue });

        assert.doesNotThrow(() => loadScript({ storage }));
      },
    );
  }

  it(
    "does not crash when the 10th guess is submitted",
    { todo: "startNextRow() looks for row 10, which does not exist" },
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
