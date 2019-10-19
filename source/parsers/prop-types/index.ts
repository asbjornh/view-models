import { parse } from "@babel/parser";
import * as t from "@babel/types";

import findMeta from "../utils/find-meta";
import { throwError } from "../../utils/error-handling";
import parseMeta from "../utils/parse-meta";

export default function parsePropTypes(code: string) {
  const ast = parse(code, {
    plugins: ["jsx", "classProperties"],
    sourceType: "module"
  });

  const metaNode = findMeta(ast);
  if (t.isStringLiteral(metaNode)) {
    const msg = `Unsupported viewModelMeta value '${metaNode.value}'. Expected 'exclude'.`;
    return metaNode.value === "exclude" ? {} : throwError(msg);
  }

  const meta = parseMeta(metaNode);
  meta;
}
