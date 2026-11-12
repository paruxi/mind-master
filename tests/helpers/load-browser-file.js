// Runs one or more browser script files in Node and returns the names asked for.
// `globals` are the things the files expect to find, like `game` or `document`.

const fs = require("node:fs");
const path = require("node:path");

function loadBrowserFile(fileNames, exportNames, globals = {}) {
  const files = Array.isArray(fileNames) ? fileNames : [fileNames];
  const source = files
    .map((fileName) => fs.readFileSync(path.join(__dirname, "..", "..", fileName), "utf8"))
    .join("\n");

  const globalNames = Object.keys(globals);
  const run = new Function(...globalNames, `${source}\nreturn { ${exportNames.join(", ")} };`);

  return run(...globalNames.map((name) => globals[name]));
}

module.exports = { loadBrowserFile };
