const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const box = html.match(/<section class="how-to-play"[^>]*>([\s\S]*?)<\/section>/)[1];
const lines = [...box.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((match) => match[1]);

describe("How to play box", () => {
  it("has at most 5 lines", () => {
    assert.ok(lines.length > 0 && lines.length <= 5);
  });

  it("explains the goal, the six colors, both peg types and the 10 attempts", () => {
    const text = lines.join(" ").toLowerCase();
    const words = ["secret code", "red", "blue", "green", "yellow", "purple", "orange", "black", "white", "10 attempts"];

    for (const word of words) {
      assert.ok(text.includes(word), `the box does not mention "${word}"`);
    }
  });
});
