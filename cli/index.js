#!/usr/bin/env node

/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const { compile, generators, parsers } = require("../lib");
const cliInput = require("./cli-input");
const ensureDir = require("./ensure-dir");
const getFileExtension = require("../webpack-plugin/get-file-extension");
const objectFromEntries = require("./object-from-entries");

const { config, files } = cliInput();

const compilerOptions = objectFromEntries(
  [
    ["generator", generators[config.generator]],
    ["header", config.header],
    ["indent", config.indent ? parseInt(config.indent) : undefined],
    ["namespace", config.namespace],
    ["parser", parsers[config.parser]],
    ["supertype", config.supertype]
  ].filter(([_, value]) => value !== undefined)
);

const otherOptions = objectFromEntries(
  [["ext", config.ext]].filter(([_, value]) => value !== undefined)
);

const outputPath = path.resolve(process.cwd(), config.out);
ensureDir(outputPath);

const startTime = new Date().getTime();
const filesWritten = files
  .map(filePath => {
    const fileContent = fs.readFileSync(
      path.resolve(process.cwd(), filePath),
      "utf8"
    );
    const ext =
      otherOptions.ext || getFileExtension(generators[config.generator]);
    try {
      const { typeName, code } = compile(fileContent, compilerOptions);
      const fileName = `${typeName}.${ext}`;
      return code ? [fileName, code] : undefined;
    } catch (error) {
      console.log(
        `ERROR: Failed to compile '${filePath}'.\nReason: ${error.message}`
      );
      process.exit(1);
    }
  })
  .filter(a => a)
  .map(([fileName, code]) => {
    // NOTE: map instead of forEach to preserve list length
    fs.writeFileSync(path.resolve(process.cwd(), config.out, fileName), code);
  });

if (config.log) {
  const runningTime = new Date().getTime() - startTime;
  console.log(
    `Generated ${filesWritten.length} view models in ${runningTime} ms`
  );
}
