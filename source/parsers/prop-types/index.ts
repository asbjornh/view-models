import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

import findMeta from "../utils/find-meta";
import findPropTypes from "./find-prop-types";
import getPropTypesFromFunction from "./get-prop-types-from-function";
import getPropTypesIdentifierName from "./get-prop-types-identifier-name";
import getReactComponentName from "../utils/get-react-component-name";
import isComponentReference from "./is-component-reference";
import parseMeta from "../utils/parse-meta";
import parsePropTypes from "./parse-prop-types";
import resolveReferences from "./resolve-references";
import { throwError } from "../../utils/error-handling";
import { metaTypeNames } from "../../node-types";
import { ParseResult } from "../../compiler-types";
import getSuperFromSpread from "./get-super-from-spread";

export default function propTypes(code: string): ParseResult | undefined {
  const ast = parse(code, {
    plugins: ["jsx", "classProperties"],
    sourceType: "module"
  });

  const metaNode = findMeta(ast);
  if (t.isStringLiteral(metaNode)) {
    const msg = `Unsupported viewModelMeta value '${metaNode.value}'. Expected 'ignore'.`;
    return metaNode.value === metaTypeNames.ignore
      ? undefined
      : throwError(msg);
  }

  const meta = parseMeta(metaNode);
  const propTypesName = getPropTypesIdentifierName(ast);
  const componentName = getReactComponentName(ast);

  if (propTypesName) {
    resolveReferences(ast, componentName, propTypesName, meta);
  }

  // Remove prop-types identifier from types (PropTypes.string -> string)
  traverse(ast, {
    MemberExpression(path) {
      if (t.isIdentifier(path.node.object, { name: propTypesName })) {
        path.replaceWith(path.node.property);
      }
    }
  });

  const typesNode = findPropTypes(ast, componentName);

  const parseResult = (
    typesNode: t.ObjectExpression | null,
    supertype?: string
  ): ParseResult => ({
    componentName,
    supertype,
    typeName: componentName,
    types: typesNode ? parsePropTypes(typesNode, meta) : {}
  });

  if (t.isMemberExpression(typesNode)) {
    if (isComponentReference(typesNode) && t.isIdentifier(typesNode.object)) {
      return parseResult(null, typesNode.object.name);
    }
  } else if (t.isCallExpression(typesNode)) {
    return parseResult(...getPropTypesFromFunction(typesNode));
  } else if (t.isObjectExpression(typesNode)) {
    return parseResult(typesNode, getSuperFromSpread(typesNode));
  }

  throw new Error(
    `Unexpected '${typesNode.type}' at ${componentName}.propTypes`
  );
}
