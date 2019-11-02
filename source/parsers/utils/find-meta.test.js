const { parse } = require("@babel/parser");
const test = require("ava");
const types = require("@babel/types");

const findMeta = require("./find-meta").default;

const findInSource = sourceCode =>
  findMeta(parse(sourceCode, { plugins: ["classProperties", "jsx"] }));

test("No meta", t => {
  const result = findInSource("const C = () => <div />;");
  t.deepEqual(result, types.objectExpression([]));
});

test("String literal", t => {
  const result = findInSource('C.viewModelMeta = "ignore";');
  t.is(true, types.isStringLiteral(result, { value: "ignore" }));
});

test("From object property", t => {
  const result = findInSource('C.viewModelMeta = { a: "ignore" };');
  t.is(true, types.isObjectExpression(result));
  t.is(1, result.properties.length);
  const [property] = result.properties;
  t.is(true, types.isStringLiteral(property.value, { value: "ignore" }));
});

test("From class property", t => {
  const result = findInSource(
    'class C { static viewModelMeta = { a: "int" } }'
  );
  t.is(true, types.isObjectExpression(result));
  t.is(1, result.properties.length);
  const [property] = result.properties;
  t.is(true, types.isStringLiteral(property.value, { value: "int" }));
});
