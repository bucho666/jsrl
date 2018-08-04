const Coord = require("../coord.js");
const Size = require("../size.js");
const Rect = require("../rect.js");
const assert = require("chai").assert;

describe("Rect", () => {
  it("coord and size", () => {
    const r = new Rect(new Coord(1, 2), new Size(3, 4));
    assert.equal(r.x, 1);
    assert.equal(r.y, 2);
    assert.equal(r.width, 3);
    assert.equal(r.height, 4);
  });

  it("top, bottom, left, right", () => {
    const r = new Rect(new Coord(1, 2), new Size(3, 4));
    assert.equal(r.top, 2);
    assert.equal(r.bottom, 5);
    assert.equal(r.left, 1);
    assert.equal(r.right, 3);
  });

  it("corner", () => {
    const r = new Rect(new Coord(1, 2), new Size(3, 4));
    assert.equal(r.topLeft, new Coord(1, 2));
    assert.equal(r.topRight, new Coord(3, 2));
    assert.equal(r.bottomLeft, new Coord(1, 5));
    assert.equal(r.bottomRight, new Coord(3, 5));
  });

  it("top side", () => {
    const r = new Rect(new Coord(1, 2), new Size(3, 4));
    assert.deepEqual(r.topSide, [
      new Coord(1, 2),
      new Coord(2, 2),
      new Coord(3, 2)
    ]);
  });

  it("left side", () => {
    const r = new Rect(new Coord(1, 2), new Size(3, 4));
    assert.deepEqual(r.leftSide, [
      new Coord(1, 2),
      new Coord(1, 3),
      new Coord(1, 4),
      new Coord(1, 5)
    ]);
  });

  it("right side", () => {
    const r = new Rect(new Coord(1, 2), new Size(3, 4));
    assert.deepEqual(r.rightSide, [
      new Coord(3, 2),
      new Coord(3, 3),
      new Coord(3, 4),
      new Coord(3, 5)
    ]);
  });

  it("bottom side", () => {
    const r = new Rect(new Coord(1, 2), new Size(3, 4));
    assert.deepEqual(r.bottomSide, [
      new Coord(1, 5),
      new Coord(2, 5),
      new Coord(3, 5)
    ]);
  });

  it("expand", () => {
    const r = new Rect(new Coord(1, 2), new Size(3, 4));
    const r2 = new Rect(new Coord(1, 2), new Size(5, 6));
    assert.deepEqual(r.expand(2), r2);
  });

  it("contract", () => {
    const r = new Rect(new Coord(1, 2), new Size(5, 6));
    const r2 = new Rect(new Coord(1, 2), new Size(3, 4));
    assert.deepEqual(r.contract(2), r2);
  });

  it("inbound", () => {
    const r = new Rect(new Coord(1, 2), new Size(3, 4));
    assert.isTrue(r.inbound(new Coord(1, 2)));
    assert.isTrue(r.inbound(new Coord(1, 4)));
    assert.isTrue(r.inbound(new Coord(3, 2)));
    assert.isTrue(r.inbound(new Coord(3, 4)));
    assert.isFalse(r.inbound(new Coord(0, 2)));
    assert.isFalse(r.inbound(new Coord(4, 2)));
    assert.isFalse(r.inbound(new Coord(2, 1)));
    assert.isFalse(r.inbound(new Coord(2, 6)));
  });

  it("is over lap", () => {
    const r = new Rect(new Coord(5, 5), new Size(3, 3));
    const size = new Size(5, 5);
    assert.isFalse(r.isOverlap(new Rect(new Coord(0, 0), size)));
    assert.isFalse(r.isOverlap(new Rect(new Coord(1, 0), size)));
    assert.isFalse(r.isOverlap(new Rect(new Coord(0, 1), size)));
    assert.isFalse(r.isOverlap(new Rect(new Coord(8, 1), size)));
    assert.isFalse(r.isOverlap(new Rect(new Coord(1, 8), size)));
    assert.isFalse(r.isOverlap(new Rect(new Coord(8, 8), size)));
    assert.isTrue(r.isOverlap(new Rect(new Coord(1, 1), size)));
    assert.isTrue(r.isOverlap(new Rect(new Coord(7, 1), size)));
    assert.isTrue(r.isOverlap(new Rect(new Coord(1, 7), size)));
    assert.isTrue(r.isOverlap(new Rect(new Coord(7, 7), size)));
    assert.isTrue(r.isOverlap(new Rect(new Coord(4, 5), new Size(5, 3))));
  });

  it("frame", () => {
    const r = new Rect(new Coord(2, 3), new Size(3, 3));
    const expected = [
      new Coord(2, 3),
      new Coord(3, 3),
      new Coord(4, 3),
      new Coord(2, 4),
      new Coord(2, 5),
      new Coord(4, 4),
      new Coord(4, 5),
      new Coord(3, 5)
    ];
    assert.deepEqual(r.frame, expected);
  });

  it("iterate", () => {
    const result = [];
    for (const c of new Rect(new Coord(2, 3), new Size(3, 3))) {
      result.push(c);
    }
    assert.deepEqual(result, [
      new Coord(2, 3),
      new Coord(3, 3),
      new Coord(4, 3),
      new Coord(2, 4),
      new Coord(3, 4),
      new Coord(4, 4),
      new Coord(2, 5),
      new Coord(3, 5),
      new Coord(4, 5)
    ]);
  });
});
