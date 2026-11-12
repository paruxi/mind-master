const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { createFakePage } = require("./helpers/fake-browser");
const { loadBrowserFile } = require("./helpers/load-browser-file");

function setUp({ guessCount = 0, status = "playing" } = {}) {
  const game = { guesses: Array(guessCount).fill([]), maxAttempts: 10, status };
  const page = createFakePage();

  const functions = loadBrowserFile(
    "attempt-progress.js",
    ["progressStates", "renderAttemptProgress"],
    { game, document: page.document },
  );

  return { game, ...page, ...functions };
}

describe("progressStates()", () => {
  const { progressStates } = setUp();

  it("marks the first attempt as current at the start", () => {
    assert.deepEqual(progressStates(0, "playing", 4), ["current", "", "", ""]);
  });

  it("marks played attempts as done and the next one as current", () => {
    assert.deepEqual(progressStates(2, "playing", 4), ["done", "done", "current", ""]);
  });

  it("has no current attempt after a win", () => {
    assert.deepEqual(progressStates(3, "won", 4), ["done", "done", "done", ""]);
  });

  it("marks every attempt done after a loss", () => {
    assert.deepEqual(progressStates(4, "lost", 4), ["done", "done", "done", "done"]);
  });
});

describe("renderAttemptProgress()", () => {
  it("lights the first step and the first row when the page loads", () => {
    const { progressSteps, rows } = setUp();

    assert.ok(progressSteps[0].classList.contains("current"));
    assert.ok(rows[0].classList.contains("active"));
  });

  it("colors the steps and lights only the row being played", () => {
    const { renderAttemptProgress, progressSteps, rows } = setUp({ guessCount: 3 });

    renderAttemptProgress();

    assert.deepEqual(
      progressSteps.slice(0, 5).map((step) => (step.classList.contains("done") ? "done" : step.classList.contains("current") ? "current" : "")),
      ["done", "done", "done", "current", ""],
    );
    assert.deepEqual(rows.map((row) => row.classList.contains("active")).indexOf(true), 3);
    assert.equal(rows.filter((row) => row.classList.contains("active")).length, 1);
  });

  it("lights no row once the game is over", () => {
    const { game, renderAttemptProgress, rows } = setUp({ guessCount: 2 });

    game.status = "won";
    renderAttemptProgress();

    assert.ok(rows.every((row) => !row.classList.contains("active")));
  });

  it("starts again from the first step after a new game", () => {
    const { game, renderAttemptProgress, progressSteps, rows } = setUp({ guessCount: 5 });

    game.guesses = [];
    renderAttemptProgress();

    assert.ok(progressSteps[0].classList.contains("current"));
    assert.ok(!progressSteps[4].classList.contains("done"));
    assert.ok(rows[0].classList.contains("active"));
  });
});
