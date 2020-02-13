const fs = require("fs");
const path = require("path");

module.exports = function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    ensureDir(path.dirname(dirPath));
    fs.mkdirSync(dirPath);
  }
};
