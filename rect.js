const Coord = require("./coord.js");
const Size = require("./size.js");
class Rect {
  constructor(coord, size) {
    this._coord = coord;
    this._size = size;
  }

  get x() {
    return this._coord.x;
  }

  get y() {
    return this._coord.y;
  }

  get height() {
    return this._size.height;
  }

  get width() {
    return this._size.width;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height - 1;
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width - 1;
  }

  get topLeft() {
    return this._coord;
  }

  get topRight() {
    return new Coord(this.right, this.y);
  }

  get bottomLeft() {
    return new Coord(this.x, this.bottom);
  }

  get bottomRight() {
    return new Coord(this.right, this.bottom);
  }

  get topSide() {
    const result = [];
    for (let x = this.x; x <= this.right; x++) {
      result.push(new Coord(x, this.y));
    }
    return result;
  }

  get leftSide() {
    const result = [];
    for (let y = this.y; y <= this.bottom; y++) {
      result.push(new Coord(this.x, y));
    }
    return result;
  }

  get rightSide() {
    const result = [];
    for (let y = this.y; y <= this.bottom; y++) {
      result.push(new Coord(this.right, y));
    }
    return result;
  }

  get bottomSide() {
    const result = [];
    for (let x = this.x; x <= this.right; x++) {
      result.push(new Coord(x, this.bottom));
    }
    return result;
  }

  expand(value) {
    return new Rect(
      this._coord,
      new Size(this.width + value, this.height + value)
    );
  }

  contract(value) {
    return this.expand(-value);
  }

  inbound(coord) {
    return (
      this.x <= coord.x &&
      coord.x <= this.right &&
      this.y <= coord.y &&
      coord.y <= this.bottom
    );
  }

  isOverlap(rect) {
    return (
      this.inbound(rect.bottomRight) ||
      this.inbound(rect.bottomLeft) ||
      this.inbound(rect.topRight) ||
      this.inbound(rect.topLeft) ||
      (rect.inbound(this.bottomRight) ||
        rect.inbound(this.bottomLeft) ||
        rect.inbound(this.topRight) ||
        rect.inbound(this.topLeft))
    );
  }

  get frame() {
    return [
      ...new Set([
        ...this.topSide,
        ...this.leftSide,
        ...this.rightSide,
        ...this.bottomSide
      ])
    ];
  }

  *[Symbol.iterator]() {
    for (let y = this.y; y <= this.bottom; y++) {
      for (let x = this.x; x <= this.right; x++) {
        yield new Coord(x, y);
      }
    }
  }
}

module.exports = Rect;
