class Random {
  static number(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

Array.prototype.randomChoice = function() {
  return this[Random.number(0, this.length - 1)];
};

module.exports = Random;
