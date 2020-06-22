# Changelog

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
