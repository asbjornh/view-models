import { TypeTree } from "./node-types";

export type GeneratorOptions = {
  indent?: number;
  namespace?: string;
  supertype?: string;
};

export type Generator = (
  types: TypeTree,
  typeName: string,
  options: GeneratorOptions
) => string;

export type ParseResult = {
  supertype?: string;
  typeName: string;
  types: TypeTree;
};

export type Parser = (code: string) => ParseResult | undefined;

export type CompilerOptions = {
  generator: Generator;
  indent?: number;
  namespace?: string;
  parser: Parser;
  supertype?: string;
};
