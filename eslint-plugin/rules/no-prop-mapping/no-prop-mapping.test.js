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

const message = (propName, typeName) =>
  `'${propName}' is of type '${typeName}.propTypes' but has no corresponding spread element`;

const validCases = [
  "",

  "const A = () => <div />",

  `const A = ({ b }) => <div>{b.map(b => <div b={b} />)}</div>
  A.propTypes = { b: PropTypes.arrayOf(PropTypes.exact(B.propTypes)) }`,

  `const A = ({ b }) => <B {...b} />
  A.propTypes = { b: PropTypes.exact(B.propTypes) }`,

  `const A = ({ b, c }) => <div>{c.map(c => <B {...b} />)}</div>
  A.propTypes = { b: PropTypes.exact(B.propTypes) }`,

  `const A = props => <B {...props.b} />
  A.propTypes = { b: PropTypes.exact(B.propTypes) }`,

  `const A = props => <div>{props.c.map(c => <B {...props.b} />)}</div>
  A.propTypes = { b: PropTypes.exact(B.propTypes) }`,

  `class A {
    static propTypes = { b: PropTypes.exact(B.propTypes) }
    render() { return <B {...this.props.b} /> }
  }`,

  `class A {
    static propTypes = { b: PropTypes.exact(B.propTypes) }
    render() { return <div>{this.props.c.map(c => <B {...this.props.b} />)}</div> }
  }`
];

const invalidCases = [
  [
    `const A = ({ b, c }) => <B {...c} />
    A.propTypes = { b: PropTypes.exact(B.propTypes) }`,
    message("b", "B")
  ],

  [
    `const A = ({ b, c }) => <div>{c.map(c => <B {...c} />)}</div>
    A.propTypes = { b: PropTypes.exact(B.propTypes) }`,
    message("b", "B")
  ],

  [
    `const A = props => <B {...props.c} />
    A.propTypes = { b: PropTypes.exact(B.propTypes) }`,
    message("b", "B")
  ],

  [
    `const A = props => <div>{props.c.map(c => <B {...props.c} />)}</div>
    A.propTypes = { b: PropTypes.exact(B.propTypes) }`,
    message("b", "B")
  ],

  [
    `class A {
      static propTypes = { b: PropTypes.exact(B.propTypes) }
      render() { return <B {...this.props.c} /> }
    }`,
    message("b", "B")
  ],

  [
    `class A {
      static propTypes = { b: PropTypes.exact(B.propTypes) }
      render() { return <div>{this.props.c.map(c => <B {...this.props.c} />)}</div> }
    }`,
    message("b", "B")
  ]
];

// The eslint plugin will only run for .jsx files, so a filename is added for all tests
ruleTester.run("no-prop-mapping", plugin.rules["no-prop-mapping"], {
  valid: validCases.map(code => ({ code, filename: "a.jsx" })),
  invalid: invalidCases.map(([code, ...errors]) => ({
    code,
    filename: "a.jsx",
    errors: errors.map(error => ({ message: error }))
  }))
});

// Test non-jsx files
ruleTester.run("no-prop-mapping", plugin.rules["no-prop-mapping"], {
  valid: [
    {
      code: `const A = ({ b, c }) => <B {...c} />
      A.propTypes = { b: PropTypes.exact(B.propTypes) }`,
      filename: "a.js"
    }
  ],
  invalid: [
    {
      code: `const A = ({ b, c }) => <B {...c} />
      A.propTypes = { b: PropTypes.exact(B.propTypes) }`,
      options: [{ include: [".js"] }],
      filename: "a.js",
      errors: [{ message: message("b", "B") }]
    }
  ]
});
