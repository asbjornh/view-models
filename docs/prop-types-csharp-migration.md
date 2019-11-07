# Migrating from `@creuna/prop-types-csharp`

`view-models` works the same way as `@creuna/prop-types-csharp`. The main difference is that many things in the API has been renamed:

In JavaScript and TypeScript source files:

- `propTypesMeta` -> `viewModelMeta`
- `"exclude"` -> `"ignore"` (in meta)

Exported TypeScript types:

- `PropTypesMeta` -> `ViewModelMeta`
- `WithPropTypesMeta` -> `WithMeta`
  - The `WithMeta` type takes only one type argument and should be used as an intersection type with `React.FunctionComponent`

Compiler options (Webpack plugin)

- `baseClass` -> `supertype`
