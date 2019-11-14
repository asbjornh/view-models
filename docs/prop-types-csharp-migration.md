# Migrating from `@creuna/prop-types-csharp`

`view-models` works the same way as `@creuna/prop-types-csharp`. The main difference is that many things in the API has been renamed:

In JavaScript and TypeScript source files:

- `propTypesMeta` -> `viewModelMeta`
- `"exclude"` -> `"ignore"` (in meta)

Exported TypeScript types:

- `PropTypesMeta` -> `ViewModelMeta`
- `WithPropTypesMeta` -> `WithMeta`
  - The `WithMeta` type takes only one type argument and should be used as an intersection type with `React.FunctionComponent`

Webpack plugin

- option: `match` -> `include`

Compiler options (Also applies to `compilerOptions` in Webpack plugin)

- `baseClass` -> `supertype`

Eslint plugin:

- plugin: `@creuna/eslint-plugin-prop-types-csharp` -> `eslint-plugin-view-models`
- rule: `@creuna/prop-types-csharp/all` -> `view-models/no-errors`
- Also, there's two new useful rules (`no-unused-meta` and `no-meta-mismatch`)
