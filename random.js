class Random {
  static number(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static percentage(percent) {
    return this.number(0, 99) < percent;
  }
}

Array.prototype.randomChoice = function() {
  return this[Random.number(0, this.length - 1)];
};

Array.prototype.randomPop = function() {
  const e = this.randomChoice();
  this.splice(this.indexOf(e), 1);
  return e;
};

Array.prototype.shuffle = function() {
  const result = [...this];
  for (let src = 0; src < result.length; src++) {
    const dst = Random.number(0, result.length - 1);
    [result[src], result[dst]] = [result[dst], result[src]];
  }
  return result;
};

module.exports = Random;
