module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": "airbnb-base/legacy",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "strict": 0,
    "no-use-before-define": 0,
    "linebreak-style": 0
  }
};