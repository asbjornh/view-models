import * as t from "@babel/types";

import { throwError } from "../../utils/error-handling";
import {
  metaTypeNames,
  MetaTypeName,
  MetaTypeNode,
  MetaTypeTree
} from "../../lib/node-types";

const typeNames = Object.keys(metaTypeNames);

const validateTypeName = (str: string): MetaTypeName =>
  metaTypeNames[str as MetaTypeName]
    ? (str as MetaTypeName)
    : throwError(`expected one of [${typeNames}] but got '${str}'`);

const getFirstElement = (node: t.ArrayExpression): MetaTypeNode => {
  if (node.elements[0]) return parseNode(node.elements[0]);
  throw new Error("missing value");
};

function parseNode(node: t.Node): MetaTypeNode {
  if (t.isStringLiteral(node)) {
    return { type: validateTypeName(node.value) };
  } else if (t.isIdentifier(node)) {
    return { type: "ref", ref: node.name };
  } else if (t.isObjectExpression(node)) {
    return { type: "object", children: parseMeta(node) };
  } else if (t.isArrayExpression(node)) {
    return { type: "list", elementType: getFirstElement(node) };
  }
  throw new Error("unsupported type");
}

export default function parseMeta(metaValue: t.ObjectExpression) {
  return metaValue.properties.reduce((accum: MetaTypeTree, property) => {
    if (!t.isObjectProperty(property)) return accum;
    const { name } = property.key;
    try {
      const node: MetaTypeNode = parseNode(property.value);
      return Object.assign({}, accum, { [name]: node });
    } catch (error) {
      throw new Error(`Invalid meta type for '${name}': ${error.message}`);
    }
  }, {});
}
