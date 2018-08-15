const Dice = require("../dice.js");

const dices = [new Dice("1d6"), new Dice("2d6+2"), new Dice("2d6-2")];
for (let c = 0; c < 100; c++) {
  for (dice of dices) {
    process.stdout.write(`[${dice.toString()}: ${dice.roll()}]`);
  }
  process.stdout.write("\n");
}
