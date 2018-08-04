const Matrix = require("./matrix.js");
const Coord = require("./coord.js");
const Size = require("./size.js");
const Rect = require("./rect.js");
const Random = require("./random.js");
const Direction = require("./direction.js");

const CellFlag = {
  NO_FLAG: Symbol(),
  ROOM: Symbol(),
  ROOM_WALL: Symbol(),
  EXIT: Symbol()
};

class Room extends Rect {
  constructor(coord, size) {
    super(coord, size);
  }

  render(map) {
    for (const c of this.inside) {
      map.put(c, CellFlag.ROOM);
    }
    for (const c of this.frame) {
      map.put(c, CellFlag.ROOM_WALL);
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
    this.render();
  }

  create_exits() {
    for (const room of this._rooms) {
      const exits = room.exit_candidate.filter(coord => {
        return !this._map.isEdge(coord);
      });
      for (let c = 0; c <= room.random_exit_number; c++) {
        this._map.put(exits.randomChoice(), CellFlag.EXIT);
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
      this.has(room.topLeft) &&
      this.has(room.topRight) &&
      this.has(room.bottomLeft) &&
      this.has(room.bottomRight)
    );
  }

  has(coord) {
    return (
      coord.x >= 0 &&
      coord.y >= 0 &&
      coord.x < this._map.width &&
      coord.y < this._map.height
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
    return Math.floor(map_area / room_area_max);
  }

  initialize() {
    this._map.fill(CellFlag.NO_FLAG);
  }

  render() {
    let line = "";
    const symbol = new Map([
      [CellFlag.NO_FLAG, "_"],
      [CellFlag.ROOM, "."],
      [CellFlag.ROOM_WALL, "#"],
      [CellFlag.EXIT, "+"]
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
