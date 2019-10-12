import traverse from "@babel/traverse";
import * as t from "@babel/types";

export default function(AST: t.File): t.ObjectExpression | t.StringLiteral {
  let viewmodelMeta;

  traverse(AST, {
    // When defined as an object property on component
    AssignmentExpression(path) {
      const { node } = path;

      if (
        t.isMemberExpression(node.left) &&
        t.isIdentifier(node.left.property, { name: "viewmodelMeta" }) &&
        (t.isStringLiteral(node.right) || t.isObjectExpression(node.right))
      ) {
        viewmodelMeta = node.right;
        path.stop();
      }
    },

    // When defined as a class property
    ClassProperty(path) {
      if (
        path.get("key").isIdentifier({ name: "viewmodelMeta" }) &&
        (t.isStringLiteral(path.node.value) ||
          t.isObjectExpression(path.node.value))
      ) {
        viewmodelMeta = path.node.value;
        path.stop();
      }

      path.skip();
    }
  });

  return viewmodelMeta || t.objectExpression([]);
}
