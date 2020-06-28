import * as t from "@babel/types";

import getDefinitionName from "./get-definition-name";
import typeNodeName from "./type-node-name";
import some from "../../utils/some";
import {
  MetaTypeTree,
  TypeNode,
  TypeTree,
  MetaTypeNode
} from "../../node-types";
import filter from "../../utils/filter";

// NOTE: JSX.Element is supposedly the thing typescript has that is most similar to PropTypes.node
const typesToStrip = ["JSX.Element"];

export default function parseTypes(
  types: (t.TSEnumMember | t.TSTypeElement)[],
  typeDeclarations: { [key: string]: (t.TSEnumMember | t.TSTypeElement)[] },
  meta?: MetaTypeTree
) {
  return types.reduce((accum: TypeTree, node) => {
    if (
      !t.isTSPropertySignature(node) ||
      !t.isIdentifier(node.key) ||
      node.typeAnnotation === null
    ) {
      return accum;
    }
    const name = node.key.name;

    try {
      const type = parseType(
        node.typeAnnotation.typeAnnotation,
        typeDeclarations,
        meta ? meta[name] : undefined,
        !node.optional
      );
      return Object.assign(accum, type ? { [name]: type } : {});
    } catch (error) {
      throw new Error(`Invalid type for prop '${name}': ${error.message}`);
    }
  }, {});
}

const getChildMeta = (node?: MetaTypeNode): MetaTypeTree | undefined => {
  if (node && node.type === "object") return node.children;
};

const getListMeta = (node?: MetaTypeNode): MetaTypeNode | undefined => {
  if (node && node.type === "list") return node.elementType;
};

const getNumberFromMeta = (node?: MetaTypeNode) => {
  if (!node) return;
  if (
    node.type === "double" ||
    node.type === "double?" ||
    node.type === "int" ||
    node.type === "int?" ||
    node.type === "float" ||
    node.type === "float?"
  ) {
    return node.type;
  }
};

const parseType = (
  node: t.Node,
  typeDeclarations: { [key: string]: (t.TSEnumMember | t.TSTypeElement)[] },
  meta?: MetaTypeNode,
  required?: boolean
): TypeNode | undefined => {
  if (meta && meta.type === "ignore") return;
  const base = { required };

  const parse = (n: t.Node, m?: MetaTypeNode, r?: boolean) =>
    parseType(n, typeDeclarations, m, r);

  if (t.isTSAnyKeyword(node)) {
    return { ...base, type: "any" };
  } else if (t.isTSArrayType(node)) {
    const type = parse(node.elementType, getListMeta(meta));
    return type ? { ...base, type: "list", elementType: type } : undefined;
  } else if (t.isTSBooleanKeyword(node)) {
    return { ...base, type: "bool" };
  } else if (t.isTSFunctionType(node)) {
    return undefined;
  } else if (t.isTSNumberKeyword(node)) {
    const type = getNumberFromMeta(meta) || "int";
    return { ...base, type };
  } else if (t.isTSStringKeyword(node)) {
    return { ...base, type: "string" };
  } else if (t.isTSTypeLiteral(node)) {
    const childMeta = getChildMeta(meta);
    const type = parseTypes(node.members, typeDeclarations, childMeta);
    return type ? { ...base, type: "object", children: type } : undefined;
  } else if (t.isTSParenthesizedType(node)) {
    return parse(node.typeAnnotation, meta);
  } else if (t.isTSTypeReference(node)) {
    const name = getDefinitionName(node.typeName);
    const types = typeDeclarations[name];

    if (typesToStrip.includes(name)) return;

    // When type isn't defined in file
    if (!types) return { ...base, type: "ref", ref: name };

    if (some(types, t.isTSEnumMember)) {
      const children = filter(
        types.map(n => n.initializer),
        t.isStringLiteral
      ).map(node => ({ key: node.value, value: node.value }));
      return { ...base, type: "enum", children };
    }

    throw new Error(
      `Unable to resolve type '${name}'. This might be a bug! Consider reporting the issue on GitHub! :)`
    );
  }

  throw new Error(`Type '${typeNodeName(node)}' is not supported.`);
};
