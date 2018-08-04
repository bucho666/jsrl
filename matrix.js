const Size = require("./size");
const Coord = require("./coord");

class Matrix {
  constructor(size) {
    this._map = new Array(size.height);
    for (let y = 0; y < size.height; y++) {
      this._map[y] = new Array(size.width);
    }
  }

  get size() {
    return new Size(this.width, this.height);
  }

  get height() {
    return this._map.length;
  }

  get width() {
    return this._map[0].length;
  }

  at(coord) {
    return this._map[coord.y][coord.x];
  }

  put(coord, value) {
    this._map[coord.y][coord.x] = value;
  }

  remove(coord) {
    this._map[coord.y][coord.x] = undefined;
  }

  exists(coord) {
    return this.at(coord) !== undefined;
  }

  fill(value) {
    this.forEach(coord => {
      this.put(coord, value);
    });
  }

  forEach(f) {
    for (let y = 0; y < this._map.length; y++) {
      for (let x = 0; x < this._map[y].length; x++) {
        const coord = new Coord(x, y);
        f(coord, this.at(coord));
      }
    }
  }

  isEdge(coord) {
    return (
      coord.x === 0 ||
      coord.x === this.width - 1 ||
      coord.y === 0 ||
      coord.y === this.height - 1
    );
  }

  inbound(coord) {
    return (
      coord.x >= 0 &&
      coord.y >= 0 &&
      coord.x < this.width &&
      coord.y < this.height
    );
  }
}

module.exports = Matrix;
