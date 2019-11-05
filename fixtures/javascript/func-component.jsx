import React from "react";
import pt from "prop-types";

const Link = () => {};

const enumArray = ["value-1", "value-2"];
const enumObject = {
  valueA: "value-a",
  valueB: "value-b"
};

const FunctionalComponent = {};

FunctionalComponent.propTypes = {
  text: pt.string.isRequired,
  isSomething: pt.bool,
  number: pt.number,
  intNumber: pt.number,
  floatNumber: pt.number.isRequired,
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
  shapeMeta: pt.shape({
    object: pt.object
  }).isRequired,
  objectArray: pt.arrayOf(pt.object).isRequired,
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
  linkMeta: pt.object,
  linkListMeta: pt.array,
  enumArray: pt.oneOf(enumArray).isRequired,
  enumInline: pt.oneOf([1, 2]),
  enumObject: pt.oneOf(Object.keys(enumObject)),
  instance: pt.instanceOf(Link),
  ignoreMe: pt.number,
  node: pt.node,
  element: pt.element,
  function: pt.func
};

FunctionalComponent.propTypes.mutationProp = pt.string;

FunctionalComponent.viewModelMeta = {
  intNumber: "int",
  floatNumber: "float",
  ignoreMe: "ignore",
  shapeIgnore: "ignore",
  shapeMeta: {
    object: Link
  },
  nestedIgnore: {
    a: "ignore"
  },
  objectArray: [Link],
  linkMeta: Link,
  linkListMeta: [Link]
};

export default FunctionalComponent;
