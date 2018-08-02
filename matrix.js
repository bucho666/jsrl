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
    return new Size(this._map[0].length, this._map.length);
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
    this.forEach((coord)=>{
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
}

module.exports = Matrix;
