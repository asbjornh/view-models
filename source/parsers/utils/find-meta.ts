import traverse from "@babel/traverse";
import * as t from "@babel/types";

export default function(AST: t.File) {
  let viewModelMeta: t.ObjectExpression | t.StringLiteral | undefined;

  traverse(AST, {
    // When defined as an object property on component
    AssignmentExpression(path) {
      const { node } = path;

      if (
        t.isMemberExpression(node.left) &&
        t.isIdentifier(node.left.property, { name: "viewModelMeta" }) &&
        (t.isStringLiteral(node.right) || t.isObjectExpression(node.right))
      ) {
        viewModelMeta = node.right;
        path.stop();
      }
    },

    // When defined as a class property
    ClassProperty(path) {
      if (
        path.get("key").isIdentifier({ name: "viewModelMeta" }) &&
        (t.isStringLiteral(path.node.value) ||
          t.isObjectExpression(path.node.value))
      ) {
        viewModelMeta = path.node.value;
        path.stop();
      }

      path.skip();
    }
  });

  return viewModelMeta || t.objectExpression([]);
}
