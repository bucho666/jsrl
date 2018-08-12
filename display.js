class Font {
  constructor(name, size) {
    this._name = name;
    this._size = size;
  }

  toString() { return `${this._size}px ${this._name}`; }
  get size() { return this._size; }
}

export default class {
  constructor(id, option = {}) {
    const canvas = document.createElement("canvas");
    this._context = canvas.getContext("2d");
    this._context.textAlign = "left";
    this._context.textBaseline = "top";
    this.setOptions(option);
    this.clear();
    document.getElementById(id).appendChild(canvas);
  }

  setOptions(option) {
    const defaultOption = {
      width: 640, height: 480,
      bgColor: "black", fgColor: "#ccc",
      fontName: "Courier New, Monospace, MS ゴシック, Osaka",
      fontSize: 15,
    };
    for (const p in option) {
      defaultOption[p] = option[p];
    }
    this._context.width = defaultOption.width;
    this._context.height = defaultOption.height;
    this._fgColor = defaultOption.fgColor;
    this._bgColor = defaultOption.bgColor;
    this._context.fillStyle = defaultOption.fgColor;
    this.setFont(defaultOption.fontName, defaultOption.fontSize);
  }

  clear() {
    this._context.fillStyle = this._bgColor;
    this._context.fillRect(0, 0, this._context.width, this._context.height);
  }

  text(coord, string, color=this._fgColor, bgColor = null) {
    this.drawText({x: coord.x * this.fontWidth, y: coord.y * this.fontHeight}, string, color, bgColor);
  }

  drawText(coord, string, color=this._fgColor, bgColor = null) {
    if (bgColor) {
      this._context.fillStyle = bgColor;
      this._context.fillRect(coord.x, coord.y, this._context.measureText(string).width, this._font.size);
    }
    this._context.fillStyle = color;
    this._context.fillText(string, coord.x, coord.y);
  }

  setFont(name, size) {
    this._font = new Font(name, size);
    this._context.font = this._font.toString();
    this._fontWidth = this._context.measureText("W").width;
  }

  get fontWidth() { return this._fontWidth; }
  get fontHeight() { return this._font.size; }
}
