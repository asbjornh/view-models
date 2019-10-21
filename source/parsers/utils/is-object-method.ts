import * as t from "@babel/types";

export default function isObjectMethod(callExpression: t.CallExpression) {
  return (
    t.isMemberExpression(callExpression.callee) &&
    t.isIdentifier(callExpression.callee.object, { name: "Object" })
  );
}
