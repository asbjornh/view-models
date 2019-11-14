const test = require("ava");
const RuleTester = require("eslint-ava-rule-tester");
const path = require("path");

const plugin = require("../../index");

const ruleTester = new RuleTester(test, {
  parser: path.resolve(
    __dirname,
    "../../../node_modules/babel-eslint/lib/index.js"
  ),
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: { classes: true, jsx: true },
    sourceType: "module"
  }
});

const message = name => `'${name}' is not defined in component propTypes`;

const validCases = [
  `const A = (props) => <div>{c.map(c => <B {...c} {...props.b} />)}<B {...props.b} /></div>;
  A.propTypes = { b: PropTypes.exact(B.propTypes) };`
];

const invalidCases = [];

// The eslint plugin will only run for .jsx files, so a filename is added for all tests
ruleTester.run("no-prop-mapping", plugin.rules["no-prop-mapping"], {
  valid: validCases.map(code => ({ code, filename: "a.jsx" })),
  invalid: invalidCases.map(([code, ...errors]) => ({
    code,
    filename: "a.jsx",
    errors: errors.map(error => ({ message: error }))
  }))
});

// TODO:
// Test non-jsx files
// ruleTester.run("no-prop-mapping", plugin.rules["no-prop-mapping"], {
//   valid: [{ code: "C.viewModelMeta = { a: 'ignore' };", filename: "a.js" }],
//   invalid: [
//     {
//       code: "C.viewModelMeta = { a: 'ignore' };",
//       options: [{ include: [".js"] }],
//       filename: "a.js",
//       errors: [{ message: "Component has no propTypes" }]
//     }
//   ]
// });
