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

const message = (idName, idCasing, fileName, fileCasing) =>
  `'${idName}' (${idCasing} case) does not match the file name '${fileName}' (${fileCasing} case)`;

const validCases = [
  // Export name/file name match
  ["abc-def.jsx", ""],
  ["abc-def.jsx", `export const AbcDef = () => null;`],
  [
    "abc-def.jsx",
    `const AbcDef = () => null;
      export default AbcDef;`
  ],
  ["abc_def.jsx", "export const AbcDef = () => null;", { fileNaming: "snake" }],
  ["AbcDef.jsx", "export const AbcDef = () => null;", { fileNaming: "pascal" }],
  ["abcDef.jsx", "export const AbcDef = () => null;", { fileNaming: "camel" }],

  // Import source/reference name match
  ["abc-def.jsx", `import jklmno from 'jkl-mno';`], // Not an error if not referenced
  ["abc-def.jsx", `import jkl_mno from 'JklMno';`], // Not an error if not referenced
  [
    "abc-def.jsx",
    `import JklMno from 'jkl-mno';
      A.propTypes = { a: PropTypes.exact(JklMno.propTypes) };`
  ],
  [
    "abc-def.jsx",
    `import JklMno from 'jkl_mno';
    A.propTypes = { a: PropTypes.exact(JklMno.propTypes) };`,
    { fileNaming: "snake" }
  ]
];

const invalidCases = [
  // Export name/file name mismatch
  [
    "abc-de.jsx",
    "export const AbcDef = () => null;",
    [message("AbcDef", "pascal", "abc-de.jsx", "kebab")]
  ],
  [
    "abcdef.jsx",
    "export const AbcDef = () => null;",
    [message("AbcDef", "pascal", "abcdef.jsx", "kebab")]
  ],

  // Import source/reference name mismatch
  [
    "abc-def.jsx",
    `import jklmno from 'jkl-mno';
      A.propTypes = { a: PropTypes.exact(jklmno.propTypes) };`,
    ["'jklmno' is not pascal case"]
  ],
  [
    "abc-def.jsx",
    `import JklMno from 'JklMno';
      A.propTypes = { a: PropTypes.exact(JklMno.propTypes) };`,
    ["'JklMno' is not kebab case"]
  ],
  [
    "abc-def.jsx",
    `import Jklmno from 'jkl-mno';
      A.propTypes = { a: PropTypes.exact(Jklmno.propTypes) };`,
    [message("Jklmno", "pascal", "jkl-mno", "kebab")]
  ],
  [
    "abc-def.jsx",
    `import JklMno from 'jkl_mno';
      A.propTypes = { a: PropTypes.exact(JklMno.propTypes) };`,
    [message("JklMno", "pascal", "jkl_mno", "kebab")]
  ]
];

ruleTester.run("no-name-mismatch", plugin.rules["no-name-mismatch"], {
  valid: validCases.map(([filename, code, options]) => ({
    code,
    filename,
    options: [options]
  })),
  invalid: invalidCases.map(([filename, code, errors, options]) => ({
    code,
    filename,
    errors: errors.map(error => ({ message: error })),
    options: [options]
  }))
});
