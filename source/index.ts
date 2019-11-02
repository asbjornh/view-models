import compile from "./compile";
import parsePropTypes from "./parsers/prop-types";

import { Parser, Generator } from "./compiler-types";

const generators: { [key: string]: Generator } = {};
const parsers: { [key: string]: Parser } = {
  propTypes: parsePropTypes
};
export { compile, generators, parsers };
