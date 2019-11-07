import assert from "assert";
import { parse } from "@babel/parser";
import * as t from "@babel/types";

import getReactComponentName from "../utils/get-react-component-name";
import findMeta from "../utils/find-meta";
import getPropTypes from "./get-prop-types";
import { metaTypeNames } from "../../node-types";
import parseTypes from "./parse-types";
import parseMeta from "../utils/parse-meta";
import { throwError } from "../../utils/error-handling";
import { ParseResult } from "../../compiler-types";

export default function typescriptReact(
  sourceCode: string
): ParseResult | undefined {
  assert(sourceCode, "No source code provided");

  const ast = parse(sourceCode, {
    plugins: ["jsx", "classProperties", "typescript"],
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

  const componentName = getReactComponentName(ast);
  const { typeDeclarations, typeName, types } = getPropTypes(
    ast,
    componentName
  );

  if (types) {
    return {
      typeName: typeName || componentName,
      types: parseTypes(types, typeDeclarations, meta)
    };
  }

  if (typeName) {
    return { typeName: componentName, types: {}, supertype: typeName };
  }

  throw new Error(`Couldn't find types for '${componentName}'.`);
}
