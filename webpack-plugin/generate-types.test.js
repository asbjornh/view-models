const test = require("ava");
const path = require("path");

const generateTypes = require("./generate-types");

test("Generates types", t => {
  t.plan(2);

  const { types, error } = generateTypes([
    path.join(__dirname, "../fixtures/javascript/class-component.jsx"),
    path.join(__dirname, "../fixtures/javascript/func-component.jsx")
  ]);

  t.is(null, error);
  t.is(types.filter(({ error }) => !error).length, 2);
});

test("Returns error on duplicate component names", t => {
  const component1Path = path.resolve(
    __dirname,
    "../fixtures/javascript/func-component.jsx"
  );
  const component2Path = path.resolve(
    __dirname,
    "../fixtures/javascript/nested-component/func-component.jsx"
  );

  const { error } = generateTypes([component1Path, component2Path]);

  const expectedError = `Found duplicate component names in:
FunctionalComponent (${component1Path})
FunctionalComponent (${component2Path})`;

  t.is(expectedError, error);
});

test("Returns type generation error", t => {
  const modulePath = path.resolve(
    __dirname,
    "../fixtures/javascript/error-component.jsx"
  );
  const { types } = generateTypes([modulePath]);
  const expectedError = `
${modulePath}
Invalid type for prop 'a':
Type 'object' is not supported.
`;

  t.is(expectedError, types[0].error);
});
