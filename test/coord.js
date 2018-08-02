const Coord = require("../coord.js");
const assert = require("chai").assert;

describe("Coord", () => {
  it("x, y", () => {
    const c = new Coord(1, 2);
    assert.deepEqual([1, 2], [c.x, c.y]);
  });

  it("equal object", () => {
    assert.ok(new Coord(1, 2) === new Coord(1, 2));
  });

  it("plus", () => {
    const a = new Coord(1, 2);
    const b = new Coord(3, 4);
    assert.equal(a.plus(b), new Coord(4, 6));
  });
});