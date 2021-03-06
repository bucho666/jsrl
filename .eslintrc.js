module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module"
  },
  rules: {
    "no-console": 0,
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"]
  }
};
