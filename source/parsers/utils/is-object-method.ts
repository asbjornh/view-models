import * as t from "@babel/types";

export default function isObjectMethod(node: t.CallExpression) {
  return (
    t.isMemberExpression(node.callee) &&
    t.isIdentifier(node.callee.object, { name: "Object" })
  );
}
