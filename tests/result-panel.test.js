const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { colorsOf, createFakeElement, createFakePage } = require("./helpers/fake-browser");
const { loadBrowserFile } = require("./helpers/load-browser-file");

const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];

function setUp({ status = "playing", guesses = 3, newBest = false, best = 5 } = {}) {
  const page = createFakePage();
  const game = {
    secretCode: ["red", "blue", "green", "yellow"],
    guesses: Array.from({ length: guesses }, () => []),
    status,
    newBest,
  };
  const calls = [];

  const panel = page.document.getElementById("result-panel");
  panel.open = false;
  panel.showModal = () => {
    panel.open = true;
  };
  panel.close = () => {
    panel.open = false;
  };

  const main = createFakeElement();
  const controls = [createFakeElement(), createFakeElement(), createFakeElement()];
  const codePegs = [1, 2, 3, 4].map(createFakeElement);
  const { document } = page;
  const querySelectorAll = document.querySelectorAll;
  document.querySelector = (selector) => (selector === ".game" ? main : null);
  document.querySelectorAll = (selector) => {
    if (selector === "#palette .color-btn, #undo-btn, #submit-btn") return controls;
    if (selector === "#result-code .peg") return codePegs;
    return querySelectorAll(selector);
  };

  const functions = loadBrowserFile(
    ["board.js", "attempt-progress.js", "result-panel.js"],
    ["resultContent", "renderResult", "playAgain"],
    {
      game,
      document,
      codeColors: COLORS,
      bestScore: best,
      resetGame: () => {
        calls.push("resetGame");
        game.status = "playing";
      },
    },
  );

  return { game, calls, panel, main, controls, codePegs, ...page, ...functions };
}

describe("resultContent()", () => {
  it("congratulates a win and gives the attempts used", () => {
    const content = setUp().resultContent("won", 4, 4, false);

    assert.equal(content.title, "You cracked it!");
    assert.equal(content.text, "Solved in 4 attempts.");
    assert.equal(content.best, "Best score: 4 attempts");
  });

  it("says singular for one attempt and marks a new best", () => {
    const content = setUp().resultContent("won", 1, 1, true);

    assert.equal(content.text, "Solved in 1 attempt.");
    assert.equal(content.best, "New best score!");
  });

  it("says out of attempts after a loss", () => {
    const content = setUp().resultContent("lost", 10, null, false);

    assert.equal(content.title, "Out of attempts");
    assert.equal(content.best, "");
  });

  it("gives every result an icon, so it does not rely on color alone", () => {
    const { resultContent } = setUp();

    assert.ok(resultContent("won", 3, 3, false).icon);
    assert.ok(resultContent("lost", 10, null, false).icon);
  });
});

describe("renderResult()", () => {
  it("does nothing special while playing", () => {
    const { panel, controls, renderResult } = setUp();

    renderResult();

    assert.equal(panel.open, false);
    assert.ok(controls.every((control) => control.disabled === false));
  });

  it("opens the panel and locks the controls after a win", () => {
    const { panel, main, controls, renderResult } = setUp({ status: "won" });

    renderResult();

    assert.equal(panel.open, true);
    assert.ok(controls.every((control) => control.disabled === true));
    assert.ok(main.classList.contains("result-won"));
    assert.ok(!main.classList.contains("result-lost"));
  });

  it("opens the panel with the revealed code after a loss", () => {
    const { codePegs, main, document, renderResult } = setUp({ status: "lost", guesses: 10 });

    renderResult();

    assert.ok(main.classList.contains("result-lost"));
    assert.deepEqual(codePegs.map((peg) => colorsOf(peg)[0]), ["red", "blue", "green", "yellow"]);
    assert.equal(document.getElementById("result-title").textContent, "Out of attempts");
  });

  it("announces the result in the live region", () => {
    const { document, renderResult } = setUp({ status: "won", guesses: 2, newBest: true });

    renderResult();

    const announcement = document.getElementById("result-announcement").textContent;
    assert.ok(announcement.includes("You cracked it!"));
    assert.ok(announcement.includes("2 attempts"));
  });

  it("unlocks the controls and closes the panel when a new round starts", () => {
    const { game, panel, main, controls, renderResult } = setUp({ status: "won" });
    renderResult();

    game.status = "playing";
    renderResult();

    assert.equal(panel.open, false);
    assert.ok(controls.every((control) => control.disabled === false));
    assert.ok(!main.classList.contains("result-won"));
  });
});

describe("Play again", () => {
  it("starts a new round and closes the panel", () => {
    const { calls, panel, controls, renderResult, playAgain } = setUp({ status: "won" });
    renderResult();

    playAgain();

    assert.deepEqual(calls, ["resetGame"]);
    assert.equal(panel.open, false);
    assert.ok(controls.every((control) => control.disabled === false));
  });

  it("is wired to its button", () => {
    const { calls, elementsById } = setUp({ status: "won" });

    elementsById["play-again-btn"].listeners.click();

    assert.deepEqual(calls, ["resetGame"]);
  });
});
