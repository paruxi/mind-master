const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const css = fs.readFileSync(path.join(__dirname, "..", "style.css"), "utf8");
const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];

// Finds the symbol that style.css puts after a selector, like `.peg.red::after`.
function symbolFor(selector) {
  const escaped = selector.replace(/[.[\]"=:()]/g, "\\$&");
  const rule = css.match(new RegExp(`${escaped}[^{]*\\{[^}]*content:\\s*"([^"]+)"`));
  return rule ? rule[1] : null;
}

describe("color symbols", () => {
  for (const color of COLORS) {
    it(`${color} has the same symbol on guess pegs, secret pegs and its palette button`, () => {
      const onGuessPeg = symbolFor(`.peg[data-color="${color}"]::after`);
      const onSecretPeg = symbolFor(`.peg.${color}::after`);
      const onButton = symbolFor(`.color-btn[data-color="${color}"]::after`);

      assert.ok(onGuessPeg, `no symbol for the ${color} guess peg`);
      assert.equal(onGuessPeg, onSecretPeg);
      assert.equal(onGuessPeg, onButton);
    });
  }

  it("uses a different symbol for each color", () => {
    const symbols = COLORS.map((color) => symbolFor(`.peg.${color}::after`));

    assert.equal(new Set(symbols).size, COLORS.length);
  });
});
