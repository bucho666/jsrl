const Terminal = require("./terminal.js");
const Coord = require("../coord.js");
const Direction = require("../direction.js");
const Fov = require("../fov.js");

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

class FovDemo {
  initialize(term) {
    this._term = term;
    this._hero = new Coord(1, 1);
    this._map = [
      "#####################",
      "#...................#",
      "##.........#........#",
      "#.....#.....#.......#",
      "#...................#",
      "#.....##..#.#.#.....#",
      "#.........#.........#",
      "#...................#",
      "#####################"
    ];
    this._fov = new Fov(5, coord => {
      if (coord.y < 0 || coord.y >= this._map.length
        || coord.x < 0 || coord.x >= this._map[0].length) {
        return false;
      }
      return this._map[coord.y][coord.x] !== "#";
    });
    this.render();
  }

  keyEvent(key) {
    if (KeyMap.has(key)) {
      this.move(KeyMap.get(key));
    }
    this.render();
    if (key === "CTRL_C" || key === "q" || key === "ESCAPE") {
      process.exit();
    }
  }

  move(dir) {
    const to = this._hero.plus(dir);
    if (this._map[to.y][to.x] === "#") return;
    this._hero = to;
  }

  render() {
    this._term.clear();
    for (const c of this._fov.compute(this._hero)) {
      this._term.moveTo(c.x + 1, c.y + 1, this._map[c.y][c.x]);
    }
    this.renderHero();
  }

  renderHero() {
    const [x, y] = [this._hero.x + 1, this._hero.y + 1];
    this._term.moveTo(x, y, "@").moveTo(x, y);
  }
}

new Terminal(new FovDemo()).start();

