const Coord = require("./coord.js");
const Direction = require("./direction.js");

class Vector {
  constructor(coord, slope) {
    this._coord = coord;
    this._slope = slope;
  }

  get x() {
    return Math.floor(this._coord.x);
  }
  get y() {
    return Math.floor(this._coord.y);
  }

  plus(other) {
    return new Vector(this._coord.plus(other), this._slope);
  }

  minus(other) {
    return new Vector(this._coord.minus(other), this._slope);
  }

  step() {
    return new Vector(new Coord(this.x + this._slope, this.y + 1), this._slope);
  }

  toOctant(center, octant) {
    const diff = this.minus(center);
    switch (octant) {
      case 0:
        return this;
      case 1:
        return new Vector(center.plus(new Coord(diff.y, diff.x)), this._slope);
      case 2:
        return new Vector(center.plus(new Coord(-diff.x, diff.y)), this._slope);
      case 3:
        return new Vector(center.plus(new Coord(-diff.y, diff.x)), this._slope);
      case 4:
        return new Vector(center.plus(new Coord(diff.x, -diff.y)), this._slope);
      case 5:
        return new Vector(center.plus(new Coord(diff.y, -diff.x)), this._slope);
      case 6:
        return new Vector(
          center.plus(new Coord(-diff.x, -diff.y)),
          this._slope
        );
      case 7:
        return new Vector(
          center.plus(new Coord(-diff.y, -diff.x)),
          this._slope
        );
    }
  }
}

class Fov {
  constructor(radius, isVisible) {
    this._isVisible = isVisible;
    this._start = null;
    this._radius = Math.pow(radius, 2);
  }

  compute(coord) {
    this._visiblePoints = [coord];
    this._start = coord;
    for (let octant = 0; octant < 8; octant++) {
      this.scan(new Vector(coord, 0), new Vector(coord, 1), octant);
    }
    return this._visiblePoints;
  }

  scan(begin, end, octant) {
    while (this.isInsight(begin)) {
      begin = begin.step();
      end = end.step();
      this.scanLine(begin, end, octant);
      const views = this.splitView(begin, end, octant);
      for (const view of views) {
        this.scan(view.begin, view.end, octant);
      }
      break;
    }
  }

  scanLine(begin, end, octant) {
    let current = begin;
    while (current.x <= end.x) {
      this._visiblePoints.push(current.toOctant(this._start, octant));
      current = current.plus(Direction.E);
    }
  }

  splitView(begin, end, octant) {
    const result = [];
    let current = begin,
      lastVisible = null;
    while (current.x <= end.x) {
      const visible = this._isVisible(current.toOctant(this._start, octant));
      if (visible && lastVisible === null) {
        lastVisible = current;
      } else if (!visible && lastVisible) {
        result.push(this.createView(lastVisible, current.plus(Direction.W)));
        lastVisible = null;
      }
      current = current.plus(Direction.E);
    }
    if (lastVisible === null) return result;
    result.push(this.createView(lastVisible, current.plus(Direction.W)));
    return result;
  }

  createView(begin, end) {
    return {
      begin: new Vector(begin, this.calculateSlope(begin)),
      end: new Vector(end, this.calculateSlope(end))
    };
  }

  calculateSlope(coord) {
    const distance = coord.minus(this._start);
    return distance.x / distance.y;
  }

  isInsight(coord) {
    const distance = coord.minus(this._start);
    return Math.pow(distance.x, 2) + Math.pow(distance.y, 2) <= this._radius;
  }
}

module.exports = Fov;
