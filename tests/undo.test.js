const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { createFakePage } = require("./helpers/fake-browser");
const { loadBrowserFile } = require("./helpers/load-browser-file");

// A current row with 4 slots. `colors` fills the slots from the left, like script.js does.
function setUp({ colors = [], status = "playing" } = {}) {
  const page = createFakePage();
  const row = page.rows[0];

  colors.forEach((color, slot) => {
    row.pegs[slot].style.background = `var(--${color})`;
    row.pegs[slot].dataset.color = color;
  });

  const game = {
    status,
    currentGuess: [...colors],
    currentRow: row,
    selectedPeg: null,
  };

  const functions = loadBrowserFile("undo.js", ["lastFilledSlot", "undoLastColor"], {
    game,
    document: page.document,
  });

  return { game, row, ...page, ...functions };
}

describe("lastFilledSlot()", () => {
  const { lastFilledSlot } = setUp();

  it("finds the last slot that has a color", () => {
    assert.equal(lastFilledSlot(["red", "blue", "green"]), 2);
  });

  it("skips empty slots in the middle", () => {
    assert.equal(lastFilledSlot(["red", undefined, "green"]), 2);
  });

  it("gives -1 for an empty guess", () => {
    assert.equal(lastFilledSlot([]), -1);
    assert.equal(lastFilledSlot([undefined, undefined]), -1);
  });
});

describe("undoLastColor()", () => {
  it("removes the last color from the guess", () => {
    const { game, undoLastColor } = setUp({ colors: ["red", "blue"] });

    undoLastColor();

    assert.deepEqual(game.currentGuess, ["red"]);
  });

  it("clears that slot on the page", () => {
    const { row, undoLastColor } = setUp({ colors: ["red", "blue"] });

    undoLastColor();

    assert.equal(row.pegs[1].style.background, "");
    assert.equal(row.pegs[1].dataset.color, undefined);
    assert.equal(row.pegs[0].dataset.color, "red");
  });

  it("selects the emptied slot, so the next color goes there", () => {
    const { game, row, undoLastColor } = setUp({ colors: ["red", "blue"] });
    row.pegs[0].classList.add("selected-peg");

    undoLastColor();

    assert.equal(game.selectedPeg, row.pegs[1]);
    assert.ok(row.pegs[1].classList.contains("selected-peg"));
    assert.ok(!row.pegs[0].classList.contains("selected-peg"));
  });

  it("keeps the guess incomplete so it can not be submitted", () => {
    const { game, undoLastColor } = setUp({ colors: ["red", "blue", "green", "yellow"] });

    undoLastColor();

    assert.equal(game.currentGuess.length, 3);
    assert.ok(game.currentGuess.length !== 4);
  });

  it("can undo several times until the row is empty", () => {
    const { game, undoLastColor } = setUp({ colors: ["red", "blue", "green"] });

    undoLastColor();
    undoLastColor();
    undoLastColor();

    assert.deepEqual(game.currentGuess, []);
  });

  it("does nothing when the row is empty", () => {
    const { game, undoLastColor } = setUp();

    undoLastColor();

    assert.deepEqual(game.currentGuess, []);
    assert.equal(game.selectedPeg, null);
  });

  for (const status of ["won", "lost"]) {
    it(`does nothing when the game is ${status}`, () => {
      const { game, undoLastColor } = setUp({ colors: ["red"], status });

      undoLastColor();

      assert.deepEqual(game.currentGuess, ["red"]);
    });
  }
});

describe("Undo button", () => {
  it("undoes the last color when clicked", () => {
    const { game, elementsById } = setUp({ colors: ["red", "blue"] });

    elementsById["undo-btn"].listeners.click();

    assert.deepEqual(game.currentGuess, ["red"]);
  });
});
