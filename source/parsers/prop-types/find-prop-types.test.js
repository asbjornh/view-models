const bt = require("@babel/types");
const { parse } = require("@babel/parser");
const test = require("ava");

const findPropTypes = require("./find-prop-types").default;

test("Functional component", t => {
  const syntaxTree = parse("C.propTypes = { a: string };");
  const propTypes = findPropTypes(syntaxTree, "C");
  const [property] = propTypes.properties;

  t.true(bt.isIdentifier(property.key, { name: "a" }));
  t.true(bt.isIdentifier(property.value, { name: "string" }));
});

test("Class component", t => {
  const syntaxTree = parse("class C { static propTypes = { a: string }; }", {
    plugins: ["classProperties"]
  });
  const propTypes = findPropTypes(syntaxTree, "C");
  const [property] = propTypes.properties;

  t.true(bt.isIdentifier(property.key, { name: "a" }));
  t.true(bt.isIdentifier(property.value, { name: "string" }));
});

const throwsTemplate = (t, input, errorMessage) => {
  const syntaxTree = parse(input, { plugins: ["jsx"] });

  const error = t.throws(() => {
    findPropTypes(syntaxTree, "C");
  });

  t.is(errorMessage, error.message);
};

test(
  "Throws on missing propTypes",
  throwsTemplate,
  "const C = () => <div />;",
  "PropTypes not found"
);

test(
  "Throws with wrong component name in propTypes definition",
  throwsTemplate,
  "const C = () => <div />; D.propTypes = { a: PropTypes.string };",
  "PropTypes not found"
);
