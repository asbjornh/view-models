const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const test = require("ava");

const outDir = path.resolve(__dirname, "../dist/cli-test");

test.afterEach(() => {
  fs.rmdirSync(outDir, { recursive: true });
});

test.cb("CLI", t => {
  exec(
    "node cli --out=dist/cli-test --generator=typescript --parser=typescriptReact fixtures/**/*.tsx",
    err => {
      if (err) {
        t.fail(err.message);
        return;
      }
      const files = fs
        .readdirSync(outDir)
        .filter(name => name.endsWith(".d.ts"));
      t.is(3, files.length);
      t.end();
    }
  );
});
