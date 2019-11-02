const path = require("path");

const root = path.resolve(__dirname, "..");
const packageJson = require(path.join(root, "package.json"));

module.exports = require(path.join(root, packageJson.main));
