import { getInnerNode } from "./list";
import { TypeNode, TypeTree } from "../../node-types";

export default function getReferences(obj: TypeTree) {
  return Object.entries(obj).reduce(
    (accum: string[], [_key, value]) => accum.concat(getReference(value)),
    []
  );
}

function getReference(node: TypeNode): string[] {
  if (node.type === "ref") return [node.ref];
  if (node.type === "object") return getReferences(node.children);
  if (node.type === "list") return getReference(getInnerNode(node));
  if (node.type === "dictionary") return getReference(node.valueType);
  return [];
}
