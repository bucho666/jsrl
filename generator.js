const Matrix = require("./matrix.js");
const Coord = require("./coord.js");
const Size = require("./size.js");
const Rect = require("./rect.js");
const Random = require("./random.js");
const Direction = require("./direction.js");

const CellType = {
  WALL: 1 << 0,
  ROOM: 1 << 1,
  ROOM_WALL: 1 << 2,
  EXIT: 1 << 3,
  CORRIDOR: 1 << 4,
  STAIR_UP: 1 << 5,
  STAIR_DOWN: 1 << 6
};
CellType.STAIR = CellType.STAIR_DOWN | CellType.STAIR_UP;
CellType.OPEN =
  CellType.ROOM | CellType.EXIT | CellType.CORRIDOR | CellType.STAIR;

class Room extends Rect {
  constructor(coord, size) {
    super(coord, size);
  }

  put(map) {
    for (const c of this.inside) {
      map.put(c, CellType.ROOM);
    }
    for (const c of this.frame) {
      map.put(c, CellType.ROOM_WALL);
    }
  }

  get exitCandidate() {
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

  get randomExitNumber() {
    return Random.number(1, Math.floor(Math.sqrt(this.width * this.height)));
  }
}

class Generator {
  constructor(size, config = { rooms: 64, remove_deadends: 50 }) {
    this._map = new Matrix(size);
    this._rooms = [];
    this._deadends = [];
    this._config = config;
  }

  generate() {
    this.initialize();
    this.createRooms();
    this.createExits();
    this.createCorridor();
    this.updateDeadends();
    this.createStair();
    this.closeDeadends();
    return this;
  }

  forEach(f) {
    this._map.forEach(f);
  }

  get rooms() {
    return [...this.rooms];
  }

  closeDeadends() {
    for (const deadend of this._deadends) {
      if (Random.percentage(this._config.remove_deadends)) {
        this.closeDeadend(deadend);
      }
    }
  }

  closeDeadend(coord) {
    if (this._map.at(coord) & CellType.STAIR) {
      return;
    }
    const sides = this.openSide(coord);
    if (sides.length !== 1) {
      return;
    }
    this._map.put(coord, CellType.WALL);
    this.closeDeadend(sides[0]);
  }

  createStair() {
    this._map.put(Random.pop(this._deadends), CellType.STAIR_UP);
    this._map.put(Random.pop(this._deadends), CellType.STAIR_DOWN);
  }

  updateDeadends() {
    this.forEachOddCoords(coord => {
      if (this._map.at(coord) !== CellType.CORRIDOR) {
        return;
      }
      const sides = this.openSide(coord);
      if (sides.length === 1) {
        this._deadends.push(coord);
      }
    });
  }

  openSide(coord) {
    let sides = [];
    for (const dir of Direction.CROSS) {
      const side = coord.plus(dir);
      if (this._map.at(side) & CellType.OPEN) {
        sides.push(side);
      }
    }
    return sides;
  }

  createCorridor() {
    this.forEachOddCoords(coord => {
      this.digCorridor(coord);
    });
  }

  forEachOddCoords(f) {
    this._map.forEach(coord => {
      if (this.isOddCoord(coord)) {
        f(coord);
      }
    });
  }

  isOddCoord(coord) {
    return coord.x % 2 && coord.y % 2;
  }

  digCorridor(coord) {
    if (!this._map.at(coord) && CellType.WALL | CellType.ROOM) {
      return;
    }
    if (this._map.at(coord) === CellType.WALL) {
      this._map.put(coord, CellType.CORRIDOR);
    }
    for (const dir of Random.shffule(Direction.CROSS)) {
      const step2 = coord.plus(dir).plus(dir);
      if (this._map.inbound(step2) && this._map.at(step2) === CellType.WALL) {
        this._map.put(coord.plus(dir), CellType.CORRIDOR);
        this.digCorridor(step2);
      }
    }
  }

  createExits() {
    for (const room of this._rooms) {
      const exits = room.exitCandidate.filter(coord => {
        return !this._map.isEdge(coord);
      });
      for (let c = 0; c <= room.randomExitNumber; c++) {
        const coord = Random.choice(exits);
        this._map.put(coord, CellType.EXIT);
      }
    }
  }

  createRooms() {
    for (let c = 0; c < this._config.rooms; c++) {
      const room = new Room(this.randomRoomCoord(), this.randomRoomSize());
      if (this.valiableRoom(room)) {
        this._rooms.push(room);
      }
    }
    for (const room of this._rooms) {
      room.put(this._map);
    }
  }

  valiableRoom(room) {
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

  randomRoomCoord() {
    const x = Random.number(0, this._map.width / 2) * 2;
    const y = Random.number(0, this._map.height / 2) * 2;
    return new Coord(x, y);
  }

  randomRoomSize() {
    return new Size(Random.number(2, 9) * 2 + 1, Random.number(2, 3) * 2 + 1);
  }

  initialize() {
    this._map.fill(CellType.WALL);
  }

  render() {
    let line = "";
    const symbol = new Map([
      [CellType.WALL, "#"],
      [CellType.ROOM, "."],
      [CellType.ROOM_WALL, "#"],
      [CellType.EXIT, "+"],
      [CellType.CORRIDOR, "."],
      [CellType.STAIR_UP, "<"],
      [CellType.STAIR_DOWN, ">"]
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

Generator.CellType = CellType;

module.exports = Generator;
