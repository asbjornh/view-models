const { generators } = require("../lib/index.js");

const fileExtensions = {
  [generators.csharp.name]: "cs",
  [generators.kotlin.name]: "kt",
  [generators.typescript.name]: "d.ts"
};

module.exports = generator => {
  if (typeof generator !== "function" || !generator.name) {
    return "cs";
  }

  return fileExtensions[generator.name];
};
