# React (javascript) parser

```js
import { parsers } from "view-models";

// Pass this parser to the compiler or to the Webpack plugin in order to use prop-types source
const parser = parsers.propTypes;
```

This is the default parser. Strictly speaking, this parser only looks for type definitions from `prop-types` (which is why it's called `propTypes`), so you could theoretically use it for non-React apps. This parser has been used in production for several medium-sized apps since 2018.

The parser requires you to write types in a certain way (probably a bit differently than you're used to), so please read through this document before getting started. This guide makes several references to types like `func` and `node`, which are abbreviations of their full names (`PropTypes.func` and `PropTypes.node` in this case).

## Ignored props

Props of type `func`, `element`, `node` and `instanceOf` are ignored by the parser because they make no sense in server-land. These can be used as normal.

## Invalid propTypes

Some propTypes are ambiguous and cannot be used for view model generation.

**PropTypes.object**

A type of `object` carries very little information and is not considered valid by the parser. `object` should be replaced with `shape` / `exact` / `objectOf` or be explicitly ignored using `viewModelMeta` (see below). Using the propTypes of another component is usually the best choice when passing props to child components:

```jsx
const Component = ({ link }) => <Link {...link} />;

Compontent.propTypes = {
  link: PropTypes.exact(Link.propTypes) // Reference to Link component
};
```

The above example will result in a view model that has a reference to the view model for `Link`, which means the definition of `Link` is now re-used:

```cs
// C# example
public class Component {
  public Link Link { get; set; }
}
```

**PropTypes.array**

`PropTypes.array` carries almost as little information as `ojbect`, and should be replaced by an `arrayOf` or be explicitly ignored using `viewModelMeta`.

**PropTypes.any**

Use a different type or ignore using `viewModelMeta`.

**PropTypes.symbol**

Use a different type or ignore using `viewModelMeta`.

## viewModelMeta (`String | Object`)

Some times you need to use `PropTypes.object` on the client or you need a generated view model to specify `float` instead of `int`. In those cases you can use `viewModelMeta` to provide type hints. `viewModelMeta` can be either a `String` or an `Object`.

### `String`

The only supported string value for `viewModelMeta` is `'ignore'`. When `Component.viewModelMeta = 'ignore';`, no view model will be generated for the component.

### `Object`

Supported values for props in `viewModelMeta` are

- `"int"`
- `"int?"`
- `"float"`
- `"float?"`
- `"double"`
- `"double?"`
- `"ignore"`
- `Object`
- `string[]`
- `Object[]`

Functional component example:

```jsx
const Component = () => <div />;

Component.propTypes = {
  someProp: PropTypes.number,
  arrayProp: PropTypes.array,
  nullableFloats: PropTypes.arrayOf(PropTypes.number),
  doubles: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number
    })
  )
};

Component.viewModelMeta = {
  someProp: "float",
  arrayProp: "ignore",
  nullableFloats: ["float?"],
  doubles: [{ number: "double" }]
};
```

Class component:

```jsx
class Component extends React.Component {
  static propTypes = {
    someProp: PropTypes.number,
    arrayProp: PropTypes.array,
    nullableFloats: PropTypes.arrayOf(PropTypes.number),
    doubles: PropTypes.arrayOf(
      PropTypes.shape({
        number: PropTypes.number
      })
    )
  };

  static viewModelMeta = {
    someProp: "float",
    arrayProp: "ignore",
    nullableFloats: ["float?"],
    doubles: [{ number: "double" }]
  };
}
```

## Inheritance

You can inherit types from other components using a plain reference or using `Object.assign`. The output type definition will then inherit from the generated type definition of the referenced component. The `baseClass` option will be overridden when inheriting. Make sure that the component you're inheriting from also has a generated type definition!

Simple:

```js
MyComponent.propTypes = OtherComponent.propTypes;
```

With properties:

```js
// Remember to not mutate other components' propTypes!
MyComponent.propTypes = Object.assign({}, OtherComponent.propTypes, {
  foo: PropTypes.string,
  bar: PropTypes.number
});
```
