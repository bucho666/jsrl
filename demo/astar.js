const Coord = require("../coord.js");
const Astar = require("../astar.js");

class AstarDemo {
  constructor() {
    this._map = [
      "#####################".split(""),
      "#.................#.#".split(""),
      "#######....#..###...#".split(""),
      "#.....####..###.#.###".split(""),
      "#.#.###..#.....#.#..#".split(""),
      "#..##..#.##########.#".split(""),
      "#...#.#..##....#....#".split(""),
      "#.....#......#...#..#".split(""),
      "#####################".split("")
    ];
  }

  run() {
    const a = new Astar((coord)=>{
      return this._map[coord.y][coord.x] === "#";
    });
    const [start, goal] = [new Coord(1, 1), new Coord(5, 3)];
    this.put(start, "S");
    this.put(goal, "G");
    for (const c of a.compute(new Coord(1, 1), new Coord(5, 3))) {
      this.put(c, "+");
    }
    for (const line of this._map) {
      console.log(line.join(""));
    }
  }

  put(coord, ch) {
    this._map[coord.y][coord.x] = ch;
  }
}

new AstarDemo().run();
