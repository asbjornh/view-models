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

**metaFileGenerator**: `Function`

Use this option to generate additional files based on metadata collected during type compilation. The generator function receives a list of metadata objects and is expected to return a list of objects describing files to write. File objects should have a `path` property (a path relative to `options.path`) and a `content` property (`string`). Note that metadata objects contain both a `componentName` and a `typeName` since the name of a generated view model is not necessarily the same as the name of the component it's generated from. See example below.

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
        supertype: 'SomeTypeName',
        header: '// This is an automatically generated file',
        indent: 4,
        parser: parsers.typescriptReact,
        generator: generators.kotlin
      }
    })
  ]
};
```

## Metafile generator

The `metaFileGenerator` option can be used to generate additional files. This example generates a manifest file:

```js
const manifestGenerator = metadatas => {
  const properties = metadatas
    .map(
      meta => `public static string ${meta.typeName} = "${meta.componentName}";`
    )
    .join("\n  ");
  const content = `public static class Manifest\n{\n  ${properties}\n}`;
  return [{ path: "../Manifest.cs", content }];
};
```

This would generate the following file one folder above where view models are output:

```cs
public static class Manifest
{
  public static string SomeComponent = "SomeComponent";
  // ... The rest of the components
}
```
