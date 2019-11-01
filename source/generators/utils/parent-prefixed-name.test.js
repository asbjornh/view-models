const test = require("ava");

const parentPrefixedName = require("./parent-prefixed-name").default;

test("Prefixes name with parents", t => {
  const prefixedName = parentPrefixedName("C", ["Component", "a", "b"]);
  t.is("Component_A_B_C", prefixedName);
});
