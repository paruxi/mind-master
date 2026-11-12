// Loads script.js in Node with a fake page, fake localStorage and a silent console.

const { createFakePage, createFakeStorage } = require("./fake-browser");
const { loadBrowserFile } = require("./load-browser-file");

const EXPORTED_NAMES = ["generateSecretCode", "startGame", "game"];

function loadScript({ storage = createFakeStorage() } = {}) {
  const page = createFakePage();
  const globals = {
    document: page.document,
    localStorage: storage,
    console: { log: () => {} },
  };

  return { ...loadBrowserFile("script.js", EXPORTED_NAMES, globals), page, storage };
}

module.exports = { loadScript };
