import { parse } from "@babel/parser";
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
import { TypeTree, metaTypeNames } from "../../lib/node-types";

type ParseResult = {
  className: string;
  superClass?: string;
  types: TypeTree;
};

export default function propTypesParser(code: string): ParseResult | {} {
  const ast = parse(code, {
    plugins: ["jsx", "classProperties"],
    sourceType: "module"
  });

  const metaNode = findMeta(ast);
  if (t.isStringLiteral(metaNode)) {
    const msg = `Unsupported viewModelMeta value '${metaNode.value}'. Expected 'exclude'.`;
    return metaNode.value === metaTypeNames.exclude ? {} : throwError(msg);
  }

  const meta = parseMeta(metaNode);
  const propTypesName = getPropTypesIdentifierName(ast);
  const componentName = getReactComponentName(ast);

  if (propTypesName) {
    resolveReferences(ast, componentName, propTypesName, meta);
  }

  const typesNode = findPropTypes(ast, componentName);

  const parseResult = (
    typesNode: t.ObjectExpression | null,
    superClass?: string
  ): ParseResult => ({
    className: componentName,
    superClass,
    types: typesNode ? parsePropTypes(typesNode, meta) : {}
  });

  if (t.isMemberExpression(typesNode)) {
    if (isComponentReference(typesNode) && t.isIdentifier(typesNode.object)) {
      return parseResult(null, typesNode.object.name);
    }
  } else if (t.isCallExpression(typesNode)) {
    return parseResult(...getPropTypesFromFunction(typesNode));
  } else if (t.isObjectExpression(typesNode)) {
    return parseResult(typesNode);
  }

  throw new Error(
    `Unexpected '${typesNode.type}' at ${componentName}.propTypes`
  );
}
