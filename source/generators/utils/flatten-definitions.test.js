const test = require("ava");

const flattenDefinitions = require("./flatten-definitions").default;

const template = (t, input, expected) => {
  const definitions = flattenDefinitions(input, "Component");

  t.deepEqual(expected, definitions);
};

test("Empty object", template, {}, [
  {
    name: "Component",
    properties: { type: "object", children: {} }
  }
]);

test(
  "Object simple",
  template,
  { a: { type: "object", children: { b: { type: "string" } } } },
  [
    {
      name: "Component",
      properties: {
        type: "object",
        children: { a: { type: "ref", ref: "a", parents: ["Component"] } }
      }
    },
    {
      name: "a",
      properties: {
        type: "object",
        parents: ["Component"],
        children: { b: { type: "string" } }
      }
    }
  ]
);

test(
  "Object nested",
  template,
  {
    a: {
      type: "object",
      children: { b: { type: "object", children: { c: { type: "string" } } } }
    }
  },
  [
    {
      name: "Component",
      properties: {
        type: "object",
        children: { a: { type: "ref", ref: "a", parents: ["Component"] } }
      }
    },
    {
      name: "a",
      properties: {
        type: "object",
        parents: ["Component"],
        children: {
          b: { type: "ref", ref: "b", parents: ["Component", "a"] }
        }
      }
    },
    {
      name: "b",
      properties: {
        type: "object",
        parents: ["Component", "a"],
        children: { c: { type: "string" } }
      }
    }
  ]
);

test(
  "Array simple",
  template,
  { a: { type: "list", elementType: { type: "string" } } },
  [
    {
      name: "Component",
      properties: {
        type: "object",
        children: { a: { type: "list", elementType: { type: "string" } } }
      }
    }
  ]
);

test(
  "Array nested",
  template,
  {
    a: {
      type: "list",
      elementType: {
        type: "list",
        elementType: { type: "list", elementType: { type: "string" } }
      }
    }
  },
  [
    {
      name: "Component",
      properties: {
        type: "object",
        children: {
          a: {
            type: "list",
            elementType: {
              type: "list",
              elementType: { type: "list", elementType: { type: "string" } }
            }
          }
        }
      }
    }
  ]
);

test(
  "Array of object",
  template,
  {
    a: {
      type: "list",
      elementType: { type: "object", children: { b: { type: "string" } } }
    }
  },
  [
    {
      name: "Component",
      properties: {
        type: "object",
        children: {
          a: {
            type: "list",
            elementType: {
              type: "ref",
              ref: "a",
              parents: ["Component"]
            }
          }
        }
      }
    },
    {
      name: "a",
      properties: {
        type: "object",
        parents: ["Component"],
        children: { b: { type: "string" } }
      }
    }
  ]
);

test(
  "Array with nested objects and enum",
  template,
  {
    a: {
      type: "list",
      elementType: {
        type: "object",
        children: {
          b: { type: "object", children: { c: { type: "string" } } },
          d: { type: "enum", children: ["a", "b"] }
        }
      }
    }
  },
  [
    {
      name: "Component",
      properties: {
        type: "object",
        children: {
          a: {
            type: "list",
            elementType: {
              type: "ref",
              ref: "a",
              parents: ["Component"]
            }
          }
        }
      }
    },
    {
      name: "a",
      properties: {
        type: "object",
        parents: ["Component"],
        children: {
          b: { type: "ref", ref: "b", parents: ["Component", "a"] },
          d: { type: "ref", ref: "d", parents: ["Component", "a"] }
        }
      }
    },
    {
      name: "b",
      properties: {
        type: "object",
        parents: ["Component", "a"],
        children: { c: { type: "string" } }
      }
    },
    {
      name: "d",
      properties: {
        type: "enum",
        parents: ["Component", "a"],
        children: ["a", "b"]
      }
    }
  ]
);

test(
  "Object required",
  template,
  {
    a: {
      type: "object",
      required: true,
      children: { b: { type: "string" } }
    }
  },
  [
    {
      name: "Component",
      properties: {
        type: "object",
        children: {
          a: { type: "ref", ref: "a", parents: ["Component"], required: true }
        }
      }
    },
    {
      name: "a",
      properties: {
        type: "object",
        required: true,
        parents: ["Component"],
        children: { b: { type: "string" } }
      }
    }
  ]
);

test(
  "Array of object required",
  template,
  {
    a: {
      type: "list",
      required: true,
      elementType: {
        type: "object",
        children: { b: { type: "string" } }
      }
    }
  },
  [
    {
      name: "Component",
      properties: {
        type: "object",
        children: {
          a: {
            type: "list",
            required: true,
            elementType: {
              type: "ref",
              ref: "a",
              parents: ["Component"]
            }
          }
        }
      }
    },
    {
      name: "a",
      properties: {
        type: "object",
        parents: ["Component"],
        children: {
          b: { type: "string" }
        }
      }
    }
  ]
);

test(
  "Enum numbers",
  template,
  {
    a: { type: "enum", children: [1, 2, 3] }
  },
  [
    {
      name: "Component",
      properties: {
        type: "object",
        children: {
          a: { type: "ref", ref: "a", parents: ["Component"] }
        }
      }
    },
    {
      name: "a",
      properties: {
        type: "enum",
        parents: ["Component"],
        children: [1, 2, 3]
      }
    }
  ]
);

test(
  "Enum strings",
  template,
  {
    a: { type: "enum", children: ["value-1", "value-2"] }
  },
  [
    {
      name: "Component",
      properties: {
        type: "object",
        children: {
          a: { type: "ref", ref: "a", parents: ["Component"] }
        }
      }
    },
    {
      name: "a",
      properties: {
        type: "enum",
        parents: ["Component"],
        children: ["value-1", "value-2"]
      }
    }
  ]
);

test(
  "Array of enum",
  template,
  {
    a: {
      type: "list",
      elementType: { type: "enum", children: [1, 2] }
    }
  },
  [
    {
      name: "Component",
      properties: {
        type: "object",
        children: {
          a: {
            type: "list",
            elementType: { type: "ref", ref: "a", parents: ["Component"] }
          }
        }
      }
    },
    {
      name: "a",
      properties: {
        type: "enum",
        parents: ["Component"],
        children: [1, 2]
      }
    }
  ]
);

// To make sure no shenanigans happen when props are called 'type'
test(
  'Prop named "type"',
  template,
  {
    type: { type: "type" }
  },
  [
    {
      name: "Component",
      properties: {
        type: "object",
        children: { type: { type: "type" } }
      }
    }
  ]
);
