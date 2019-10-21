import * as t from "@babel/types";

const getName = (node: t.Node): string =>
  t.isIdentifier(node)
    ? node.name
    : t.isMemberExpression(node)
    ? getName(node.object) + "." + getName(node.property)
    : "undefined";

export default function getFunctionName(node: t.CallExpression) {
  return getName(node.callee);
}

module.exports = callExpression => getName(callExpression.callee);
