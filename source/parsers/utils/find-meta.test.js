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
  const result = findInSource('C.viewModelMeta = "exclude";');
  t.is(true, types.isStringLiteral(result, { value: "exclude" }));
});

test("From object property", t => {
  const result = findInSource('C.viewModelMeta = { a: "exclude" };');
  t.is(true, types.isObjectExpression(result));
  t.is(1, result.properties.length);
  const [property] = result.properties;
  t.is(true, types.isStringLiteral(property.value, { value: "exclude" }));
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
