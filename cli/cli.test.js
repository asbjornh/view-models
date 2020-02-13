const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const test = require("ava");

test.cb("CLI", t => {
  exec(
    "node cli --out=dist --generator=typescript --parser=typescriptReact fixtures/**/*.tsx",
    err => {
      if (err) {
        t.fail(err.message);
        return;
      }
      const files = fs.readdirSync(path.resolve(__dirname, "../dist"));
      t.is(3, files.length);
      t.end();
    }
  );
});
