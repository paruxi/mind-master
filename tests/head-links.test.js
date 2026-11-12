const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];

describe("<head> links", () => {
  it("links the logo as the page icon", () => {
    assert.match(head, /<link rel="icon"[^>]*href="Assets\/mind-master-logo\.svg"/);
  });

  it("only links files that exist", () => {
    const files = [...head.matchAll(/<link [^>]*href="([^"]+)"/g)].map((match) => match[1]);

    assert.ok(files.length > 0);
    for (const file of files) {
      assert.ok(fs.existsSync(path.join(__dirname, "..", file)), `${file} is missing`);
    }
  });
});
