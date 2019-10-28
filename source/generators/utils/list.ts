import { TypeNode, ListNode } from "../../lib/node-types";

const isList = (node: TypeNode): node is ListNode => node.type === "list";

export const listHasObject = (node: ListNode) =>
  ["object", "enum"].includes(getInnerNode(node).type);

// Returns the type of the innermost node that's not a 'list' node
export const getInnerNode = (node: ListNode): TypeNode =>
  node.elementType && isList(node.elementType)
    ? getInnerNode(node.elementType)
    : node.elementType;
