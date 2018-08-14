const Terminal = require("../terminal.js");
const Coord = require("../coord.js");
const Direction = require("../direction.js");
const Random = require("../random.js");

const KeyMap = new Map([
  ["h", Direction.W],
  ["j", Direction.S],
  ["k", Direction.N],
  ["l", Direction.E],
  ["y", Direction.NW],
  ["u", Direction.NE],
  ["b", Direction.SW],
  ["n", Direction.SE]
]);

class Demo {
  initialize(screen) {
    this._pos = new Coord(1, 1);
    this._screen = screen;
  }

  keyEvent(key) {
    if (KeyMap.has(key.name)) {
      this._pos = this._pos.plus(KeyMap.get(key.name));
    }
    this._screen.clear();
    this._screen.write("##############################\n");
    const colors = [
      "red",
      "green",
      "yellow",
      "blue",
      "magenta",
      "cyan",
      "white"
    ];
    for (let y = 0; y < 16; y++) {
      this._screen.write("#");
      for (let x = 0; x < 28; x++) {
        if (Random.choice([true, false])) {
          this._screen.write(
            ".",
            Random.choice(colors),
            Random.choice([true, false]),
            Random.choice(colors)
          );
        } else {
          this._screen.write(
            ".",
            Random.choice(colors),
            Random.choice([true, false])
          );
        }
      }
      this._screen.write("#\n");
    }
    this._screen.write("##############################\n");
    this._screen.write(`key=${key.name} x=${this._pos.x} y=${this._pos.y}`);
    this._screen
      .move(this._pos)
      .write("@", "white")
      .move(this._pos);
    this._screen.flush();
  }
}

new Terminal(new Demo()).start();
