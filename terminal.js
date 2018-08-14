const readline = require("readline");

const Color = new Map([
  ["black", 0],
  ["red", 1],
  ["green", 2],
  ["yellow", 3],
  ["blue", 4],
  ["magenta", 5],
  ["cyan", 6],
  ["white", 7]
]);

class Cell {
  constructor(ch, color = null, isBold = null, bgColor = null) {
    this._ch = ch;
    this._color = color;
    this._isBold = isBold;
    this._bgColor = bgColor;
  }

  get ch() {
    return this._ch;
  }

  get attr() {
    let attr = "";
    if (this._isBold) attr += "\x1b[1m";
    if (this._color) attr += `\x1b[3${this.colorID(this._color)}m`;
    if (this._bgColor) attr += `\x1b[4${this.colorID(this._bgColor)}m`;
    return attr;
  }

  colorID(name) {
    if (Color.has(name)) return Color.get(name);
    return 7;
  }
}

const Space = new Cell(" ");

class Screen {
  constructor(size) {
    this._cells = new Array(size.height);
    for (let y = 0; y < size.height; y++) {
      this._cells[y] = new Array(size.width);
    }
    this._cursor = { x: 0, y: 0 };
    this.clear();
  }

  clear() {
    for (const line of this._cells) {
      line.fill(Space);
    }
    this._cursor = { x: 0, y: 0 };
    return this;
  }

  move(coord) {
    [this._cursor.x, this._cursor.y] = [coord.x, coord.y];
    return this;
  }

  write(text, color = null, isBold = null, bgColor = null) {
    for (const ch of text) {
      if (ch === "\n") {
        this._cursor.x = 0;
        this._cursor.y++;
        continue;
      }
      const x = this._cursor.x,
        y = this._cursor.y;
      if (this._cells[y] === undefined || this._cells[y][x] === undefined) {
        return this;
      }
      this._cells[y][this._cursor.x++] = new Cell(ch, color, isBold, bgColor);
    }
    return this;
  }

  flush() {
    let output = "\x1b[2J\x1b[1;1H\x1b[0m";
    let lastAttr = "";
    for (const line of this._cells) {
      for (const cell of line) {
        const attr = cell.attr;
        if (attr == lastAttr) {
          output += cell.ch;
          continue;
        }
        lastAttr = attr;
        output += `\x1b[0m${attr}${cell.ch}`;
      }
      output += "\n";
    }
    output += `\x1b[${this._cursor.y + 1};${this._cursor.x + 1}H`;
    process.stdout.write(output);
  }
}

class Terminal {
  constructor(app, size = { width: 80, height: 20 }) {
    this._console = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });
    this._app = app;
    this._size = size;
  }

  async start() {
    process.stdin.setRawMode(true);
    readline.emitKeypressEvents(process.stdin);
    this._app.initialize(new Screen(this._size));
    await this.mainLoop();
  }

  async mainLoop() {
    return new Promise(resolve => {
      process.stdin.on("keypress", (ch, key) => {
        if (key.name === "c" && key.ctrl) {
          this._console.close();
          return;
        }
        this._app.keyEvent(key.sequence, key);
      });
    });
  }
}

module.exports = Terminal;
