# Webpack plugin

The plugin will extract type definitions from client files and convert them to view model files in the selected output language. If the build already has errors when this plugin runs, it aborts immediately.

## Options: `Object`

**compilerOptions**: `Object`

Options passed to the compiler, such as input language and formatting choices. Supported options are listed in the [here](https://github.com/asbjornh/viewmodels/blob/master/docs/compiler.md)

**exclude**: `Array` of `String | RegExp` = `['node-modules']`

A file is excluded if its path matches any of the exclude patterns. Default is replaced when setting this.

**fileExtension**: `String`

Set the file extension (without the dot) of generated view models. If you're using one of the included generators you can most likely ignore this option.

**log**: `Boolean` = `false`

If set to true, will output some meta information from the plugin.

**include**: `Array` of `String | RegExp` = `[/\.jsx$/]`

A file is included if its path matches any of the include patterns (unless it matches an exclude pattern). Default is replaced when setting this.

**path**: `String`

Path relative to `output.path` to put view model files.

## Webpack dev server

When working with `webpack-dev-server`, the view model files will be written to memory instead of disk by default. If you have generated view models included in source control, it could be a good idea to use Webpack dev server's `writeToDisk` option.

## Config example

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
      fileExtension: 'kt',
      log: true,
      path: '../view-models',
      compilerOptions: {
        namespace: 'ViewModels',
        baseClass: 'SomeBaseClass',
        indent: 4,
        parser: parsers.typescriptReact,
        generator: generators.kotlin
      }
    })
  ]
};
```
