const test = require("ava");

const generate = require("./index").default;
const normalize = require("../../../test-utils/normalize-string");

const basicDefinition = {
  text: { type: "string", required: true },
  texts: {
    type: "list",
    elementType: {
      type: "list",
      elementType: { type: "list", elementType: { type: "string" } }
    }
  },
  singleObject: {
    type: "object",
    children: {
      propertyA: { type: "string", required: true }
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

const imports = `using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;\n`;

const basicClass = `
public class Component
{
  [Required]
  public string Text { get; set; }
  public IList<IList<IList<string>>> Texts { get; set; }
  public Component_SingleObject SingleObject { get; set; }
  [Required]
  public IList<Component_Objects> Objects { get; set; }
}
public class Component_SingleObject
{
  [Required]
  public string PropertyA { get; set; }
}
public class Component_Objects
{
  public string PropertyB { get; set; }
}
`;

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
    normalize(generate(input, typeName, options), removeIndentation)
  );
};

test("Basic types", template, basicDefinition, imports + basicClass);

test(
  "With namespace",
  template,
  basicDefinition,
  `${imports}\n` + `namespace Something.SomethingElse\n{\n${basicClass}\n}`,
  { namespace: "Something.SomethingElse" }
);

test(
  "With supertype",
  template,
  {},
  imports +
    `public class Component : BaseClass
  {
  }`,
  { supertype: "BaseClass", typeName: "Component" }
);

// Supertype should only be applied to the class if it doesn't have 'parents'
test(
  "Nested properties with supertype",
  template,
  {
    componentProperty: {
      type: "object",
      children: {}
    }
  },
  imports +
    `public class Component : BaseClass
    {
      public Component_ComponentProperty ComponentProperty { get; set; }
    }
    public class Component_ComponentProperty
    {
    }`,
  { supertype: "BaseClass", typeName: "Component" }
);

test(
  "With name collision between class name and supertype",
  template,
  {},
  imports +
    `public class Component
  {
  }`,
  { supertype: "Component" }
);

test(
  "With different indentation",
  template,
  { a: { type: "string" } },
  imports +
    `
public class Component
{
      public string A { get; set; }
}
  `,
  { indent: 6 },
  "Component",
  false
);

test(
  "Optional enum",
  template,
  {
    enum: {
      type: "enum",
      parents: ["Component"],
      children: [
        { key: "value-1", value: "value-1" },
        { key: "value-2", value: "value-2" }
      ]
    }
  },
  imports +
    `public class Component
    {
      public Component_Enum Enum { get; set; }
    }
    public enum Component_Enum
    {
      [EnumMember(Value = "")]
      None = 0,
      [EnumMember(Value = "value-1")]
      Value1 = 1,
      [EnumMember(Value = "value-2")]
      Value2 = 2,
    }`
);

test(
  "Required enum",
  template,
  {
    enum: {
      type: "enum",
      required: true,
      parents: ["Component"],
      children: [
        { key: "value-1", value: "value-1" },
        { key: "value-2", value: "value-2" }
      ]
    }
  },
  imports +
    `public class Component
      {
        [Required]
        public Component_Enum Enum { get; set; }
      }
      public enum Component_Enum
      {
        [EnumMember(Value = "value-1")]
        Value1 = 0,
        [EnumMember(Value = "value-2")]
        Value2 = 1,
      }
    `
);

test(
  "Enum with name starting with non-letter",
  template,
  {
    enum: {
      type: "enum",
      children: [
        { key: "-value-1", value: "-value-1" },
        { key: ".value-2", value: ".value-2" },
        { key: "#value-3", value: "#value-3" }
      ]
    }
  },
  imports +
    `public class Component
      {
        public Component_Enum Enum { get; set; }
      }
      public enum Component_Enum
      {
        [EnumMember(Value = "")]
        None = 0,
        [EnumMember(Value = "-value-1")]
        Value1 = 1,
        [EnumMember(Value = ".value-2")]
        Value2 = 2,
        [EnumMember(Value = "#value-3")]
        Value3 = 3,
      }
    `
);

test(
  "Enum from Object.values",
  template,
  {
    a: {
      type: "enum",
      children: [{ key: "a", value: "b" }]
    }
  },
  imports +
    `public class Component
    {
      public Component_A A { get; set; }
    }
    public enum Component_A
    {
      [EnumMember(Value = "")]
      None = 0,
      [EnumMember(Value = "b")]
      A = 1,
    }`
);

test(
  "Empty definition",
  template,
  {
    property: {
      type: "object",
      children: {}
    }
  },
  imports +
    `public class Component
    {
      public Component_Property Property { get; set; }
    }
    public class Component_Property
    {
    }`
);

test(
  "Component reference",
  template,
  {},
  imports +
    `
public class Component : AnotherComponent
{
}`,
  { supertype: "AnotherComponent" },
  "Component",
  false
);

// To make sure no shenanigans happen when props are called 'type'
test(
  'Prop named "type"',
  template,
  { type: { type: "string" } },
  imports +
    `
public class Component
{
  public string Type { get; set; }
}`
);
