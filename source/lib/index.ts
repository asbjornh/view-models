import assert from "assert";

import generateCsharp from "../generators/csharp";
import parsePropTypes from "../parsers/prop-types";
import { CompilerOptions } from "./compiler-types";

const defaultOptions = {
  baseClass: "",
  generator: generateCsharp,
  indent: 2,
  namespace: "",
  parser: parsePropTypes
};

export function compile(sourceCode: string, options?: CompilerOptions) {
  const opts = { ...defaultOptions, ...(options || {}) };
  const { baseClass, generator, indent, namespace, parser } = opts;
  assert(typeof parser === "function", "Options.parser is not a function.");
  assert(
    typeof generator === "function",
    "Options.generator is not a function."
  );
  const parseResult = parser(sourceCode);

  if (!parseResult) return {};

  const { className, types, superClass } = parseResult;

  const code = generator(types, className, {
    baseClass: superClass || baseClass,
    indent,
    namespace
  });

  return { className, code };
}
