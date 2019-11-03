import compile from "./compile";

import csharp from "./generators/csharp";
import kotlin from "./generators/kotlin";

import propTypes from "./parsers/prop-types";

import { Parser, Generator } from "./compiler-types";

const generators: { [key: string]: Generator } = {
  csharp,
  kotlin
};

const parsers: { [key: string]: Parser } = {
  propTypes
};

export { compile, generators, parsers };
