import traverse from "@babel/traverse";
import * as t from "@babel/types";

export default function(AST: t.File) {
  let propTypesIdentifierName: string | undefined;

  traverse(AST, {
    // Get PropTypes variable name from import statement.
    ImportDeclaration(path) {
      if (path.get("source").isStringLiteral({ value: "prop-types" })) {
        propTypesIdentifierName = path.node.specifiers[0].local.name;
        path.stop();
      }
    }
  });

  return propTypesIdentifierName;
}
