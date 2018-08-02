const Matrix = require("./matrix.js");
const Size = require("./size.js");

const CellFlag = {
  NO_FLAG: 1 << 0,
  ROOM: 1 << 1
};

// ランダムに部屋を作成する
//  ランダムな部屋作成位置取得 random(0, size / 2) * 2 (偶数位置)
//  ランダムは部屋のサイズ(3, 5, 7, 9)
//  衝突チェックOKなら配置
//  RectにFrameの座標リストを取得するメソッド追加
//  壁を#で、中を.で埋める(中は元のRectを2縮小して位置をずらせばOK) > RectにMoveメソッド追加
// 部屋サイズのRange
// ランダム座標
// Rectクラス
// 範囲外判定
// Roomクラス
class Generator {
  constructor() {
    this._map = new Matrix(new Size(79, 21));
  }

  run() {
    this.initialize();
    this.create_room();
    this.render();
  }

  create_room() {
    // TODO
    console.log(`rooms: ${this.get_room_number()}`);
  }

  get_room_number() {
    const size = this._map.size;
    const map_area = size.height * size.width;
    const room_area_max = 45;
    return Math.floor(map_area / room_area_max);
  }

  initialize() {
    this._map.fill(CellFlag.NO_FLAG);
  }

  render() {
    let line = "";
    this._map.forEach((coord, cell) => {
      if (cell === CellFlag.NO_FLAG) {
        line += "_";
      } else {
        line += "x";
      }
      if (coord.x === this._map.size.width - 1) {
        console.log(line);
        line = "";
      }
    });
  }
}

new Generator().run();
