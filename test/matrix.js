const Matrix = require("../matrix.js");
const Size = require("../size.js");
const Coord = require("../coord.js");
const assert = require("chai").assert;

describe("Matrix", () => {
  it("size", () => {
    const size = new Size(2, 3);
    const m = new Matrix(size);
    assert.isTrue(m.size.equal(size));
  });

  it("width and height", () => {
    const m = new Matrix(new Size(2, 3));
    assert.equal(m.width, 2);
    assert.equal(m.height, 3);
  });

  it("put and at and remove and exists", () => {
    const m = new Matrix(new Size(2, 3));
    const coord = new Coord(1, 2);
    const value = "test value";
    assert.isFalse(m.exists(coord));
    m.put(coord, value);
    assert.equal(m.at(coord), value);
    assert.isTrue(m.exists(coord));
    m.remove(coord);
    assert.isFalse(m.exists(coord));
    assert.equal(m.at(coord), undefined);
  });

  it("fill", () => {
    const m = new Matrix(new Size(2, 3));
    const value = "test value";
    m.fill(value);
    assert.equal(m.at(new Coord(0, 0)), value);
    assert.equal(m.at(new Coord(1, 0)), value);
    assert.equal(m.at(new Coord(0, 1)), value);
    assert.equal(m.at(new Coord(1, 1)), value);
    assert.equal(m.at(new Coord(0, 2)), value);
    assert.equal(m.at(new Coord(1, 2)), value);
  });

  it("forEach", () => {
    const m = new Matrix(new Size(2, 3));
    const expected = [
      new Coord(0, 0),
      new Coord(1, 0),
      new Coord(0, 1),
      new Coord(1, 1),
      new Coord(0, 2),
      new Coord(1, 2)
    ];
    const result = [];
    m.forEach(coord => {
      result.push(coord);
    });
    assert.deepEqual(expected, result);
  });

  it("is edge", () => {
    const m = new Matrix(new Size(3, 3));
    assert.isTrue(m.isEdge(new Coord(0, 0)));
    assert.isTrue(m.isEdge(new Coord(1, 0)));
    assert.isTrue(m.isEdge(new Coord(2, 0)));
    assert.isTrue(m.isEdge(new Coord(0, 1)));
    assert.isFalse(m.isEdge(new Coord(1, 1)));
    assert.isTrue(m.isEdge(new Coord(2, 1)));
    assert.isTrue(m.isEdge(new Coord(0, 2)));
    assert.isTrue(m.isEdge(new Coord(1, 2)));
    assert.isTrue(m.isEdge(new Coord(2, 2)));
  });
});
