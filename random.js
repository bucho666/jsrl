class Random {
  static number(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

Array.prototype.randomChoice = function() {
  return this[Random.number(0, this.length - 1)];
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
