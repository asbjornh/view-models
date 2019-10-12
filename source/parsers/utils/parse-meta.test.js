const { parse } = require("@babel/parser");
const test = require("ava");

const findMeta = require("./find-meta").default;
const parseMeta = require("./parse-meta").default;
const { metaTypeNames } = require("../../lib/node-types");

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
  `C.viewmodelMeta = {
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

test("Nested", template, 'C.viewmodelMeta = { a: { b: "exclude" } };', {
  a: { type: "object", children: { b: { type: "exclude" } } }
});

test("No meta", template, "const C = () => <div />;", {});

Object.values(metaTypeNames).forEach(stringType => {
  test(
    `Extracts '${stringType}'`,
    template,
    `C.viewmodelMeta = { a: "${stringType}" };`,
    { a: { type: stringType } }
  );
});

test(
  "Extracts component reference",
  template,
  "C.viewmodelMeta = { a: SomeComponent };",
  { a: { type: "ref", ref: "SomeComponent" } }
);

test(
  "Transforms Array",
  template,
  "C.viewmodelMeta = { a: [SomeComponent] };",
  { a: { type: "list", elementType: { type: "ref", ref: "SomeComponent" } } }
);

test(
  "Array with object literal",
  template,
  'C.viewmodelMeta = { a: [{ b: "float" }] };',
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
  'C.viewmodelMeta = { a: "exclud" };',
  "Invalid meta type for 'a': expected one of [exclude,bool,double,double?,float,float?,int,int?,string] but got 'exclud'"
);

test(
  "Throws on function",
  throwsTemplate,
  "C.viewmodelMeta = { a: Object.keys(obj) };",
  "Invalid meta type for 'a': unsupported type"
);

test(
  "Throws on empty Array",
  throwsTemplate,
  "C.viewmodelMeta = { a: [] };",
  "Invalid meta type for 'a': missing value"
);

test(
  "Throws on invalid array element",
  throwsTemplate,
  "C.viewmodelMeta = { a: [Component.propTypes] };",
  "Invalid meta type for 'a': unsupported type"
);

const unsupportedTypes = ["null", "false", "true", "Array()"];

test("Throws on unsupported meta types", t => {
  unsupportedTypes.forEach(type => {
    const error = t.throws(() => {
      parseFromSource(`C.viewmodelMeta = { a: ${type} };`);
    });

    t.is("Invalid meta type for 'a': unsupported type", error.message);
  });
});
