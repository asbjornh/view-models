import * as t from "@babel/types";

export default (node: t.Node): node is t.Identifier =>
  t.isMemberExpression(node) &&
  t.isIdentifier(node.property, { name: "propTypes" });
