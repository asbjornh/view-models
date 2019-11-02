import compile from "./compile";
import generateCsharp from "./generators/csharp";
import parsePropTypes from "./parsers/prop-types";

import { Parser, Generator } from "./compiler-types";

const generators: { [key: string]: Generator } = {
  csharp: generateCsharp
};
const parsers: { [key: string]: Parser } = {
  propTypes: parsePropTypes
};
export { compile, generators, parsers };
