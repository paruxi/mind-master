const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { colorsOf, createFakeElement, createFakePage } = require("./helpers/fake-browser");
const { loadBrowserFile } = require("./helpers/load-browser-file");

const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];

// A game in the middle of play, with script.js's startGame() replaced by a copy of what it does.
function setUp({ status = "playing" } = {}) {
  const page = createFakePage();
  const game = {
    secretCode: ["red", "blue", "green", "yellow"],
    guesses: [["red", "red", "red", "red"]],
    currentGuess: ["blue"],
    feedback: [{ black: 1, white: 0 }],
    selectedPeg: createFakeElement(),
    maxAttempts: 10,
    status,
    bestScore: 4,
  };
  const calls = [];
  const oldController = new AbortController();
  const attemptsNumber = createFakeElement();

  const functions = loadBrowserFile(
    ["board.js", "new-game.js"],
    ["resetGame", "clickController"],
    {
      game,
      document: page.document,
      codeColors: COLORS,
      attemptsNumber,
      clickController: oldController,
      startGame: () => {
        calls.push("startGame");
        game.secretCode = ["orange", "orange", "orange", "orange"];
        game.guesses = [];
        game.currentGuess = [];
        game.status = "playing";
      },
    },
  );

  return { game, calls, oldController, attemptsNumber, ...page, ...functions };
}

describe("resetGame()", () => {
  it("starts a new round and keeps the best score", () => {
    const { game, calls, resetGame } = setUp();

    resetGame();

    assert.deepEqual(calls, ["startGame"]);
    assert.deepEqual(game.guesses, []);
    assert.equal(game.status, "playing");
    assert.equal(game.bestScore, 4);
  });

  it("starts a new round after a finished game", () => {
    const { game, resetGame } = setUp({ status: "won" });

    resetGame();

    assert.equal(game.status, "playing");
  });

  it("forgets the old feedback and the selected slot", () => {
    const { game, resetGame } = setUp();

    resetGame();

    assert.deepEqual(game.feedback, []);
    assert.equal(game.selectedPeg, null);
  });

  it("removes the click listener of the old row and makes a new controller", () => {
    const { oldController, resetGame } = setUp();

    resetGame();

    assert.equal(oldController.signal.aborted, true);
  });

  it("clears the colors, selected slot and feedback of every row", () => {
    const { rows, resetGame } = setUp();
    rows[0].pegs[0].style.background = "var(--red)";
    rows[0].pegs[0].dataset.color = "red";
    rows[0].pegs[1].classList.add("selected-peg");
    rows[0].minis[0].classList.add("hit");
    rows[3].minis[2].classList.add("near");

    resetGame();

    assert.equal(rows[0].pegs[0].style.background, "");
    assert.equal(rows[0].pegs[0].dataset.color, undefined);
    assert.ok(!rows[0].pegs[1].classList.contains("selected-peg"));
    assert.ok(!rows[0].minis[0].classList.contains("hit"));
    assert.ok(!rows[3].minis[2].classList.contains("near"));
  });

  it("hides the secret code again", () => {
    const { resetGame, secretPegs } = setUp({ status: "lost" });
    secretPegs.forEach((peg) => {
      peg.classList.remove("hidden");
      peg.classList.add("red");
    });

    resetGame();

    for (const peg of secretPegs) {
      assert.ok(peg.classList.contains("hidden"));
      assert.deepEqual(colorsOf(peg), []);
    }
  });

  it("puts back the default message", () => {
    const { document, resetGame } = setUp();
    const message = document.getElementById("message");
    message.textContent = "Pick all 4 colors before check!";
    message.style.color = "red";

    resetGame();

    assert.equal(message.textContent, "Pick 4 colors, then check your guess.");
    assert.equal(message.style.color, "");
  });

  it("restores the attempt counter, using the same #attemptsNumber element", () => {
    const { document, attemptsNumber, resetGame } = setUp();
    const attemptMessage = document.getElementById("attemptMessage");
    attemptMessage.style.color = "green";
    attemptsNumber.textContent = "7";

    resetGame();

    assert.deepEqual(attemptMessage.children, ["Attempt ", attemptsNumber, " /10"]);
    assert.equal(attemptsNumber.textContent, " 1 ");
    assert.equal(attemptMessage.style.color, "");
  });
});

describe("New game button", () => {
  it("starts a new round when clicked", () => {
    const { calls, elementsById } = setUp();

    elementsById["new-game-btn"].listeners.click();

    assert.deepEqual(calls, ["startGame"]);
  });
});
