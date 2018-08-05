const Matrix = require("./matrix.js");
const Coord = require("./coord.js");
const Size = require("./size.js");
const Rect = require("./rect.js");
const Random = require("./random.js");
const Direction = require("./direction.js");

const CellFlag = {
  NO_FLAG: 1 << 0,
  ROOM: 1 << 1,
  ROOM_WALL: 1 << 2,
  EXIT: 1 << 3,
  CORRIDOR: 1 << 4,
  STAIR_UP: 1 << 5,
  STAIR_DOWN: 1 << 6
};
CellFlag.STAIR = CellFlag.STAIR_DOWN | CellFlag.STAIR_UP;
CellFlag.OPEN =
  CellFlag.ROOM | CellFlag.EXIT | CellFlag.CORRIDOR | CellFlag.STAIR;

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
  constructor() {
    this._map = new Matrix(new Size(79, 21));
    this._rooms = [];
    this._exits = [];
    this._deadends = [];
    this._remove_deadends = 50;
  }

  run() {
    this.initialize();
    this.createRooms();
    this.createExits();
    this.createCorridor();
    this.updateDeadends();
    this.createStair();
    this.closeDeadends();
    this.render();
  }

  closeDeadends() {
    for (const deadend of this._deadends) {
      this.closeDeadend(deadend);
    }
  }

  closeDeadend(coord) {
    if (this._map.at(coord) & CellFlag.STAIR) {
      return;
    }
    const sides = this.openSide(coord);
    if (sides.length !== 1) {
      return;
    }
    if (Random.percentage(this._remove_deadends)) {
      this._map.put(coord, CellFlag.NO_FLAG);
      this.closeDeadend(sides[0]);
    }
  }

  createStair() {
    this._map.put(this._deadends.randomPop(), CellFlag.STAIR_UP);
    this._map.put(this._deadends.randomPop(), CellFlag.STAIR_DOWN);
  }

  updateDeadends() {
    this.forEachOddCoords(coord => {
      if (this._map.at(coord) !== CellFlag.CORRIDOR) {
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
      if (this._map.at(side) & CellFlag.OPEN) {
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
    if (!this._map.at(coord) && CellFlag.NO_FLAG | CellFlag.ROOM) {
      return;
    }
    this._map.put(coord, CellFlag.CORRIDOR);
    for (const dir of Direction.CROSS.shuffle()) {
      const step2 = coord.plus(dir).plus(dir);
      if (
        this._map.inbound(step2) &&
        this._map.at(step2) === CellFlag.NO_FLAG
      ) {
        this._map.put(coord.plus(dir), CellFlag.CORRIDOR);
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
        this._map.put(exits.randomChoice(), CellFlag.EXIT);
      }
    }
  }

  createRooms() {
    for (let c = 0; c < this.roomNumber; c++) {
      const room = new Room(this.randomRoomCoord(), this.randomRoomSize());
      if (this.valiableRoom(room)) {
        this._rooms.push(room);
      }
    }
    for (const room of this._rooms) {
      room.render(this._map);
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

  get roomNumber() {
    const map_area = this._map.height * this._map.width;
    const room_area_max = 45;
    return Math.floor((map_area / room_area_max) * 2);
  }

  initialize() {
    this._map.fill(CellFlag.NO_FLAG);
  }

  render() {
    let line = "";
    const symbol = new Map([
      [CellFlag.NO_FLAG, "#"],
      [CellFlag.ROOM, "."],
      [CellFlag.ROOM_WALL, "#"],
      [CellFlag.EXIT, "+"],
      [CellFlag.CORRIDOR, "."],
      [CellFlag.STAIR_UP, "<"],
      [CellFlag.STAIR_DOWN, ">"]
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
