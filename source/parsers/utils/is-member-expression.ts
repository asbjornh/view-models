import * as t from "@babel/types";

export default function isMemberExpression(
  objectName: string,
  propertyName: string,
  node: t.Node
) {
  return (
    t.isMemberExpression(node) &&
    t.isIdentifier(node.object, { name: objectName }) &&
    t.isIdentifier(node.property, { name: propertyName })
  );
}
