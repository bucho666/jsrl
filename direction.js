const Coord = require("./coord.js");

const N = new Coord(0, -1),
  E = new Coord(1, 0),
  S = new Coord(0, 1),
  W = new Coord(-1, 0),
  NE = new Coord(1, -1),
  NW = new Coord(-1, -1),
  SE = new Coord(1, 1),
  SW = new Coord(-1, 1);
 
const Direction = {
  N: N,
  E: E,
  S: S,
  W: W,
  NE: NE,
  NW: NW,
  SE: SE,
  SW: SW,
  CROSS: [N, E, S, W],
  AROUND: [N, NE, E, SE, S, SW, W, NW]
};

module.exports = Direction;
