# TypeScript generator (beta)

```js
import { generators } from "view-models";

// Pass this generator to the compiler or to the Webpack plugin in order to output TypeScript
const generator = generators.typescript;
```

This parser has not been tested with real-world apps and could have issues. If you try it and find any, please consider reporting them on GitHub!

## Meta numbers

Since TypeScript only has the `number` type, meta types such as `"float"` or `"double?"` are ignored by the generator.
