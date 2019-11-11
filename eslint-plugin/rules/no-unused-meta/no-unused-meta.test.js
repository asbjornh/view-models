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
  "",

  "A.propTypes = {};",

  "A.propTypes = {}; A.viewModelMeta = {};",

  "A.viewModelMeta = 'ignore';",

  "A.propTypes = {}; A.viewModelMeta = 'ignore';"
];

const invalidCases = [
  [
    `A.propTypes;
    A.viewModelMeta = { b: 'ignore' };
    `,
    "Component has no propTypes"
  ],
  [
    `A.propTypes = { a: PropTypes.string };
    A.viewModelMeta = { b: 'ignore' };
    `,
    message("b")
  ]
];

// The eslint plugin will only run for .jsx files, so a filename is added for all tests
ruleTester.run("no-unused-meta", plugin.rules["no-unused-meta"], {
  valid: validCases.map(code => ({ code, filename: "a.jsx" })),
  invalid: invalidCases.map(([code, ...errors]) => ({
    code,
    filename: "a.jsx",
    errors: errors.map(error => ({ message: error }))
  }))
});

// Test non-jsx files
ruleTester.run("no-unused-meta", plugin.rules["no-unused-meta"], {
  valid: [{ code: "C.propTypes = { a: propTypes.object };", filename: "a.js" }],
  invalid: []
});
