const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { colorsOf, createFakePage } = require("./helpers/fake-browser");
const { loadBrowserFile } = require("./helpers/load-browser-file");

const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];
const SECRET_CODE = ["red", "blue", "green", "yellow"];

function setUp({ status = "playing" } = {}) {
  const game = { secretCode: SECRET_CODE, status };
  const page = createFakePage();

  const functions = loadBrowserFile(
    "board.js",
    ["feedbackClasses", "renderFeedback", "renderSecret"],
    { game, document: page.document, codeColors: COLORS },
  );

  return { game, ...page, ...functions };
}

function feedbackOf(mini) {
  if (mini.classList.contains("hit")) return "hit";
  if (mini.classList.contains("near")) return "near";
  return "";
}

describe("feedbackClasses()", () => {
  const { feedbackClasses } = setUp();

  it("puts black pegs first, then white, then empty", () => {
    assert.deepEqual(feedbackClasses(1, 2, 4), ["hit", "near", "near", ""]);
  });

  it("gives all empty pegs when there is no feedback", () => {
    assert.deepEqual(feedbackClasses(0, 0, 4), ["", "", "", ""]);
  });

  it("gives 4 black pegs for a perfect guess", () => {
    assert.deepEqual(feedbackClasses(4, 0, 4), ["hit", "hit", "hit", "hit"]);
  });

  it("gives 4 white pegs when every color is in the wrong place", () => {
    assert.deepEqual(feedbackClasses(0, 4, 4), ["near", "near", "near", "near"]);
  });
});

describe("renderFeedback()", () => {
  it("shows black pegs first, then white, in the right row", () => {
    const { renderFeedback, rows } = setUp();

    renderFeedback(2, { black: 1, white: 2 });

    assert.deepEqual(rows[2].minis.map(feedbackOf), ["hit", "near", "near", ""]);
    assert.deepEqual(rows[1].minis.map(feedbackOf), ["", "", "", ""]);
  });

  it("replaces feedback that was already there", () => {
    const { renderFeedback, rows } = setUp();
    renderFeedback(0, { black: 4, white: 0 });

    renderFeedback(0, { black: 0, white: 1 });

    assert.deepEqual(rows[0].minis.map(feedbackOf), ["near", "", "", ""]);
  });

  it("ignores a row that does not exist", () => {
    const { renderFeedback } = setUp();

    assert.doesNotThrow(() => renderFeedback(10, { black: 1, white: 0 }));
  });
});

describe("renderSecret()", () => {
  it("keeps the secret code hidden while playing", () => {
    const { renderSecret, secretPegs } = setUp({ status: "playing" });

    renderSecret();

    for (const peg of secretPegs) {
      assert.ok(peg.classList.contains("hidden"));
      assert.deepEqual(colorsOf(peg), []);
    }
  });

  for (const status of ["won", "lost"]) {
    it(`reveals the secret code when the game is ${status}`, () => {
      const { renderSecret, secretPegs } = setUp({ status });

      renderSecret();

      assert.deepEqual(secretPegs.map(colorsOf), [["red"], ["blue"], ["green"], ["yellow"]]);
      assert.ok(secretPegs.every((peg) => !peg.classList.contains("hidden")));
    });
  }

  it("hides the secret code again after a new game starts", () => {
    const { renderSecret, game, secretPegs } = setUp({ status: "won" });
    renderSecret();

    game.status = "playing";
    renderSecret();

    for (const peg of secretPegs) {
      assert.ok(peg.classList.contains("hidden"));
      assert.deepEqual(colorsOf(peg), []);
    }
  });
});
