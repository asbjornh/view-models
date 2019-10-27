import * as t from "@babel/types";

export default function getFunctionName(node: t.CallExpression) {
  return getName(node.callee);
}

const getName = (node: t.Node): string =>
  t.isIdentifier(node)
    ? node.name
    : t.isMemberExpression(node)
    ? getName(node.object) + "." + getName(node.property)
    : "undefined";
