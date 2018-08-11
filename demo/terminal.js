class Terminal {
  constructor(app) {
    this._app = app;
  }

  start() {
    const term = require("terminal-kit").terminal;
    term.grabInput();
    this._app.initialize(term);
    term.on("key", key => {
      this._app.keyEvent(key);
    });
  }
}

module.exports = Terminal;
