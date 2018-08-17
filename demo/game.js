const RL = require("../rl.js");

const KeyMap = new Map([
  ["h", RL.Direction.W],
  ["j", RL.Direction.S],
  ["k", RL.Direction.N],
  ["l", RL.Direction.E],
  ["y", RL.Direction.NW],
  ["u", RL.Direction.NE],
  ["b", RL.Direction.SW],
  ["n", RL.Direction.SE],
  [".", new RL.Coord(0, 0)]
]);

class AbilityPoint {
  constructor(value) {
    [this._max, this._current] = [value, value];
  }

  plus(value) {
    this.set((this._current += value));
  }

  minus(value) {
    this.set((this._current -= value));
  }

  set(value) {
    this._current = value > this._max ? this._max : value < 0 ? 0 : value;
  }

  get value() {
    return this._current;
  }

  get max() {
    return this._max;
  }

  toString() {
    return `${this._current} / ${this._max}`;
  }
}

class Ability {
  constructor(ability) {
    this._hp = new AbilityPoint(ability.hp);
    this._hit = ability.hit;
    this._ac = ability.ac;
    this._damageDice = ability.damageDice;
  }

  get hp() {
    return this._hp;
  }

  toString() {
    return `hp: ${this._hp.toString()}`;
  }

  attack(victim) {
    const hit = new RL.Dice("1d20").roll() - this._hit;
    if (victim._ac <= hit) return { isHit: false };
    const damage = this.damage;
    victim.hp.minus(damage);
    return { isHit: true, damage: damage };
  }

  get damage() {
    return this._damageDice.roll();
  }
}

class Mobile {
  constructor(symbol, color, coord, ability) {
    [this._symbol, this._color, this._coord, this._ability] = [
      symbol,
      color,
      coord,
      new Ability(ability)
    ];
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

  get ability() {
    return this._ability;
  }

  attack(victim) {
    return this._ability.attack(victim.ability);
  }

  isDead() {
    return this.ability.hp.value <= 0;
  }
}

class Monster extends Mobile {
  constructor(symbol, color, coord, ability) {
    super(symbol, color, coord, ability);
    this.destination = null;
  }
}

class Dungeon {
  constructor() {
    this._map = new RL.Matrix(new RL.Size(39, 13));
    this._upStair = null;
  }

  get upStair() {
    return this._upStair;
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
      if (cell === RL.Generator.CellType.STAIR_UP) {
        this._upStair = coord;
      }
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

class Messages {
  constructor(size) {
    this._isUpdate = false;
    this._messages = Array(size);
    this._messages.fill("");
  }

  add(message) {
    this._isUpdate = true;
    this.pushMessage(message);
  }

  pushMessage(message) {
    this._messages.push(message);
    this._messages.shift();
  }

  update() {
    if (this._isUpdate) {
      this._isUpdate = false;
      return;
    }
    this.pushMessage("");
  }

  render(screen, y) {
    screen.move({ x: 0, y: y });
    for (const message of this._messages) {
      screen.clearLine(y++);
      screen.write(`${message}\n`);
    }
  }
}

// TODO next floor
// TODO mask monster
class Game {
  initialize(screen) {
    this._screen = screen;
    this._dungeon = new Dungeon().build();
    this._messages = new Messages(3);
    this._hero = new Mobile("@", "white", this._dungeon.upStair, {
      hp: 12,
      hit: 3,
      ac: 3,
      damageDice: new RL.Dice("1d8")
    });
    this._monsters = new Set();
    const hitDice = new RL.Dice("1d6");
    for (let c = 0; c < 7; c++) {
      this._monsters.add(
        new Monster("&", "blue", this._dungeon.randomRoomSpace(), {
          hp: hitDice.roll(),
          hit: 0,
          ac: 8,
          damageDice: hitDice
        })
      );
    }
    this._memory = new Set();
    this._fov = new RL.Fov(9, coord => {
      if (this._dungeon.outbound(coord)) return false;
      return this._dungeon.isVisible(coord) && !this.monsterAt(coord);
    });
    this._astar = new RL.Astar(coord => {
      return (
        this._dungeon.isOpen(coord) === false || this.monsterAt(coord) !== null
      );
    });
    this.render();
  }

  keyEvent(key) {
    if (this._hero.isDead()) return;
    if (KeyMap.has(key)) {
      this.move(KeyMap.get(key));
      this.moveMonsters();
    }
    this._messages.update();
    this.render();
  }

  render() {
    this._screen.clear();
    this._messages.render(this._screen, 0);
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
    this._screen.move({ x: 0, y: 13 }).write(this._hero.ability.toString());
    this._hero.render(this._screen);
    this._screen.move(this._hero.coord);
    this._screen.flush();
  }

  move(dir) {
    const newCoord = this._hero.movedCoord(dir);
    if (this._dungeon.at(newCoord) === "#") return;
    const monster = this.monsterAt(newCoord);
    if (monster) {
      this.attackTo(monster);
      return;
    }
    this._hero.moveTo(newCoord);
  }

  attackTo(monster) {
    const attack = this._hero.attack(monster);
    if (!attack.isHit) {
      this._messages.add("miss!");
      return;
    }
    if (monster.isDead()) {
      this._messages.add("killed monster!");
      this._monsters.delete(monster);
    } else {
      this._messages.add(`hit! damage ${attack.damage}`);
    }
  }

  attackFrom(monster) {
    const attack = monster.attack(this._hero);
    if (!attack.isHit) {
      this._messages.add("dodge the attack!");
      return;
    }
    if (this._hero.isDead()) {
      this._messages.add("you dead ... GAMEOVER");
      return;
    }
    this._messages.add(`you damage ${attack.damage}`);
  }

  moveMonsters() {
    for (const monster of this._monsters) {
      this.moveMonster(monster);
    }
  }

  moveMonster(monster) {
    if (monster.coord.distance(this._hero.coord) === 1) {
      monster.destination = this._hero.coord;
      this.attackFrom(monster);
      return;
    }
    let route = monster.coord.toLine(this._hero.coord);
    route.pop();
    if (route.every(coord => this._dungeon.isVisible(coord))) {
      monster.destination = this._hero.coord;
    } else {
      if (monster.destination === null) return;
      route = monster.coord.toLine(monster.destination);
    }
    if (route.length === 0) return;
    let newCoord = route.shift();
    if (this.monsterAt(newCoord)) {
      const route = this._astar.compute(monster.coord, this._hero.coord, 7);
      if (route.length === 0) return;
      newCoord = route.shift();
    }
    monster.moveTo(newCoord);
    if (monster.destination === newCoord) {
      monster.destination = null;
      this._messages.add("on dest");
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
