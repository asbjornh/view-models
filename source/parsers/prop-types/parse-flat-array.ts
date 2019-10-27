import * as t from "@babel/types";

const validateElement = (
  node: t.Node | null
): t.StringLiteral | t.NumericLiteral => {
  if (t.isStringLiteral(node)) return node;
  if (t.isNumericLiteral(node)) return node;
  throw new Error(`Unexpected ${node ? node.type : "type"} in array.`);
};

export default function enumFromFlatArray(node: t.ArrayExpression) {
  return node.elements.map(validateElement).map(el => ({
    key: String(el.value),
    value: el.value
  }));
}
