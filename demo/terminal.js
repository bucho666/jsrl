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

const Colors = [
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white"
];

class Demo {
  initialize(screen) {
    this._pos = new Coord(1, 1);
    this._screen = screen;
    this._key = "";
    this.render();
  }

  keyEvent(key) {
    this._key = key;
    if (KeyMap.has(key)) {
      this._pos = this._pos.plus(KeyMap.get(key));
    }
    this.render();
  }

  render() {
    this._screen.clear();
    this._screen.setOffset({x: 2, y:2});
    this._screen.write("##############################\n");
    for (let y = 0; y < 14; y++) {
      this._screen.write("#");
      for (let x = 0; x < 28; x++) {
        if (Random.choice([true, false])) {
          this._screen.write(
            ".",
            Random.choice(Colors),
            Random.choice([true, false]),
            Random.choice(Colors)
          );
        } else {
          this._screen.write(
            ".",
            Random.choice(Colors),
            Random.choice([true, false])
          );
        }
      }
      this._screen.write("#\n");
    }
    this._screen.write("##############################\n");
    this._screen.write(`key=${this._key} x=${this._pos.x} y=${this._pos.y}`);
    this._screen.clearLine(5);
    this._screen.clearLine(7);
    this._screen.clearLine(9);
    this._screen
      .move(this._pos)
      .write("@", "white")
      .move(this._pos);
    this._screen.flush();
  }
}

new Terminal(new Demo()).start();
