# Kotlin generator (alpha)

```js
import { generators } from "view-models";

// Pass this generator to the compiler or to the Webpack plugin in order to output Kotlin
const generator = generators.kotlin;
```

This parser has not been tested with real-world apps and might have issues. If you try it and find any, please consider reporting them on GitHub!

## Namespaces

Since Kotlin doesn't have a `namespace` keyword, the `namespace` compiler option is used to prefix package names (both for imports and package definitions).

## Required properties

With the Kotlin generator, components can only extend other components if they have no required props. This also applies to the `baseClass` option. This is due to the fact that this compiler does static analysis of one react component at a time and therefore doesn't know what arguments to pass the constructors of other classes.

## Inheritance

Inheriting the entire `propTypes` of another component will result in a `typealias` being created.
