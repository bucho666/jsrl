const Size = require("../size.js");
const assert = require("chai").assert;

describe("size", () => {
  it("width, height", () => {
    const s = new Size(1, 2);
    assert.deepEqual([s.width, s.height], [1, 2]);
  });

  it("plus", () => {
    const a = new Size(1, 2);
    const b = new Size(3, 4);
    assert.deepEqual(a.plus(b), new Size(4, 6));
  });
});
