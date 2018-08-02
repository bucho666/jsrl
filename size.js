class Size {
  constructor(width, height) {
    [this._width, this._height] = [width, height];
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  plus(other) {
    return new Size(this.width + other.width, this.height + other.height);
  }
}

module.exports = Size;
