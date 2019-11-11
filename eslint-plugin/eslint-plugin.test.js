const test = require("ava");
const path = require("path");

test("Compatibility with proxy plugin path", t => {
  t.notThrows(() => {
    // Be very careful when changing this! Moving the eslint plugin from '/eslint-plugin' will break compatibility with the proxy plugin
    require(path.join(__dirname, "..", "eslint-plugin"));
  });
});
