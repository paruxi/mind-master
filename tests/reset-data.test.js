const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { createFakePage, createFakeStorage } = require("./helpers/fake-browser");
const { loadBrowserFile } = require("./helpers/load-browser-file");

function setUp({ confirmed = true, storage = createFakeStorage({ bestScore: "4", other: "keep" }) } = {}) {
  const page = createFakePage();
  const game = { bestScore: 4 };
  const calls = [];
  const scoreCounter = page.document.getElementById("scoreCounter");
  scoreCounter.textContent = "Won with 4 attempts";

  const functions = loadBrowserFile(
    "reset-data.js",
    ["resetSavedGame"],
    {
      game,
      document: page.document,
      localStorage: storage,
      console: { log: () => {} },
      confirm: () => confirmed,
      BEST_SCORE_KEY: "bestScore",
      scoreCounter,
      resetGame: () => calls.push("resetGame"),
    },
  );

  return { game, calls, scoreCounter, storage, ...page, ...functions };
}

describe("resetSavedGame()", () => {
  it("removes the best score and starts a new game after confirming", () => {
    const { calls, game, scoreCounter, storage, resetSavedGame } = setUp();

    resetSavedGame();

    assert.equal(storage.getItem("bestScore"), null);
    assert.equal(game.bestScore, null);
    assert.equal(scoreCounter.textContent, "No score yet");
    assert.deepEqual(calls, ["resetGame"]);
  });

  it("leaves other data on the page alone", () => {
    const { storage, resetSavedGame } = setUp();

    resetSavedGame();

    assert.equal(storage.getItem("other"), "keep");
  });

  it("changes nothing when the confirmation is cancelled", () => {
    const { calls, game, scoreCounter, storage, resetSavedGame } = setUp({ confirmed: false });

    resetSavedGame();

    assert.equal(storage.getItem("bestScore"), "4");
    assert.equal(game.bestScore, 4);
    assert.equal(scoreCounter.textContent, "Won with 4 attempts");
    assert.deepEqual(calls, []);
  });

  it("still starts a new game when storage is blocked", () => {
    const storage = {
      removeItem: () => {
        throw new Error("blocked");
      },
    };
    const { calls, resetSavedGame } = setUp({ storage });

    resetSavedGame();

    assert.deepEqual(calls, ["resetGame"]);
  });
});

describe("Reset button", () => {
  it("asks to reset when clicked", () => {
    const { calls, elementsById } = setUp();

    elementsById["reset-data-btn"].listeners.click();

    assert.deepEqual(calls, ["resetGame"]);
  });
});
