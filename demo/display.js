import Display from "../display.js";

class DisplayDemo {
  constructor() {
    this._display = new Display("screen", {
      width: 640, height: 480,
      bgColor: "olive", fgColor: "#ccc",
      fontName: "Courier New, Monospace, MS ゴシック, Osaka",
      fontSize: 15,
    });
  }

  run() {
    this._display.text({x: 5,  y: 2}, "@");
    this._display.text({x: 15, y: 4}, "%", "#0f0");          /* foreground color */
    this._display.text({x: 25, y: 6}, "#", "#f00", "#009");  /* and background color */
  }
}

new DisplayDemo().run();

