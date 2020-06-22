import * as t from "@babel/types";

export default (node: t.ObjectProperty): string => {
  if (!t.isIdentifier(node.key))
    throw new Error(`Invalid key type '${node.key.type}'`);
  return node.key.name;
};
