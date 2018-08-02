class Coord {
  constructor(x = 0, y = 0) {
    const name = `${x}:${y}`;
    if (Coord._cache.has(name)) {
      return Coord._cache.get(name);
    }
    [this._x, this._y] = [x, y];
    Coord._cache.set(name, this);
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  plus(other) {
    return new Coord(this.x + other.x, this.y + other.y);
  }
}
Coord._cache = new Map();

module.exports = Coord;
