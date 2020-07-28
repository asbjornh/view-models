# Eslint plugin

```
npm install --save-dev eslint-plugin-view-models
```

This eslint plugin has rules for working with `view-models` and javascript-React.

.eslintrc.json:

```json
{
  "plugins": ["eslint-plugin-view-models"],
  "rules": {
    "view-models/no-errors": "error",
    "view-models/no-unused-meta": "warn",
    "view-models/no-meta-mismatch": "warn",
    "view-models/no-prop-mapping": "warn"
  }
}
```

Note that while the eslint plugin is installed separately from `view-models`, the source code actually lives in this package. This means that whenever you upgrade `view-models` the eslint plugin is also upgraded. `eslint-plugin-view-models` is merely a proxy package that imports files form `view-models`.

## Configuration

All rules support a `include` option for specifying what files the rule should be active for. The option takes a list of strings that are matched to the name of a file. The default value for `include` is `[".jsx"]` which means the rules will run for files that include `.jsx` in the file name. Example (applies to all rules):

```json
{
  "plugins": ["eslint-plugin-view-models"],
  "rules": {
    "view-models/no-errors": ["error", { "include": [".jsx", ".model.js"] }]
  }
}
```

## Rules

### no-errors

As the name implies, this rule checks for many common sources of compile errors from `view-models`.

### no-unused-meta

This rule disallows the use of property names in `viewModelMeta` when there's no corresponding property name in `propTypes`. Note that currently only top-level properties are checked.

### no-meta-mismatch

This rule disallows the use of meta types that don't match their corresponding propType. Note that currently only top-level properties are checked. Examples:

```js
Component.propTypes = {
  a: PropTypes.string,
  b: PropTypes.shape({}),
  c: PropTypes.arrayOf()
};
Component.viewModelMeta = {
  a: "int", // Error because "int" doesn't match "string"
  b: ["int"], // Error because array doesn't match "shape"
  c: {} // Error because object doesn't match "arrayOf"
};
```

### no-name-mismatch

This rule prevents errors caused by inconsistent naming. For instance, if the component `AbcDef` is imported as `abcdef` in another component, that would result in a reference to a generated type that doesn't exist (`abcdef`). Consistent names are enforced by requiring that both exported and imported names match file names. File names and import/export names can use different casing conventions.

Mismatches can be easy to miss. For example, the file name `youtube-player.jsx` has two words (`youtube` and `player`), while the component name `YouTubePlayer` has three (`You`, `Tube` and `Player`).

Examples:

```js
// Name of file: youtube-player.jsx

// Error: name mismatch between 'YouTubePlayer' and 'youtube-player'. (Correct export name should be 'YoutubePlayer')
export default YouTubePlayer;
```

```js
import Abcdef from "./abc-def.jsx";

A.propTypes = {
  b: PropTypes.exact(Abcdef.propTypes) // Error: name mismatch between 'Abcdef' and 'abc-def.jsx' (Correct import name should be 'AbcDef')
};
```

#### Configuration

This rule supports configuring the desired casing variant for both file names and import/export names. The available casing variants are "kebab", "snake", "camel" and "pascal". The default is kebab case for file names and pascal case for identifier names (import / export).

```json
{
  "rules": {
    "view-models/no-name-mismatch": [
      "error",
      { "fileNames": "kebab", "identifierNames": "pascal" }
    ]
  }
}
```

### no-prop-mapping

Disallows rendering props of a type inherited from another component without spreading those props. Manually mapping from props to the props of another component is a bad idea when inheriting types from that component because it you risk introducing some hard to catch bugs (this has happened). Note that currently only top-level props are checked. Also, this rule might report errors when there are none if there's a lot of shenanigans going on with props (like aliasing or destructuring).

Example:

```js
// This is OK:
const Component = ({ link }) => <Link {...link} />;
Component.propTypes = { link: PropTypes.exact(Link.propTypes) };

// This is an error:
const Component = ({ link }) => <Link url={link.url} text={link.text} />;
Component.propTypes = { link: PropTypes.exact(Link.propTypes) };
```
