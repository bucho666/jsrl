const Matrix = require("./matrix.js");
const Coord = require("./coord.js");
const Size = require("./size.js");
const Rect = require("./rect.js");
const Random = require("./random.js");
const Direction = require("./direction.js");

const CellType = {
  NO_FLAG: Symbol(),
  ROOM: Symbol(),
  ROOM_WALL: Symbol(),
  EXIT: Symbol(),
  CORRIDOR: Symbol()
};

class Room extends Rect {
  constructor(coord, size) {
    super(coord, size);
  }

  render(map) {
    for (const c of this.inside) {
      map.put(c, CellType.ROOM);
    }
    for (const c of this.frame) {
      map.put(c, CellType.ROOM_WALL);
    }
  }

  get exit_candidate() {
    return [
      ...this.topSide,
      ...this.leftSide,
      ...this.rightSide,
      ...this.bottomSide
    ].filter(c => {
      return c.x % 2 || c.y % 2;
    });
  }

  get inside() {
    return new Rect(this._coord.plus(Direction.SE), this._size).contract(2);
  }

  get random_exit_number() {
    return Random.number(1, Math.floor(Math.sqrt(this.width * this.height)));
  }
}

class Generator {
  constructor() {
    this._map = new Matrix(new Size(79, 21));
    this._rooms = [];
    this._exits = [];
  }

  run() {
    this.initialize();
    this.create_room();
    this.create_exits();
    this.create_corridor();
    this.render();
  }

  create_corridor() {
    this._map.forEach(coord => {
      if (coord.x % 2 && coord.y % 2) {
        this.dig_corridor(coord);
      }
    });
  }

  dig_corridor(coord) {
    if (
      this._map.at(coord) !== CellType.NO_FLAG &&
      this._map.at(coord) !== CellType.ROOM
    ) {
      return;
    }
    this._map.put(coord, CellType.CORRIDOR);
    for (const dir of Direction.CROSS.shuffle()) {
      const step2 = coord.plus(dir).plus(dir);
      if (
        this._map.inbound(step2) &&
        this._map.at(step2) === CellType.NO_FLAG
      ) {
        this._map.put(coord.plus(dir), CellType.CORRIDOR);
        this.dig_corridor(step2);
      }
    }
  }

  create_exits() {
    for (const room of this._rooms) {
      const exits = room.exit_candidate.filter(coord => {
        return !this._map.isEdge(coord);
      });
      for (let c = 0; c <= room.random_exit_number; c++) {
        this._map.put(exits.randomChoice(), CellType.EXIT);
      }
    }
  }

  create_room() {
    for (let c = 0; c < this.room_number; c++) {
      const room = new Room(this.random_room_coord(), this.random_room_size());
      if (this.valiable_room(room)) {
        this._rooms.push(room);
      }
    }
    for (const room of this._rooms) {
      room.render(this._map);
    }
  }

  valiable_room(room) {
    for (const other_room of this._rooms) {
      if (other_room.isOverlap(room)) {
        return false;
      }
    }
    return (
      this._map.inbound(room.topLeft) &&
      this._map.inbound(room.topRight) &&
      this._map.inbound(room.bottomLeft) &&
      this._map.inbound(room.bottomRight)
    );
  }

  random_room_coord() {
    const x = Random.number(0, this._map.width / 2) * 2;
    const y = Random.number(0, this._map.height / 2) * 2;
    return new Coord(x, y);
  }

  random_room_size() {
    return new Size(Random.number(2, 9) * 2 + 1, Random.number(2, 3) * 2 + 1);
  }

  get room_number() {
    const map_area = this._map.height * this._map.width;
    const room_area_max = 45;
    return Math.floor((map_area / room_area_max) * 2);
  }

  initialize() {
    this._map.fill(CellType.NO_FLAG);
  }

  render() {
    let line = "";
    const symbol = new Map([
      [CellType.NO_FLAG, "#"],
      [CellType.ROOM, "."],
      [CellType.ROOM_WALL, "#"],
      [CellType.EXIT, "+"],
      [CellType.CORRIDOR, "."]
    ]);
    this._map.forEach((coord, cell) => {
      line += symbol.get(cell);
      if (coord.x === this._map.width - 1) {
        console.log(line);
        line = "";
      }
    });
  }
}

new Generator().run();
