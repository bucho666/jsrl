const Random = require("./random.js");

class Range {
  constructor(min, max) {
    this._min = min;
    this._max = max;
  }

  get max() {
    return this._max;
  }

  get min() {
    return this._min;
  }

  random() {
    return Random.number(this._min, this._max);
  }
}

module.exports = Range;
