import * as t from "@babel/types";

import {
  TypeTree,
  MetaTypeTree,
  MetaTypeNode,
  TypeNode,
  isTypeNode,
  validateType
} from "../../lib/node-types";

import filter from "../../utils/filter";
import isComponentReference from "./is-component-reference";
import isObjectMethod from "../utils/is-object-method";
import parseFlatArray from "./parse-flat-array";
import parseObjectMethod from "./parse-object-method";

const typesToStrip = ["element", "elementType", "func", "instanceOf", "node"];

export default function parsePropTypes(
  node: t.ObjectExpression,
  meta: MetaTypeTree = {}
) {
  return filter(node.properties || [], t.isObjectProperty).reduce(
    (accum: TypeTree, node) => {
      const propName: string = node.key.name;
      try {
        const type = parseType(node.value, meta[propName]);
        return Object.assign(accum, type ? { [propName]: type } : {});
      } catch (error) {
        throw new Error(
          `Invalid type for prop '${propName}':\n${error.message}`
        );
      }
    },
    {}
  );
}

function parseType(node: t.Node, meta?: MetaTypeNode): TypeNode | undefined {
  if (meta && meta.type === "ignore") return;

  return t.isCallExpression(node)
    ? parseCallExpression(node, meta)
    : t.isIdentifier(node)
    ? parseIdentifier(node, meta)
    : t.isObjectExpression(node)
    ? parseObjectExpression(node, meta)
    : t.isMemberExpression(node)
    ? parseMemberExpression(node, meta)
    : undefined;
}

const isShape = (type: string) => ["shape", "exact"].includes(type);

const getElementType = (n?: MetaTypeNode) =>
  n && n.type === "list" ? n.elementType : undefined;

const parseCallExpression = (
  node: t.CallExpression,
  meta?: MetaTypeNode
): TypeNode | undefined => {
  const { callee } = node;
  const [argument] = node.arguments;

  if (!t.isIdentifier(callee)) return;
  if (typesToStrip.includes(callee.name)) return;

  if (isShape(callee.name)) {
    // NOTE: argument is an object expression or a member expression
    return parseType(argument, meta);
  } else if (t.isCallExpression(argument) && isObjectMethod(argument)) {
    // Object.keys, Object.values.
    const children = parseObjectMethod(argument);
    return children ? { type: "enum", children } : undefined;
  } else if (callee.name === "oneOf" && t.isArrayExpression(argument)) {
    return { type: "enum", children: parseFlatArray(argument) };
  } else if (callee.name === "objectOf") {
    const valueType = parseType(argument);
    return valueType ? { type: "dictionary", valueType } : undefined;
  } else if (callee.name === "arrayOf") {
    const elementType = parseType(argument, getElementType(meta));
    return elementType ? { type: "list", elementType } : undefined;
  }

  throw new Error(`Invalid function call '${callee.name}'`);
};

const parseMemberExpression = (
  node: t.MemberExpression,
  meta?: MetaTypeNode
): TypeNode | undefined => {
  // NOTE: This matches 'SomeComponent.propTypes'
  if (isComponentReference(node) && t.isIdentifier(node.object)) {
    return { type: "ref", ref: node.object.name };
  }

  const type = parseType(node.object, meta);
  const required = t.isIdentifier(node.property, { name: "isRequired" });
  return type ? { ...type, required } : undefined;
};

const parseIdentifier = (
  { name }: t.Identifier,
  meta?: MetaTypeNode
): TypeNode | undefined => {
  const parsedMeta: TypeNode | undefined = isTypeNode(meta) ? meta : undefined;
  return typesToStrip.includes(name) || parsedMeta
    ? parsedMeta
    : { type: validateType(name === "number" ? "int" : name) };
};

const parseProperty = (
  { key, value }: t.ObjectProperty,
  meta?: MetaTypeTree
) => {
  const type = parseType(value, meta && meta[key.name as string]);
  return type ? { [key.name]: type } : {};
};

const getChildren = (n?: MetaTypeNode) =>
  n && n.type === "object" ? n.children : undefined;

const parseObjectExpression = (
  node: t.ObjectExpression,
  meta?: MetaTypeNode
): TypeNode => ({
  type: "object",
  children: node.properties.reduce((a, n) => {
    if (t.isObjectProperty(n)) {
      const property = parseProperty(n, getChildren(meta));
      return { ...a, ...property };
    }
    return a;
  }, {})
});
