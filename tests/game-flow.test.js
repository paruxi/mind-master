const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { colorsOf, createFakePage } = require("./helpers/fake-browser");
const { loadBrowserFile } = require("./helpers/load-browser-file");

const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];
const SECRET = ["red", "blue", "green", "yellow"];
const WRONG = ["purple", "purple", "purple", "purple"];

function setUp() {
  const game = { secretCode: [...SECRET], guesses: [], currentGuess: [], maxAttempts: 10, status: "playing" };
  const page = createFakePage();

  const functions = loadBrowserFile(
    ["feedback.js", "game-status.js", "board.js", "game-flow.js"],
    ["gradeLatestGuess", "blockInputAfterGameEnd"],
    { game, document: page.document, codeColors: COLORS },
  );

  // What the submit handler in script.js does with a valid guess.
  const storeGuess = (colors) => game.guesses.push([...colors]);

  return { game, storeGuess, ...page, ...functions };
}

function feedbackOf(mini) {
  if (mini.classList.contains("hit")) return "hit";
  if (mini.classList.contains("near")) return "near";
  return "";
}

describe("gradeLatestGuess()", () => {
  it("stores the feedback next to the guess", () => {
    const { game, storeGuess, gradeLatestGuess } = setUp();
    storeGuess(["red", "yellow", "green", "purple"]);

    gradeLatestGuess();

    assert.deepEqual(game.feedback, [{ black: 2, white: 1 }]);
  });

  it("shows the feedback pegs in the row of the guess", () => {
    const { storeGuess, gradeLatestGuess, rows } = setUp();
    storeGuess(WRONG);
    gradeLatestGuess();
    storeGuess(["red", "yellow", "green", "purple"]);

    gradeLatestGuess();

    assert.deepEqual(rows[1].minis.map(feedbackOf), ["hit", "hit", "near", ""]);
  });

  it("does nothing when no new guess was stored (incomplete guess)", () => {
    const { game, gradeLatestGuess } = setUp();

    gradeLatestGuess();

    assert.deepEqual(game.feedback, []);
    assert.equal(game.status, "playing");
  });

  it("does not grade the same guess twice", () => {
    const { game, storeGuess, gradeLatestGuess } = setUp();
    storeGuess(WRONG);

    gradeLatestGuess();
    gradeLatestGuess();

    assert.equal(game.feedback.length, 1);
  });

  it("keeps the secret code hidden during the game", () => {
    const { storeGuess, gradeLatestGuess, secretPegs } = setUp();
    storeGuess(WRONG);

    gradeLatestGuess();

    assert.ok(secretPegs.every((peg) => peg.classList.contains("hidden")));
  });

  it("wins and reveals the secret code when the guess is right", () => {
    const { game, storeGuess, gradeLatestGuess, secretPegs } = setUp();
    storeGuess(SECRET);

    gradeLatestGuess();

    assert.equal(game.status, "won");
    assert.deepEqual(secretPegs.map(colorsOf), [["red"], ["blue"], ["green"], ["yellow"]]);
  });

  it("loses after 10 wrong guesses and reveals the secret code", () => {
    const { game, storeGuess, gradeLatestGuess, secretPegs } = setUp();

    for (let i = 0; i < 10; i++) {
      storeGuess(WRONG);
      gradeLatestGuess();
    }

    assert.equal(game.status, "lost");
    assert.ok(secretPegs.every((peg) => !peg.classList.contains("hidden")));
  });

  it("counts a win on the 10th guess as a win", () => {
    const { game, storeGuess, gradeLatestGuess } = setUp();
    for (let i = 0; i < 9; i++) {
      storeGuess(WRONG);
      gradeLatestGuess();
    }

    storeGuess(SECRET);
    gradeLatestGuess();

    assert.equal(game.status, "won");
  });
});

describe("blockInputAfterGameEnd()", () => {
  function clickEvent(isOnGameControl) {
    const event = { stopped: false, stopPropagation: () => (event.stopped = true) };
    event.target = { closest: () => (isOnGameControl ? {} : null) };
    return event;
  }

  it("lets clicks through while playing", () => {
    const { blockInputAfterGameEnd } = setUp();
    const event = clickEvent(true);

    blockInputAfterGameEnd(event);

    assert.equal(event.stopped, false);
  });

  for (const status of ["won", "lost"]) {
    it(`stops clicks on the board, palette and buttons when the game is ${status}`, () => {
      const { game, blockInputAfterGameEnd } = setUp();
      game.status = status;
      const event = clickEvent(true);

      blockInputAfterGameEnd(event);

      assert.equal(event.stopped, true);
    });

    it(`lets other clicks through when the game is ${status} (like New game)`, () => {
      const { game, blockInputAfterGameEnd } = setUp();
      game.status = status;
      const event = clickEvent(false);

      blockInputAfterGameEnd(event);

      assert.equal(event.stopped, false);
    });
  }
});

describe("click listeners", () => {
  it("grades the guess when the submit button is clicked", () => {
    const { game, storeGuess, elementsById } = setUp();
    storeGuess(WRONG);

    elementsById["submit-btn"].listeners.click();

    assert.equal(game.feedback.length, 1);
  });

  it("blocks input before any other listener runs (capture phase on document)", () => {
    const { game, document } = setUp();
    game.status = "won";
    const event = {
      stopped: false,
      stopPropagation() { this.stopped = true; },
      target: { closest: () => ({}) },
    };

    document.listeners.click(event);

    assert.equal(event.stopped, true);
  });
});
