const RL = require("../rl.js");

const KeyMap = new Map([
  ["h", RL.Direction.W],
  ["j", RL.Direction.S],
  ["k", RL.Direction.N],
  ["l", RL.Direction.E],
  ["y", RL.Direction.NW],
  ["u", RL.Direction.NE],
  ["b", RL.Direction.SW],
  ["n", RL.Direction.SE]
]);

class Mobile {
  constructor(symbol, color, coord) {
    [this._symbol, this._color, this._coord] = [symbol, color, coord];
  }

  get coord() {
    return this._coord;
  }

  movedCoord(dir) {
    return this._coord.plus(dir);
  }

  distance(other) {
    return this._coord.distance(other._coord);
  }

  isAt(coord) {
    return this._coord.equal(coord);
  }

  moveTo(coord) {
    this._coord = coord;
  }

  render(screen) {
    screen.move(this._coord).write(this._symbol, this._color);
  }
}

class Dungeon {
  constructor() {
    this._map = new RL.Matrix(new RL.Size(39, 13));
  }

  at(coord) {
    return this._map.at(coord);
  }

  build() {
    const generator = new RL.Generator(this._map).generate();
    const CellSymbol = new Map([
      [RL.Generator.CellType.WALL, "#"],
      [RL.Generator.CellType.ROOM, "."],
      [RL.Generator.CellType.ROOM_WALL, "#"],
      [RL.Generator.CellType.EXIT, "+"],
      [RL.Generator.CellType.CORRIDOR, " "],
      [RL.Generator.CellType.STAIR_UP, "<"],
      [RL.Generator.CellType.STAIR_DOWN, ">"]
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
    return RL.Random.choice(opens);
  }

  isOpen(coord) {
    const terrain = this._map.at(coord);
    return terrain === "." || terrain === " " || terrain === "+";
  }

  isVisible(coord) {
    const terrain = this._map.at(coord);
    return terrain === "." || terrain === " ";
  }
}

// TODO Messsages
class Game {
  initialize(screen) {
    this._screen = screen;
    this._dungeon = new Dungeon().build();
    this._hero = new Mobile("@", "white", this._dungeon.randomRoomSpace());
    this._monsters = new Set();
    for (let c = 0; c < 7; c++) {
      this._monsters.add(
        new Mobile("&", "blue", this._dungeon.randomRoomSpace())
      );
    }
    this._memory = new Set();
    this._fov = new RL.Fov(9, coord => {
      if (this._dungeon.outbound(coord)) return false;
      return this._dungeon.isVisible(coord) && !this.monsterAt(coord);
    });
    this._astar = new RL.Astar(coord => {
      return this._dungeon.isOpen(coord) === false || this.monsterAt(coord);
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
    this._screen.setOffset({ x: 0, y: 3 });
    for (const c of this._memory) {
      this._screen.move(c).write(this._dungeon.at(c));
    }
    for (const c of this._fov.compute(this._hero.coord)) {
      this._memory.add(c);
      this._screen.move(c).write(this._dungeon.at(c));
    }
    for (const monster of this._monsters) {
      monster.render(this._screen);
    }
    this._hero.render(this._screen);
    this._screen.move(this._hero.coord);
    this._screen.flush();
  }

  move(dir) {
    const newCoord = this._hero.movedCoord(dir);
    if (this._dungeon.at(newCoord) === "#") return;
    const monster = this.monsterAt(newCoord);
    if (monster) {
      this._monsters.delete(monster);
      return;
    }
    this._hero.moveTo(newCoord);
  }

  moveMonster() {
    for (const monster of this._monsters) {
      const route = this._astar.compute(monster.coord, this._hero.coord, 6);
      if (route.length === 0) continue;
      const newCoord = route.shift();
      if (this.monsterAt(newCoord)) return;
      if (this._hero.coord === newCoord) return;
      monster.moveTo(newCoord);
    }
  }

  monsterAt(coord) {
    for (const monster of this._monsters) {
      if (monster.coord === coord) return monster;
    }
    return null;
  }
}

new RL.Terminal(new Game()).start();
