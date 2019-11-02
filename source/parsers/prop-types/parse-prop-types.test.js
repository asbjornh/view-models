const { parse } = require("@babel/parser");
const test = require("ava");

const normalize = require("../../../test-utils/normalize-string");
const parsePropTypes = require("./parse-prop-types").default;

const template = (t, input, meta, expected) => {
  const ast = parse(input);
  const propTypes = ast.program.body[0].expression;

  t.deepEqual(expected, parsePropTypes(propTypes, meta));
};

const throwsTemplate = (t, input, errorMessage) => {
  const ast = parse(input);
  const propTypes = ast.program.body[0].expression;

  const error = t.throws(() => {
    parsePropTypes(propTypes);
  });

  t.is(normalize(errorMessage), normalize(error.message));
};

test(
  "Basic types",
  template,
  `({
    a: string.isRequired,
    b: number,
    c: bool
  })`,
  {},
  {
    a: { type: "string", required: true },
    b: { type: "int" },
    c: { type: "bool" }
  }
);

test(
  "oneOf numbers",
  template,
  `({ a: oneOf([1,2]) })`,
  {},
  {
    a: {
      type: "enum",
      children: [{ key: "1", value: 1 }, { key: "2", value: 2 }]
    }
  }
);

test(
  "oneOf strings",
  template,
  `({ a: oneOf(['a','b']) })`,
  {},
  {
    a: {
      type: "enum",
      children: [{ key: "a", value: "a" }, { key: "b", value: "b" }]
    }
  }
);

test(
  "oneOf required",
  template,
  `({ a: oneOf([1]).isRequired })`,
  {},
  { a: { type: "enum", children: [{ key: "1", value: 1 }], required: true } }
);

test(
  "oneOf Object.keys",
  template,
  `({ a: oneOf(Object.keys({a:'b',c:'d'})) })`,
  {},
  {
    a: {
      type: "enum",
      children: [{ key: "a", value: "a" }, { key: "c", value: "c" }]
    }
  }
);

test(
  "oneOf Object.values",
  template,
  `({ a: oneOf(Object.values({a:'b',c:'d'})) })`,
  {},
  {
    a: {
      type: "enum",
      children: [{ key: "a", value: "b" }, { key: "c", value: "d" }]
    }
  }
);

test(
  "oneOf Object.keys with string keys",
  template,
  `({ a: oneOf(Object.keys({ "a/b": "c" })) })`,
  {},
  { a: { type: "enum", children: [{ key: "a/b", value: "a/b" }] } }
);

test(
  "Removes client-only props",
  template,
  `({ a: element, b: elementType, c: func, d: instanceOf(), e: node })`,
  {},
  {}
);

test(
  "Removes client-only props in arrayOf",
  template,
  `({ a: arrayOf(node), b: arrayOf(func) })`,
  {},
  {}
);

test(
  "Throws on unsupported Object method",
  throwsTemplate,
  '({ prop:oneOf(Object.entries({a:"b"})) })',
  `Invalid type for prop 'prop':
  Unsupported method 'Object.entries'.`
);

test("Doesn't throw on Object method call without children", t => {
  const ast = parse(`({ a: oneOf(Object.values()) })`);

  t.notThrows(() => {
    parsePropTypes(ast);
  });
});

test("Doesn't throw on object without entries", t => {
  const ast = parse(`({ a: oneOf(Object.values({})) })`);

  t.notThrows(() => {
    parsePropTypes(ast);
  });
});

test(
  "Invalid oneOf value",
  throwsTemplate,
  `({ a: oneOf([true, false]) })`,
  `Invalid type for prop 'a':
  Unexpected BooleanLiteral in array.`
);

test(
  "shape",
  template,
  `({ a: shape({ b: shape({ c: string })}) })`,
  {},
  {
    a: {
      type: "object",
      children: { b: { type: "object", children: { c: { type: "string" } } } }
    }
  }
);

test(
  'Converts "exact" to "object"',
  template,
  `({
    a: exact({ b: exact({ c: string })}),
    b: arrayOf(exact({ b: string }))
  })`,
  {},
  {
    a: {
      type: "object",
      children: { b: { type: "object", children: { c: { type: "string" } } } }
    },
    b: {
      type: "list",
      elementType: { type: "object", children: { b: { type: "string" } } }
    }
  }
);

test(
  "shape with component reference",
  template,
  `({ a: shape(OtherComponent.propTypes) })`,
  {},
  {
    a: {
      type: "ref",
      ref: "OtherComponent"
    }
  }
);

test(
  "Exact with component reference",
  template,
  `({ a: exact(OtherComponent.propTypes) })`,
  {},
  {
    a: {
      type: "ref",
      ref: "OtherComponent"
    }
  }
);

test(
  "arrayOf string",
  template,
  `({ a: arrayOf(string) })`,
  {},
  {
    a: {
      type: "list",
      elementType: { type: "string" }
    }
  }
);

test(
  "arrayOf shape",
  template,
  `({ a: arrayOf(shape({ b: string })) })`,
  {},
  {
    a: {
      type: "list",
      elementType: { type: "object", children: { b: { type: "string" } } }
    }
  }
);

test(
  "Invalid function call",
  throwsTemplate,
  "({ a: someFunc() })",
  `Invalid type for prop 'a':
  Invalid function call 'someFunc'`
);

test(
  "Replaces nested meta types",
  template,
  `({ a: shape({ b: object }) })`,
  { a: { type: "object", children: { b: { type: "ref", ref: "Link" } } } },
  { a: { type: "object", children: { b: { type: "ref", ref: "Link" } } } }
);

test(
  "Array meta",
  template,
  `({ a: array })`,
  { a: { type: "list", children: { type: "ref", ref: "Link" } } },
  { a: { type: "list", children: { type: "ref", ref: "Link" } } }
);

test(
  "Meta is merged with propType",
  template,
  `({ a: arrayOf(shape({ b: number, c: string })) })`,
  {
    a: {
      type: "list",
      elementType: {
        type: "object",
        children: { b: { type: "float" } }
      }
    }
  },
  {
    a: {
      type: "list",
      elementType: {
        type: "object",
        children: { b: { type: "float" }, c: { type: "string" } }
      }
    }
  }
);

test(
  "Removes ignored props",
  template,
  `({ a: oneOfType([string, number]), b: array })`,
  { a: { type: "ignore" }, b: { type: "ignore" } },
  {}
);

test(
  "Removes nested ignored props",
  template,
  `({ a: shape({ b: object }) })`,
  { a: { type: "object", children: { b: { type: "ignore" } } } },
  { a: { type: "object", children: {} } }
);

test("Invalid function call with ignore", t => {
  const ast = parse(`({ a: someFunc() })`);
  const meta = { a: { type: "ignore" } };

  t.notThrows(() => {
    parsePropTypes(ast, meta);
  });
});

test("Invalid function call and object method with ignore", t => {
  const ast = parse(`({ a: someFunc(Object.entries({a:1})) })`);
  const meta = { a: { type: "ignore" } };

  t.notThrows(() => {
    parsePropTypes(ast, meta);
  });
});

test("Allowed function calls", t => {
  const ast = parse(`({
    a: arrayOf(),
    b: oneOf(),
    c: shape(),
    d: instanceOf()
  })`);

  t.notThrows(() => {
    parsePropTypes(ast);
  });
});

// To make sure no shenanigans happen when props are called 'type'
test(
  'Prop named "type"',
  template,
  `({ type: shape({ b: string }) })`,
  {},
  {
    type: { type: "object", children: { b: { type: "string" } } }
  }
);

test(
  "Applies meta types",
  template,
  `({ a: number, b: number })`,
  { a: { type: "int" }, b: { type: "float" } },
  { a: { type: "int" }, b: { type: "float" } }
);

test(
  "Throws on array",
  throwsTemplate,
  `({ a: array })`,
  `Invalid type for prop 'a':
  Type 'array' is not supported.`
);

test(
  "Throws on object",
  throwsTemplate,
  `({ a: object })`,
  `Invalid type for prop 'a':
  Type 'object' is not supported.`
);

test(
  "Throws on oneOfType",
  throwsTemplate,
  `({ a: oneOfType() })`,
  `Invalid type for prop 'a':
Invalid function call 'oneOfType'`
);

test(
  "Throws on object in arrayOf",
  throwsTemplate,
  `({ a: arrayOf(object) })`,
  `Invalid type for prop 'a':
Type 'object' is not supported.`
);

test(
  "Throws on dynamic object keys in oneOf",
  throwsTemplate,
  `({ a: oneOf(Object.keys({ [something]: "a" })) })`,
  `Invalid type for prop 'a':
Computed object keys are not supported.`
);

test(
  'Replaces "number" with "int" by default',
  template,
  `({
    a: number,
    b: shape({ c: number }),
    d: arrayOf(arrayOf(number))
  })`,
  {},
  {
    a: { type: "int" },
    b: { type: "object", children: { c: { type: "int" } } },
    d: {
      type: "list",
      elementType: { type: "list", elementType: { type: "int" } }
    }
  }
);

test(
  'Replaces "number" with "int" by default with isRequired',
  template,
  `({ a: number.isRequired })`,
  {},
  { a: { type: "int", required: true } }
);
