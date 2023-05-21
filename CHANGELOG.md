# Changelog

## 3.1.0

- FEATURE: Adds support for spread syntax for prop types inheritance

## 3.0.0

- POTENTIALLY BREAKING: Fixes bugs in the eslint plugin introduced by a new minor version of `@babel/types`. This could potentially be a breaking change, but this has not been confirmed.

## 2.2.0

- FEATURE: Adds `ext` option to CLI

## 2.1.2

- FIX: Fixes [#16](https://github.com/asbjornh/view-models/issues/16) - `no-name-mismatch` eslint rule not checking types recursively
- FIX: Fixes `no-errors` eslint rule not reporting errors for types that are `isRequired`
- FIX: Fixes `no-errors` eslint rule not reporting errors for types within `PropTypes.arrayOf`

## 2.1.1

- Adds docs for CLI

## 2.1.0

- FEATURE: Adds `no-name-mismatch` rule to eslint plugin
- FEATURE: Adds support for `any` in TypeScript parser
- FEATURE: Adds support for `PropTypes.any` in PropTypes parser

## 2.0.4

- FIX: Fixes [#11](https://github.com/asbjornh/view-models/issues/11) - TypeScript generator outputting multiple imports of the same module

## 2.0.3

- FIX: Fixes [#10](https://github.com/asbjornh/view-models/issues/10) - TypeScript generator outputting strings instead of numbers in union types

## 2.0.2

- FIX: Fixes [#9](https://github.com/asbjornh/view-models/issues/9) - bad string literal array output by `typescript` generator

## 2.0.1

- FIX: Fixes [#8](https://github.com/asbjornh/view-models/issues/8) - `typescriptReact` parser crashing when parsing components with no arguments.

## 2.0.0

- BREAKING: Changes the default file extension for generated TypeScript files from `.ts` to `.d.ts`

## 1.2.0

- FEATURE: Adds CLI
- FIX: Fixes `"ignore"` literal not accepted by `WithMeta`

## 1.1.2

- FIX: Fixes [#7](https://github.com/asbjornh/view-models/issues/7) - syntax error in booleans output by `typescript` generator

## 1.1.1

- FIX: Fixes [#6](https://github.com/asbjornh/view-models/issues/6) - bad array type output by `typescript` generator

## 1.1.0

- FEATURE: [compiler] Adds `header` option to `compilerOptions`, used to insert arbitrary text at the top of generated files
- FEATURE: [webpack plugin] Adds `metaFileGenerator` option to webpack plugin

## 1.0.0

- BREAKING: [eslint plugin] Renames `all` rule to `no-errors`
- FEATURE: [eslint plugin] Adds `no-unused-meta`, `no-meta-mismatch` and `no-prop-mapping` rules
- FEATURE: [eslint plugin] Adds `include` option to rules
- FIX: [eslint plugin] Fixes eslint plugin not reporting errors on `PropTypes.any` and `PropTypes.symbol`
- FIX: [eslint plugin] Fixes eslint plugin not reporting errors on identifiers in meta

## 0.2.0

- BREAKING: [Compiler, Webpack plugin] Renames `baseClass` compiler option to `supertype`
- BREAKING: [Compiler] Renames `className` to `typeName` in compiler return value
