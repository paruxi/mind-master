// Fake `document` and `localStorage`, so the browser scripts can run in Node.
// Elements record their listeners, so a test can click them with element.listeners.click(event).

function createFakeElement() {
  const classes = new Set();
  const listeners = {};

  return {
    dataset: {},
    listeners,
    style: {},
    textContent: "",
    children: [],
    replaceChildren(...nodes) {
      this.children = nodes;
    },
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
      toggle: (name) => (classes.has(name) ? classes.delete(name) : classes.add(name)),
      contains: (name) => classes.has(name),
    },
    addEventListener: (type, handler) => {
      listeners[type] = handler;
    },
    closest: () => null,
    querySelector: () => createFakeElement(),
    querySelectorAll: () => [],
  };
}

function createFakeStorage(startingValues = {}) {
  const values = { ...startingValues };

  return {
    getItem: (key) => (key in values ? values[key] : null),
    setItem: (key, value) => {
      values[key] = String(value);
    },
    removeItem: (key) => {
      delete values[key];
    },
  };
}

function createFakeElements(count) {
  return Array.from({ length: count }, () => createFakeElement());
}

// A fake page with 10 rows (4 pegs and 4 feedback pegs each) and a secret row.
// getElementById() gives the same fake element for the same id.
function createFakePage() {
  const rows = Array.from({ length: 10 }, (_, number) => {
    const row = createFakeElement();
    row.dataset.row = String(number);
    row.pegs = createFakeElements(4);
    row.minis = createFakeElements(4);
    row.querySelectorAll = (selector) => {
      if (selector === ".guess .peg") return row.pegs;
      if (selector === ".feedback .mini") return row.minis;
      return [];
    };
    return row;
  });

  const secretPegs = createFakeElements(4);
  secretPegs.forEach((peg) => peg.classList.add("hidden"));

  const elementsById = {};

  const documentListeners = {};

  const document = {
    listeners: documentListeners,
    addEventListener: (type, handler) => {
      documentListeners[type] = handler;
    },
    querySelector: (selector) => {
      const match = selector.match(/data-row="(\d+)"/);
      return match ? rows[Number(match[1])] : null;
    },
    querySelectorAll: (selector) => {
      if (selector === "#secret .peg") return secretPegs;
      if (selector === ".row") return rows;
      return [];
    },
    getElementById: (id) => {
      elementsById[id] = elementsById[id] || createFakeElement();
      return elementsById[id];
    },
  };

  return { rows, secretPegs, elementsById, document };
}

const PEG_COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];

// The color class names (like "red") that a fake element has.
function colorsOf(element) {
  return PEG_COLORS.filter((color) => element.classList.contains(color));
}

module.exports = {
  colorsOf,
  createFakeElement,
  createFakeElements,
  createFakePage,
  createFakeStorage,
};
