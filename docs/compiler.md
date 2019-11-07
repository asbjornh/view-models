# Compiler

```js
import { compile } from "view-models";
```

## compile

```ts
(sourceCode: string, options?: CompilerOptions): { typeName?: string, code?: string }
```

### Returns

Returns an `object` containing:

**typeName**: `String`
Name of the generated type definition.

**code**: `String`
Source code for generated view model.

### sourceCode: _String_

Source code to generate a view model for.

### CompilerOptions

```ts
type CompilerOptions = {
  baseClass?: string;
  generator?: Generator; // Default C#
  indent?: number; // Default 2
  namespace?: string;
  parser?: Parser; // Default propTypes
};
```

**baseClass**: Base class that generated classes will extend

**generator**: Set output language (defaults to `C#`). Curently, `C#`, `Kotlin` and `Typescript` are supported out of the box but new ones can be added. A `Generator` type is exposed from the same file as the compiler. The easiest way of adding a new language is probably to clone one of the existing generators in `source/generators` and work from there. If you do make a generator for another language, please consider submitting a PR!

**indent**: Number of spaces of indentation in generated file

**namespace**: Namespace for the generated view model

**parser**: What input language/framework to parse. If you want to create your own parser, a `Parser` type is exposed.

### Example

```js
const { compile } = require("view-models");

const { code, typeName } = compile(sourceCode, {
  indent: 4,
  namespace: "Some.Awesome.Namespace"
});
```

### Typescript/Kotlin example

```js
const { compile, generators, parsers } = require("view-models");

const { code, typeName } = compile(sourceCode, {
  parser: parsers.typescript,
  generator: generators.kotlin
});
```
