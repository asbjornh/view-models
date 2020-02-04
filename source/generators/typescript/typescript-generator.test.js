const test = require("ava");

const stringify = require("./index").default;
const normalize = require("../../../test-utils/normalize-string");

const basicDefinition = {
  text: { type: "string", required: true },
  numbers: {
    type: "list",
    elementType: {
      type: "list",
      elementType: { type: "list", elementType: { type: "int" } }
    }
  },
  singleObject: {
    type: "object",
    children: {
      propertyA: {
        type: "object",
        children: { propertyB: { type: "string" } },
        required: true
      }
    }
  },
  objects: {
    type: "list",
    required: true,
    elementType: {
      type: "object",
      children: { propertyB: { type: "string" } }
    }
  }
};

const basicClass = `
export interface Component {
  text: string,
  numbers?: number[][][],
  singleObject?: {
    propertyA: {
      propertyB?: string
    }
  },
  objects: {
    propertyB?: string
  }[]
}`;

const template = (
  t,
  input,
  expected,
  options,
  typeName = "Component",
  removeIndentation
) => {
  t.is(
    normalize(expected, removeIndentation),
    normalize(stringify(input, typeName, options), removeIndentation)
  );
};

test("Basic propTypes", template, basicDefinition, basicClass);

test(
  "Dictionary",
  template,
  {
    a: { type: "dictionary", valueType: { type: "string" } },
    b: { type: "dictionary", valueType: { type: "ref", ref: "Link" } },
    c: {
      type: "dictionary",
      valueType: { type: "object", children: { d: { type: "string" } } }
    }
  },
  `
  import { Link } from "./Link";

  export interface Component { 
    a?: { [key: string]: string },
    b?: { [key: string]: Link },
    c?: {
      [key: string]: {
        d?: string
      }
    }
  }`
);

test(
  "Enum",
  template,
  {
    a: {
      type: "enum",
      children: [
        { key: "value-1", value: "value-1" },
        { key: "-value-2", value: "-value-2" },
        { key: ".value-3", value: ".value-3" },
        { key: "#value-4", value: "#value-4" }
      ]
    },
    b: {
      type: "enum",
      children: [
        { key: "value-1", value: "A" },
        { key: "-value-2", value: "B" },
        { key: ".value-3", value: "C" },
        { key: "#value-4", value: "D" }
      ]
    }
  },
  `export interface Component { 
    a?: "value-1" | "-value-2" | ".value-3" | "#value-4",
    b?: "A" | "B" | "C" | "D"
  }`
);

test(
  "Namespace",
  template,
  { a: { type: "string" } },
  `namespace ViewModels {
    export interface Component { 
      a?: string
    }
  }`,
  { namespace: "ViewModels" }
);

test(
  "Extending other component",
  template,
  {},
  `import { OtherComponent } from "./OtherComponent";
  export interface Component extends OtherComponent {
  }`,
  { supertype: "OtherComponent" }
);

test(
  "With supertype and namespace",
  template,
  { a: { type: "ref", ref: "Link" } },
  `import { Supertype } from "./Supertype";
  import { Link } from "./Link";

  namespace ViewModels {
    export interface Component extends Supertype { 
      a?: Link
    }
  }`,
  {
    supertype: "Supertype",
    namespace: "ViewModels"
  }
);
