const Terminal = require("../terminal.js");
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
  initialize(screen) {
    this._screen = screen;
    this._hero = new Coord(1, 1);
    this._map = [
      "#####################",
      "#...........#.......#",
      "##..................#",
      "#.....#.....#.......#",
      "#...................#",
      "#.....##..#.#.#.....#",
      "#.........#.........#",
      "#...................#",
      "#####################"
    ];
    this._fov = new Fov(5, coord => {
      if (
        coord.y < 0 ||
        coord.y >= this._map.length ||
        coord.x < 0 ||
        coord.x >= this._map[0].length
      ) {
        return false;
      }
      return this._map[coord.y][coord.x] !== "#";
    });
    this.render();
  }

  keyEvent(key) {
    if (KeyMap.has(key.name)) {
      this.move(KeyMap.get(key.name));
    }
    this.render();
    if (key.name === "q" || key.name === "ESCAPE") {
      process.exit();
    }
  }

  move(dir) {
    const to = this._hero.plus(dir);
    if (this._map[to.y][to.x] === "#") return;
    this._hero = to;
  }

  render() {
    this._screen.clear();
    for (const c of this._fov.compute(this._hero)) {
      this._screen.move(c).write(this._map[c.y][c.x]);
    }
    this.renderHero();
    this._screen.flush();
  }

  renderHero() {
    this._screen
      .move(this._hero)
      .write("@")
      .move(this._hero);
  }
}

new Terminal(new FovDemo()).start();
