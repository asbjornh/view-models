import * as t from "@babel/types";

import getFunctionName from "../../utils/get-function-name";
import isMemberExpression from "../utils/is-member-expression";
import find from "../../utils/find";
import filter from "../../utils/filter";

export default function getPropTypesFromFunction(
  node: t.CallExpression
): [t.ObjectExpression, string | undefined] {
  if (!isMemberExpression("Object", "assign", node.callee)) {
    throw new Error(`Unsupported function '${getFunctionName(node)}'.`);
  }

  const superComponent = find(node.arguments, t.isMemberExpression);
  const superType =
    superComponent && t.isIdentifier(superComponent.object)
      ? superComponent.object.name
      : undefined;
  const propTypes = filter(node.arguments, t.isObjectExpression).find(
    n => n.properties.length
  );

  if (!propTypes) {
    throw new Error("Couldn't find any propTypes value");
  }

  return [propTypes, superType];
}
