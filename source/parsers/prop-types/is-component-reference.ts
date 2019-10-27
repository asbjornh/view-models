import * as t from "@babel/types";

export default (node: t.Node): boolean =>
  t.isMemberExpression(node) &&
  t.isIdentifier(node.property, { name: "propTypes" });
