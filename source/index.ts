import compile from "./compile";

import csharp from "./generators/csharp";
import kotlin from "./generators/kotlin";
import typescriptGenerator from "./generators/typescript";

import propTypes from "./parsers/prop-types";

import { Parser, Generator } from "./compiler-types";

const generators: { [key: string]: Generator } = {
  csharp,
  kotlin,
  typescript: typescriptGenerator
};

const parsers: { [key: string]: Parser } = {
  propTypes
};

export { compile, generators, parsers };
