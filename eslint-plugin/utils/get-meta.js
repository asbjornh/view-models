const t = require("@babel/types");

module.exports = function getMeta(node) {
  if (!node) return {};
  // Manual type check for string because ESTree has no concept of StringLiteral:
  if (t.isLiteral(node) && typeof node.value === "string") return node;
  if (!node.properties) return {};

  return node.properties.reduce(
    (accum, property) => ({ ...accum, [property.key.name]: property.value }),
    {}
  );
};
