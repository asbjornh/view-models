const test = require("ava");
const types = require("@babel/types");

const getDefinitionName = require("./get-definition-name").default;

test("Identifier", t => {
  const name = getDefinitionName(types.identifier("a"));
  t.is("a", name);
});

test("TSQualifiedName", t => {
  const node = types.tsQualifiedName(
    types.identifier("a"),
    types.identifier("b")
  );
  t.is("a.b", getDefinitionName(node));
});

test("TSQualifiedName nested", t => {
  const node = types.tsQualifiedName(
    types.tsQualifiedName(types.identifier("a"), types.identifier("b")),
    types.identifier("c")
  );
  t.is("a.b.c", getDefinitionName(node));
});
