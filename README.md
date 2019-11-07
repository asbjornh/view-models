# ViewModels

[![npm version](https://img.shields.io/npm/v/view-models.svg)](https://npmjs.com/package/view-models)
[![Travis status](https://travis-ci.org/asbjornh/view-models.svg?branch=master)](https://travis-ci.org/asbjornh/view-models)

Tools for converting type definitions in client side apps to type definitions in server-side languages. Currently supports converting types from React or TypeScript/React to C#, Kotlin or TypeScript.

These tools were developed for adding type safety to websites that employ server-side rendering where the client and server use different languages (like rendering React components in C# using [ReactJS.NET](https://reactjs.net/)). Combining this with CI/CD helps uncover breaking changes in the client/server integration before they reach end users.

The `React -> C#` parser/generator combo has been used in production in several web apps since 2018. The other parsers and generators are currently experimental.

```
npm install --save-dev view-models
```

## Table of contents

- [TLDR config](#tldr)
- [Docs](#docs)
- [About](#about)

## <a id="tldr"></a> TLDR config

### Webpack plugin

Config example. See complete list of options [here](https://github.com/asbjornh/viewmodels/blob/master/docs/webpack-plugin.md)

```js
const ViewModelsPlugin = require('view-models/webpack-plugin');
const { generators, parsers } = require('view-models');

module.exports = {
  entry: { ... },
  output: { ... },
  plugins: [
    new ViewModelsPlugin({
      include: [/\.tsx$/],
      exclude: ['node_modules', 'some/path/to/exclude'],
      compilerOptions: {
        parser: parsers.typescriptReact, // Optional
        generator: generators.kotlin // Optional
      }
    })
  ]
};
```

### Babel plugin

Read more [here](https://github.com/asbjornh/viewmodels/blob/master/docs/babel-plugin.md)

```json
{
  "plugins": ["view-models/babel-plugin"]
}
```

### Eslint plugin

Read more [here](https://github.com/asbjornh/viewmodels/blob/master/docs/eslint-plugin.md)

`npm install --save-dev eslint-plugin-view-models`

```json
{
  "plugins": ["eslint-plugin-view-models"],
  "rules": {
    "view-models/all": 2
  }
}
```

## <a id="docs"></a> Docs

### Tools

- [Webpack plugin](https://github.com/asbjornh/viewmodels/blob/master/docs/webpack-plugin.md)
- [Babel plugin](https://github.com/asbjornh/viewmodels/blob/master/docs/babel-plugin.md)
- [Eslint plugin](https://github.com/asbjornh/viewmodels/blob/master/docs/eslint-plugin.md)
- [Compiler](https://github.com/asbjornh/viewmodels/blob/master/docs/compiler.md)

### Parsers

- [React parser](https://github.com/asbjornh/viewmodels/blob/master/docs/javascript-react.md)
- [Typescript/React parser](https://github.com/asbjornh/viewmodels/blob/master/docs/typescript-react.md)

### Generators

- [C# generator](https://github.com/asbjornh/viewmodels/blob/master/docs/csharp.md)
- [Kotlin generator](https://github.com/asbjornh/viewmodels/blob/master/docs/kotlin.md)
- [TypeScript generator](https://github.com/asbjornh/viewmodels/blob/master/docs/typescript.md)

## <a id="about"></a> About

This is a TypeScript rewrite of [@creuna/prop-types-csharp](https://github.com/Creuna-Oslo/prop-types-csharp) which I created while employed at [Creuna](https://github.com/Creuna-Oslo). At Creuna we started using `ReactJS.NET` for server-side rendering pretty heavily around 2017 and soon discovered that a javascript/C# integration can be quite brittle. Breakage was common. I introduced this tool mid-2018 and since sorting out the initial kinks it has been very helpful in reducing runtime breakage.

If you're migrating from `@creuna/prop-types-csharp` [here's](https://github.com/asbjornh/viewmodels/blob/master/docs/prop-types-csharp-migration.md) a migration guide.
