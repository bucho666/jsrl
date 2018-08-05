const Generator = require("../generator.js");
const Matrix = require("../matrix.js");
const Size = require("../size.js");

describe("generator", () => {
  it("Generate", () => {
    const map = new Matrix(new Size(79, 21));
    const g = new Generator(map).generate();
    const CellSymbol = new Map([
      [Generator.CellType.WALL, "#"],
      [Generator.CellType.ROOM, "."],
      [Generator.CellType.ROOM_WALL, "#"],
      [Generator.CellType.EXIT, "+"],
      [Generator.CellType.CORRIDOR, " "],
      [Generator.CellType.STAIR_UP, "<"],
      [Generator.CellType.STAIR_DOWN, ">"]
    ]);
    let line = "";
    g.forEach((coord, cell) => {
      line += CellSymbol.get(cell);
      if (coord.x === map.width - 1) {
        console.log(line);
        line = "";
      }
    });
  });
});
