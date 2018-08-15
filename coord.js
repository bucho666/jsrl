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

  minus(other) {
    return new Coord(this.x - other.x, this.y - other.y);
  }

  distance(other) {
    const diff = this.minus(other);
    return Math.max(Math.abs(diff.x), Math.abs(diff.y));
  }

  toLine(to) {
    const [dx, dy] = [Math.abs(to.x - this.x), Math.abs(to.y - this.y)];
    const [sx, sy] = [(this.x < to.x) ? 1 : -1, (this.y < to.y) ? 1 : -1];
    let [x, y, error] = [this.x, this.y, dx - dy];
    const line = [];
    while (x != to.x || y != to.y) {
      const error2 = error * 2;
      if (error2 > -dy) {
        error -= dy;
        x += sx;
      }
      if (error2 < dx) {
        error += dx;
        y += sy;
      }
      line.push(new Coord(x, y));
    }
    return line;
  }
}
Coord._cache = new Map();

module.exports = Coord;
