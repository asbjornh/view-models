import assert from "assert";

import generateCsharp from "./generators/csharp";
import parsePropTypes from "./parsers/prop-types";
import { CompilerOptions } from "./compiler-types";

const defaultOptions = {
  generator: generateCsharp,
  header: "",
  indent: 2,
  namespace: "",
  parser: parsePropTypes,
  supertype: ""
};

export default function compile(sourceCode: string, options?: CompilerOptions) {
  const opts = { ...defaultOptions, ...(options || {}) };
  const { generator, header, indent, namespace, parser, supertype } = opts;
  assert(typeof parser === "function", "Options.parser is not a function.");
  assert(
    typeof generator === "function",
    "Options.generator is not a function."
  );
  const parseResult = parser(sourceCode);

  if (!parseResult) return {};

  const { typeName, types, supertype: parsedSupertype } = parseResult;

  const code = generator(types, typeName, {
    header,
    indent,
    namespace,
    supertype: parsedSupertype || supertype
  });

  return { code, typeName };
}
