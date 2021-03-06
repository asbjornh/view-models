import * as t from "@babel/types";

import { MetaTypeNode, MetaTypeTree, validateMetaType } from "../../node-types";
import getPropertyName from "./get-property-name";

export default function parseMeta(metaValue: t.ObjectExpression) {
  return metaValue.properties.reduce((accum: MetaTypeTree, property) => {
    if (!t.isObjectProperty(property)) return accum;
    const name = getPropertyName(property);
    try {
      const node: MetaTypeNode = parseNode(property.value);
      return Object.assign({}, accum, { [name]: node });
    } catch (error) {
      throw new Error(`Invalid meta type for '${name}': ${error.message}`);
    }
  }, {});
}

function parseNode(node: t.Node): MetaTypeNode {
  if (t.isStringLiteral(node)) {
    return { type: validateMetaType(node.value) };
  } else if (t.isObjectExpression(node)) {
    return { type: "object", children: parseMeta(node) };
  } else if (t.isArrayExpression(node)) {
    return { type: "list", elementType: getFirstElement(node) };
  }
  throw new Error(
    `Expected a string, array or object but got a '${node.type}'`
  );
}

const getFirstElement = (node: t.ArrayExpression): MetaTypeNode => {
  if (node.elements[0]) return parseNode(node.elements[0]);
  throw new Error("missing value");
};
