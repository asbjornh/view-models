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

const message = (metaType, propType) =>
  `'${metaType}' does not match 'PropTypes.${propType}'`;

const validCases = [
  "",

  "A.propTypes = {};",

  "A.propTypes = {}; A.viewModelMeta = {};",

  "A.viewModelMeta = 'ignore';",

  "A.propTypes = {}; A.viewModelMeta = 'ignore';",

  `A.propTypes = {
    b: PropTypes.arrayOf(),
    c: PropTypes.shape(),
    d: PropTypes.exact(),
    e: PropTypes.number
  };
  A.viewModelMeta = {
    b: "ignore",
    c: "ignore",
    d: "ignore",
    e: "ignore"
  };`,

  `A.propTypes = {
    b: PropTypes.arrayOf(),
    c: PropTypes.shape(),
    d: PropTypes.exact(),
  };
  A.viewModelMeta = {
    b: [],
    c: {},
    d: {},
  };`,

  `A.propTypes = {
    a: PropTypes.number,
    b: PropTypes.number,
    c: PropTypes.number,
    d: PropTypes.number,
    e: PropTypes.number,
    f: PropTypes.number,
  };
  A.viewModelMeta = {
    a: "int",
    b: "int?",
    c: "float",
    d: "float?",
    e: "double",
    f: "double?"
  };`,

  `A.propTypes = {
    b: PropTypes.arrayOf().isRequired,
    c: PropTypes.shape().isRequired,
    d: PropTypes.exact().isRequired,
    e: PropTypes.number.isRequired
  };
  A.viewModelMeta = {
    b: [],
    c: {},
    d: {},
    e: "int"
  };`
];

const invalidCases = [
  [
    `A.propTypes = {
      b: PropTypes.arrayOf(),
      c: PropTypes.shape(),
      d: PropTypes.exact(),
      e: PropTypes.string,
      f: PropTypes.bool
    }
    A.viewModelMeta = {
      b: {},
      c: [],
      d: [],
      e: "int",
      f: "double"
    }`,
    message("object", "arrayOf"),
    message("array", "shape"),
    message("array", "exact"),
    message("int", "string"),
    message("double", "bool")
  ],
  [
    `A.propTypes = {
      b: PropTypes.arrayOf().isRequired,
      c: PropTypes.shape().isRequired,
      d: PropTypes.exact().isRequired,
      e: PropTypes.string.isRequired,
      f: PropTypes.bool.isRequired
    }
    A.viewModelMeta = {
      b: {},
      c: [],
      d: [],
      e: "int",
      f: "double"
    }`,
    message("object", "arrayOf"),
    message("array", "shape"),
    message("array", "exact"),
    message("int", "string"),
    message("double", "bool")
  ]
];

// The eslint plugin will only run for .jsx files, so a filename is added for all tests
ruleTester.run("no-meta-mismatch", plugin.rules["no-meta-mismatch"], {
  valid: validCases.map(code => ({ code, filename: "a.jsx" })),
  invalid: invalidCases.map(([code, ...errors]) => ({
    code,
    filename: "a.jsx",
    errors: errors.map(error => ({ message: error }))
  }))
});

// Test non-jsx files
ruleTester.run("no-meta-mismatch", plugin.rules["no-meta-mismatch"], {
  valid: [
    {
      code: `
      C.propTypes = { a: PropTypes.string };
      C.viewModelMeta = { a: 'int' };`,
      filename: "a.js"
    }
  ],
  invalid: [
    {
      code: `
      C.propTypes = { a: PropTypes.string };
      C.viewModelMeta = { a: 'int' };`,
      options: [{ include: [".js"] }],
      filename: "a.js",
      errors: [{ message: message("int", "string") }]
    }
  ]
});
