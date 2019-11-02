import { TypeTree } from "./node-types";

export type GeneratorOptions = {
  baseClass?: string;
  indent?: number;
  namespace?: string;
};

export type Generator = (
  types: TypeTree,
  className: string,
  options: GeneratorOptions
) => string;

export type ParseResult = {
  className: string;
  superClass?: string;
  types: TypeTree;
};

export type Parser = (code: string) => ParseResult | undefined;

export type CompilerOptions = {
  baseClass?: string;
  generator: Generator;
  indent?: number;
  namespace?: string;
  parser: Parser;
};
