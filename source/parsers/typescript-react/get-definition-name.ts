import * as t from "@babel/types";

export default function getDefinitionName(n: t.Node): string {
  if (t.isIdentifier(n)) return n.name;
  if (t.isTSQualifiedName(n))
    return `${getDefinitionName(n.left)}.${n.right.name}`;
  throw new Error(`Unexpected '${n.type}' in type annotation`);
}
