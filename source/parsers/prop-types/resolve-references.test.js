const generate = require("@babel/generator").default;
const { parse } = require("@babel/parser");
const test = require("ava");

const expandReferencess = require("./resolve-references").default;

const template = (t, input, expected, propTypesMeta = {}) => {
  const syntaxTree = parse(input, {
    plugins: ["classProperties"],
    sourceType: "module"
  });
  expandReferencess(syntaxTree, "Component", "PropTypes", propTypesMeta);

  t.is(generate(syntaxTree, { minified: true }).code, expected);
};

const throwsTemplate = (t, input, errorMessage) => {
  const syntaxTree = parse(input, {
    sourceType: "module",
    plugins: ["classProperties"]
  });
  const error = t.throws(() => {
    expandReferencess(syntaxTree, "Component", "PropTypes");
  });
  t.is(error.message, errorMessage);
};

test(
  "Func component: inline literal",
  template,
  "Component.propTypes={prop:PropTypes.oneOf([1,2])};",
  "Component.propTypes={prop:PropTypes.oneOf([1,2])};"
);

test(
  "Func component: array literal",
  template,
  "const array=[1,2];Component.propTypes={prop:PropTypes.oneOf(array)};",
  "const array=[1,2];Component.propTypes={prop:PropTypes.oneOf([1,2])};"
);

test(
  "Func component: object keys",
  template,
  "const object={a:1,b:2};Component.propTypes={prop:PropTypes.oneOf(Object.keys(object))}",
  "const object={a:1,b:2};Component.propTypes={prop:PropTypes.oneOf(Object.keys({a:1,b:2}))};"
);

test(
  "Func component: object values",
  template,
  "const object={a:1,b:2};Component.propTypes={prop:PropTypes.oneOf(Object.values(object))}",
  "const object={a:1,b:2};Component.propTypes={prop:PropTypes.oneOf(Object.values({a:1,b:2}))};"
);

test(
  "Class component: inline literal",
  template,
  "class Component{static propTypes={prop:PropTypes.oneOf([1,2])};}",
  "class Component{static propTypes={prop:PropTypes.oneOf([1,2])}}"
);

test(
  "Class component: array literal",
  template,
  "const array=[1,2];class Component{static propTypes={prop:PropTypes.oneOf(array)};}",
  "const array=[1,2];class Component{static propTypes={prop:PropTypes.oneOf([1,2])}}"
);

test(
  "Class component: object keys",
  template,
  "const object={a:1,b:2};class Component{static propTypes={prop:PropTypes.oneOf(Object.keys(object))};}",
  "const object={a:1,b:2};class Component{static propTypes={prop:PropTypes.oneOf(Object.keys({a:1,b:2}))}}"
);

test(
  "Class component: object values",
  template,
  "const object={a:1,b:2};class Component{static propTypes={prop:PropTypes.oneOf(Object.values(object))}}",
  "const object={a:1,b:2};class Component{static propTypes={prop:PropTypes.oneOf(Object.values({a:1,b:2}))}}"
);

test(
  "Class component: throws on missing literal",
  throwsTemplate,
  'import array from ".";class Component{static propTypes={prop:PropTypes.oneOf(array)};}',
  "Couldn't resolve value in 'PropTypes.oneOf' for prop 'prop'. Make sure that 'array' is assigned a value in the above file."
);

test(
  "Func component: throws on missing literal",
  throwsTemplate,
  'import array from ".";Component.propTypes={prop:PropTypes.oneOf(array)};',
  "Couldn't resolve value in 'PropTypes.oneOf' for prop 'prop'. Make sure that 'array' is assigned a value in the above file."
);

test(
  "Throws on undefined literal",
  throwsTemplate,
  "Component.propTypes={prop:PropTypes.oneOf(array)};",
  "Couldn't resolve value in 'PropTypes.oneOf' for prop 'prop'. Make sure that 'array' is assigned a value in the above file."
);

test(
  "Throws on empty PropTypes.oneOf",
  throwsTemplate,
  "Component.propTypes={prop:PropTypes.oneOf()};",
  "Missing value in 'PropTypes.oneOf' for prop 'prop'"
);

test(
  "Throws on empty Object.keys in PropTypes.oneOf",
  throwsTemplate,
  "Component.propTypes={prop:PropTypes.oneOf(Object.keys())}",
  "Missing value in 'PropTypes.oneOf' for prop 'prop'"
);

test(
  "Throws on missing object literal",
  throwsTemplate,
  "Component.propTypes={prop:PropTypes.oneOf(Object.keys(obj))}",
  "Couldn't resolve value in 'PropTypes.oneOf' for prop 'prop'. Make sure that 'obj' is assigned a value in the above file."
);

test(
  "Throws on undefined object value",
  throwsTemplate,
  "let obj; Component.propTypes={prop:PropTypes.oneOf(Object.keys(obj))}",
  "Couldn't resolve value in 'PropTypes.oneOf' for prop 'prop'. Make sure that 'obj' is assigned a value in the above file."
);
