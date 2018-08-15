class Random {
  static number(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static percentage(percent) {
    return this.number(0, 99) < percent;
  }

  static choice(array) {
    return array[Random.number(0, array.length - 1)];
  }

  static pop(array) {
    const e = this.choice(array);
    array.splice(array.indexOf(e), 1);
    return e;
  }

  static shffule(array) {
    const result = [...array];
    for (let src = 0; src < result.length; src++) {
      const dst = Random.number(0, result.length - 1);
      [result[src], result[dst]] = [result[dst], result[src]];
    }
    return result;
  }
}

module.exports = Random;
