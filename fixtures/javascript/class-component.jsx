import React from "react";
import pt from "prop-types";

const Link = () => {};

const enumArray = ["value-1", "value-2"];
const enumObject = {
  valueA: "value-a",
  valueB: "value-b"
};

class ClassComponent extends React.Component {
  static propTypes = {
    text: pt.string.isRequired,
    isSomething: pt.bool,
    number: pt.number,
    intNumber: pt.number,
    floatNumber: pt.number,
    texts: pt.arrayOf(pt.string),
    singleObject: pt.shape({
      propertyA: pt.string.isRequired
    }),
    objects: pt.arrayOf(
      pt.shape({
        propertyB: pt.string.isRequired
      })
    ).isRequired,
    shapeIgnore: pt.shape({
      object: pt.object
    }),
    floatArray: pt.arrayOf(pt.number).isRequired,
    objectArray: pt.arrayOf(pt.shape({ a: pt.number, b: pt.number })),
    nestedList: pt.arrayOf(pt.arrayOf(pt.arrayOf(pt.string))),
    nestedIgnore: pt.shape({
      a: pt.object
    }),
    nestedShape: pt.shape({
      a: pt.shape({
        b: pt.shape({
          c: pt.string
        })
      })
    }),
    link: pt.shape(Link.propTypes),
    linkList: pt.arrayOf(pt.shape(Link.propTypes)),
    enumArray: pt.oneOf(enumArray).isRequired,
    enumInline: pt.oneOf([1, 2]),
    enumObject: pt.oneOf(Object.keys(enumObject)),

    // These should be ignored
    instance: pt.instanceOf(Link),
    ignoreMe: pt.number,
    node: pt.node,
    element: pt.element,
    function: pt.func
  };

  static viewModelMeta = {
    intNumber: "int",
    floatNumber: "float",
    ignoreMe: "ignore",
    shapeIgnore: "ignore",
    nestedIgnore: {
      a: "ignore"
    },
    floatArray: ["float"],
    objectArray: [{ a: "int?", b: "float" }]
  };

  render() {
    return null;
  }
}

export default ClassComponent;
