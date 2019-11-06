import compile from "./compile";

import csharp from "./generators/csharp";
import kotlin from "./generators/kotlin";
import typescript from "./generators/typescript";

import propTypes from "./parsers/prop-types";
import typescriptReact from "./parsers/typescript-react";

import { Parser, Generator } from "./compiler-types";

const generators: { [key: string]: Generator } = {
  csharp,
  kotlin,
  typescript
};

const parsers: { [key: string]: Parser } = {
  propTypes,
  typescriptReact
};

export { Parser, Generator };
export { WithMeta, ViewModelMeta } from "./with-meta";
export { compile, generators, parsers };
