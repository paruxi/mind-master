const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map((match) => match[1]);

describe("index.html", () => {
  it("loads only script files that exist", () => {
    for (const file of scripts) {
      assert.ok(fs.existsSync(path.join(__dirname, "..", file)), `${file} is missing`);
    }
  });

  it("loads script.js before the files that use it", () => {
    assert.equal(scripts[0], "script.js");
  });

  it("loads the files in the order they depend on each other", () => {
    const order = ["feedback.js", "game-status.js", "board.js", "game-flow.js", "new-game.js", "undo.js"];
    const positions = order.map((file) => scripts.indexOf(file));

    assert.ok(positions.every((position) => position > 0), "a game file is not loaded");
    assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  });

  it("has every element the game uses", () => {
    const ids = [
      "board", "secret", "palette", "undo-btn", "submit-btn", "new-game-btn",
      "message", "attemptMessage", "attemptsNumber", "scoreCounter",
    ];

    for (const id of ids) {
      assert.ok(html.includes(`id="${id}"`), `#${id} is missing from index.html`);
    }
  });

  it("has 10 rows, each with 4 slots and 4 feedback pegs", () => {
    assert.equal((html.match(/<div class="row"/g) || []).length, 10);
    assert.equal((html.match(/class="peg" data-slot=/g) || []).length, 40);
    assert.equal((html.match(/class="mini"/g) || []).length, 40);
  });

  it("has a hidden secret peg for each position of the code", () => {
    assert.equal((html.match(/class="peg hidden"/g) || []).length, 4);
  });

  it("has a button for each of the six colors", () => {
    for (const color of ["red", "blue", "green", "yellow", "purple", "orange"]) {
      assert.ok(html.includes(`data-color="${color}"`), `${color} button is missing`);
    }
  });
});
