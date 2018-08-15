const Random = require("./random.js");

class Dice {
  constructor(string) {
    const dice = /(\d+)d(\d+)/gi.exec(string);
    const bonus = /\d+d\d+([\+\-]\d+)/gi.exec(string);
    this._string = string;
    [this._number, this._side] = [Number(dice[1]), Number(dice[2])];
    this._bonus = bonus ? Number(bonus[1]) : 0;
  }

  toString() {
    return this._string;
  }

  roll() {
    let roll = 0;
    for (let count = 0; count < this._number; count++) {
      roll += Random.number(1, this._side);
    }
    return roll + this._bonus;
  }
}

module.exports = Dice;
