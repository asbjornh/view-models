import traverse from "@babel/traverse";
import * as t from "@babel/types";

import filter from "../../utils/filter";

import isMemberExpression from "../utils/is-member-expression";

/** Returns Babel node containing only the propTypes value */
export default function findPropTypes(AST: t.File, componentName: string) {
  const isComponentTypesIdentifier = (node: t.Node) =>
    isMemberExpression(componentName, "propTypes", node);

  const expressions = filter(AST.program.body, t.isExpressionStatement);
  const assigmnets = filter(
    expressions.map(node => node.expression),
    t.isAssignmentExpression
  );

  // Functional component propTypes
  const typeLiteral = assigmnets.reduce(
    (accum: t.Expression | undefined, node) =>
      isComponentTypesIdentifier(node.left) ? node.right : accum,
    undefined
  );

  const typeMutations = assigmnets.reduce(
    (accum: ([any, t.Expression])[], node) => {
      return t.isMemberExpression(node.left) &&
        isComponentTypesIdentifier(node.left.object)
        ? accum.concat([[node.left.property, node.right]])
        : accum;
    },
    []
  );

  if (typeLiteral) {
    const mutations = typeMutations.map(m => t.objectProperty(...m));
    const propTypesValue = !t.isObjectExpression(typeLiteral)
      ? typeLiteral
      : t.objectExpression(typeLiteral.properties.concat(mutations));

    return propTypesValue;
  }

  let propTypesAST: t.Expression | undefined | null;

  // Class component propTypes
  traverse(AST, {
    ClassProperty(path) {
      const key = path.get("key");

      if (key.isIdentifier({ name: "propTypes" })) {
        propTypesAST = path.node.value;
        path.stop();
      }

      path.skip();
    }
  });

  if (propTypesAST) {
    return propTypesAST;
  }

  throw new Error("PropTypes not found");
}
