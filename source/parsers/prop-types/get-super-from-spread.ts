import * as t from "@babel/types";
import isSpreadElement from "../utils/is-spread-element";

export default function getSuperFromSpread(
  node: t.ObjectExpression
): string | undefined {
  const spread = node.properties.find(isSpreadElement);
  if (!spread || !t.isMemberExpression(spread.argument)) return;
  if (
    t.isIdentifier(spread.argument.object) &&
    t.isIdentifier(spread.argument.property, { name: "propTypes" })
  )
    return spread.argument.object.name;
}
