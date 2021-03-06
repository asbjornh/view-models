const { parse } = require("@babel/parser");
const test = require("ava");

const findMeta = require("./find-meta").default;
const parseMeta = require("./parse-meta").default;
const { metaTypeNames } = require("../../node-types");

const parseFromSource = sourceCode => {
  const metaNode = findMeta(
    parse(sourceCode, { plugins: ["classProperties", "jsx"] })
  );
  return parseMeta(metaNode);
};

const template = (t, input, expected) => {
  const result = parseFromSource(input);
  t.deepEqual(expected, result);
};

const throwsTemplate = (t, input, errorMessage) => {
  const error = t.throws(() => {
    parseFromSource(input);
  });

  t.is(errorMessage, error.message);
};

test(
  "Allowed string types",
  template,
  `C.viewModelMeta = {
    a: 'int',
    b: 'float',
    c: 'double',
    d: 'int?',
    e: 'float?',
    f: 'double?'
  };`,
  {
    a: { type: "int" },
    b: { type: "float" },
    c: { type: "double" },
    d: { type: "int?" },
    e: { type: "float?" },
    f: { type: "double?" }
  }
);

test("Nested", template, 'C.viewModelMeta = { a: { b: "ignore" } };', {
  a: { type: "object", children: { b: { type: "ignore" } } }
});

test("No meta", template, "const C = () => <div />;", {});

Object.values(metaTypeNames).forEach(stringType => {
  test(
    `Extracts '${stringType}'`,
    template,
    `C.viewModelMeta = { a: "${stringType}" };`,
    { a: { type: stringType } }
  );
});

test("Transforms Array", template, "C.viewModelMeta = { a: ['ignore'] };", {
  a: { type: "list", elementType: { type: "ignore" } }
});

test(
  "Array with object literal",
  template,
  'C.viewModelMeta = { a: [{ b: "float" }] };',
  {
    a: {
      type: "list",
      elementType: { type: "object", children: { b: { type: "float" } } }
    }
  }
);

test(
  "Throws on misspelled string",
  throwsTemplate,
  'C.viewModelMeta = { a: "exclud" };',
  "Invalid meta type for 'a': Expected one of [ignore,double,double?,float,float?,int,int?] but got 'exclud'."
);

test(
  "Throws on function",
  throwsTemplate,
  "C.viewModelMeta = { a: Object.keys(obj) };",
  "Invalid meta type for 'a': Expected a string, array or object but got a 'CallExpression'"
);

test(
  "Throws on empty Array",
  throwsTemplate,
  "C.viewModelMeta = { a: [] };",
  "Invalid meta type for 'a': missing value"
);

test(
  "Throws on invalid array element",
  throwsTemplate,
  "C.viewModelMeta = { a: [Component.propTypes] };",
  "Invalid meta type for 'a': Expected a string, array or object but got a 'MemberExpression'"
);

const unsupportedTypes = [
  ["null", "NullLiteral"],
  ["false", "BooleanLiteral"],
  ["true", "BooleanLiteral"],
  ["Array()", "CallExpression"]
];

test("Throws on unsupported meta types", t => {
  unsupportedTypes.forEach(([type, nodeType]) => {
    const error = t.throws(() => {
      parseFromSource(`C.viewModelMeta = { a: ${type} };`);
    });

    t.is(
      `Invalid meta type for 'a': Expected a string, array or object but got a '${nodeType}'`,
      error.message
    );
  });
});
