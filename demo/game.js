const Terminal = require("../terminal.js");
const Coord = require("../coord.js");
const Direction = require("../direction.js");
const Matrix = require("../matrix.js");
const Size = require("../size.js");
const Generator = require("../generator.js");
const Random = require("../random.js");
const Fov = require("../fov.js");
const Astar = require("../astar.js");

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

class Dungeon {
  constructor() {
    this._map = new Matrix(new Size(79, 19));
  }

  at(coord) {
    return this._map.at(coord);
  }

  build() {
    const generator = new Generator(this._map).generate();
    const CellSymbol = new Map([
      [Generator.CellType.WALL, "#"],
      [Generator.CellType.ROOM, "."],
      [Generator.CellType.ROOM_WALL, "#"],
      [Generator.CellType.EXIT, "+"],
      [Generator.CellType.CORRIDOR, " "],
      [Generator.CellType.STAIR_UP, "<"],
      [Generator.CellType.STAIR_DOWN, ">"]
    ]);
    generator.forEach((coord, cell) => {
      this._map.put(coord, CellSymbol.get(cell));
    });
    return this;
  }

  outbound(coord) {
    return !this._map.inbound(coord);
  }

  randomRoomSpace() {
    const opens = [];
    this._map.forEach(coord => {
      if (this._map.at(coord) === ".") opens.push(coord);
    });
    return Random.choice(opens);
  }

  isOpen(coord) {
    const terrain = this._map.at(coord);
    return terrain === "." || terrain === " ";
  }
}

class Game {
  initialize(screen) {
    this._screen = screen;
    this._dungeon = new Dungeon().build();
    this._hero = this._dungeon.randomRoomSpace();
    this._monster = this._dungeon.randomRoomSpace();
    this._memory = new Set();
    this._fov = new Fov(9, coord => {
      if (this._dungeon.outbound(coord)) return false;
      return this._dungeon.isOpen(coord);
    });
    this._astar = new Astar(coord => {
      return this._dungeon.at(coord) === "#";
    });
    this.render();
  }

  keyEvent(key) {
    if (KeyMap.has(key)) {
      this.move(KeyMap.get(key));
      this.moveMonster();
    }
    this.render();
  }

  render() {
    this._screen.clear();
    for (const c of this._memory) {
      this._screen.move(c).write(this._dungeon.at(c));
    }
    for (const c of this._fov.compute(this._hero)) {
      this._memory.add(c);
      this._screen.move(c).write(this._dungeon.at(c));
    }
    this._screen
      .move(this._monster)
      .write("&", "blue")
      .move(this._monster);
    this._screen
      .move(this._hero)
      .write("@")
      .move(this._hero)
      .flush();
  }

  move(dir) {
    const newCoord = this._hero.plus(dir);
    if (this._dungeon.at(newCoord) === "#") return;
    this._hero = newCoord;
  }

  moveMonster() {
    if (this._monster.distance(this._hero) > 8) return;
    const route = this._astar.compute(this._monster, this._hero);
    if (!route) return;
    if (route.length === 0) return;
    this._monster = route.pop();
  }
}

new Terminal(new Game()).start();
