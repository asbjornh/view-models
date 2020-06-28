# React (typescript) parser (alpha)

```js
const { parsers } = require("view-models");

// Pass this parser to the compiler or to the Webpack plugin in order to use typescript source
const parser = parsers.typescriptReact;
```

The typescript-react parser has not been tested with real-world apps and is likely to have issues. Testing is greatly appreciated! If you try this parser and encounter any problems, please don't hesitate to report them on GitHub!

The parser will determine the name of the type to compile based on how component types are defined:

- if a type literal is used, the name of the React component is used
- if an interface/type alias is used, the name of that type is used

You can use the `React.FunctionComponent` type with functional components as normal, also in combination with the provided `WithMeta` type (see below). With class components the parser expects React.Component<T> to be used.

## Illegal types

As with the javascript-react parser, some types are not allowed because they are too ambiguous, too complex or can't be represented in all of the output languages. For instance, C# and Kotlin both lack a way of expressing union types.

```tsx
const A = (props: { b: string }) => null; // view model name: A
const A: React.FunctionComponent<{ b: string }> = props => null; // view model name: A

type BProps = { c: string };
const B = (props: BProps) => null; // view model name: BProps
const B: React.FunctionComponent<BProps> = props => null; // view model name: BProps
```

## viewModelMeta

`viewModelMeta` works in mostly the same way as for javascript components.

Two type aliases are exported that can be used to type check `viewModelMeta`:

```tsx
import { ViewModelMeta, WithMeta } from "view-models";

type AProps = { a: string; b: number };
class A extends React.Component<AProps> {
  static viewModelMeta: ViewModelMeta<AProps> = {
    a: "ignore",
    b: "int?"
  };
}

type BProps = { a: string; b: number };
const B: WithMeta<BProps> & React.FunctionComponent<BProps> = props => null;

B.viewModelMeta = { a: "ignore", b: "int?" };
```
