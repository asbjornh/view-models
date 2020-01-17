import { TypeTree } from "./node-types";

export type GeneratorOptions = {
  header?: string;
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

export type CompilerOptions = GeneratorOptions & {
  generator: Generator;
  parser: Parser;
};
