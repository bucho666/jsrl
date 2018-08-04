const Coord = require("./coord.js");

const Direction = {
  N: new Coord(0, -1),
  E: new Coord(1, 0),
  S: new Coord(0, 1),
  W: new Coord(-1, 0),
  NE: new Coord(1, -1),
  NW: new Coord(-1, -1),
  SE: new Coord(1, 1),
  SW: new Coord(-1, 1)
};

module.exports = Direction;
