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
package Component

open class Component(
  val text: String,
  val numbers: Array<Array<Array<Int>>>? = null,
  val singleObject: Component_SingleObject? = null,
  val objects: Array<Component_Objects>
)

class Component_SingleObject(
  val propertyA: Component_SingleObject_PropertyA
)

class Component_SingleObject_PropertyA(
  val propertyB: String? = null
)

class Component_Objects(
  val propertyB: String? = null
)`;

const template = (
  t,
  input,
  expected,
  options,
  className = "Component",
  removeIndentation
) => {
  t.is(
    normalize(expected, removeIndentation),
    normalize(stringify(input, className, options), removeIndentation)
  );
};

test("Basic propTypes", template, basicDefinition, basicClass);

test(
  "objectOf",
  template,
  {
    a: { type: "dictionary", valueType: { type: "string" } },
    b: { type: "dictionary", valueType: { type: "ref", ref: "Link" } },
    c: {
      type: "dictionary",
      valueType: { type: "object", children: { d: { type: "string" } } }
    }
  },
  `package Component

  import Link.*

  open class Component(
    val a: Map<String, String>? = null,
    val b: Map<String, Link>? = null,
    val c: Map<String, Component_C>? = null
  )
  class Component_C(
    val d: String? = null
  )`
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
  `package Component

  open class Component(
    val a: Component_A? = null,
    val b: Component_B? = null
  )

  enum class Component_A(val stringValue: String) {
    value1("value-1"),
    value2("-value-2"),
    value3(".value-3"),
    value4("#value-4");

    override fun toString(): String {
      return stringValue;
    }
  }

  enum class Component_B(val stringValue: String) {
    value1("A"),
    value2("B"),
    value3("C"),
    value4("D");

    override fun toString(): String {
      return stringValue;
    }
  }`
);

test(
  "Namespace",
  template,
  { a: { type: "string" } },
  `package ViewModels.Component
  open class Component(
    val a: String? = null
  )`,
  { namespace: "ViewModels" }
);

test(
  "Extending other component",
  template,
  {},
  `package Component
  import OtherComponent.*
  typealias Component = OtherComponent`,
  { baseClass: "OtherComponent" }
);

test(
  "Extending other component with namespace",
  template,
  {},
  `package ViewModels.Component
  import ViewModels.OtherComponent.*
  typealias Component = OtherComponent`,
  { baseClass: "OtherComponent", namespace: "ViewModels" }
);

test(
  "With baseClass and namespace",
  template,
  { a: { type: "ref", ref: "Link" } },
  `package ViewModels.Component

  import ViewModels.BaseClass.*
  import ViewModels.Link.*

  open class Component(
    val a: Link? = null
  ) : BaseClass()`,
  {
    baseClass: "BaseClass",
    namespace: "ViewModels"
  }
);
