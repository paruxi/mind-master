const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { loadBrowserFile } = require("./helpers/load-browser-file");

// A game with one feedback result per entry in `blackCounts`.
function setUp({ blackCounts = [], status = "playing" } = {}) {
  const game = {
    secretCode: ["red", "blue", "green", "yellow"],
    guesses: blackCounts.map(() => ["red", "red", "red", "red"]),
    feedback: blackCounts.map((black) => ({ black, white: 0 })),
    maxAttempts: 10,
    status,
  };

  const functions = loadBrowserFile("game-status.js", ["checkWin", "checkLoss"], { game });

  return { game, ...functions };
}

function wrongGuesses(count) {
  return Array(count).fill(1);
}

describe("checkWin()", () => {
  it("wins when the latest guess has 4 black pegs", () => {
    const { game, checkWin } = setUp({ blackCounts: [4] });

    checkWin();

    assert.equal(game.status, "won");
  });

  it("does not win with fewer than 4 black pegs", () => {
    const { game, checkWin } = setUp({ blackCounts: [3] });

    checkWin();

    assert.equal(game.status, "playing");
  });

  it("only looks at the latest guess", () => {
    const { game, checkWin } = setUp({ blackCounts: [4, 1] });

    checkWin();

    assert.equal(game.status, "playing");
  });

  it("does nothing when there are no guesses yet", () => {
    const { game, checkWin } = setUp();

    checkWin();

    assert.equal(game.status, "playing");
  });
});

describe("checkLoss()", () => {
  it("loses after the 10th wrong guess", () => {
    const { game, checkLoss } = setUp({ blackCounts: wrongGuesses(10) });

    checkLoss();

    assert.equal(game.status, "lost");
  });

  it("keeps playing before the 10th guess", () => {
    const { game, checkLoss } = setUp({ blackCounts: wrongGuesses(9) });

    checkLoss();

    assert.equal(game.status, "playing");
  });

  it("does not turn a win into a loss", () => {
    const { game, checkLoss } = setUp({ blackCounts: wrongGuesses(10), status: "won" });

    checkLoss();

    assert.equal(game.status, "won");
  });
});

describe("checkWin() then checkLoss()", () => {
  it("counts a win on the 10th guess as a win", () => {
    const { game, checkWin, checkLoss } = setUp({ blackCounts: [...wrongGuesses(9), 4] });

    checkWin();
    checkLoss();

    assert.equal(game.status, "won");
  });

  it("loses after 10 wrong guesses", () => {
    const { game, checkWin, checkLoss } = setUp({ blackCounts: wrongGuesses(10) });

    checkWin();
    checkLoss();

    assert.equal(game.status, "lost");
  });
});
