import { getInnerNode, listHasObject } from "./list";
import {
  TypeTree,
  TypeNode,
  PrimitiveNode,
  RefNode,
  EnumNode,
  NodeBase
} from "../../lib/node-types";

export type ClassDefinition = {
  type: "object";
  parents?: string[];
  children: FlatTree;
};

export type EnumDefinition = FlatNodeBase & { parents: string[] } & EnumNode;

export type FlatDefinition = {
  name: string;
  properties: ClassDefinition | EnumDefinition;
};

type FlatNodeBase = { parents?: string[] };

type FlatPrimitiveNode = FlatNodeBase & PrimitiveNode;
type FlatRefNode = FlatNodeBase & RefNode;
type FlatListNode = NodeBase &
  FlatNodeBase & {
    type: "list";
    elementType: FlatNode;
  };
type FlatDictionaryNode = NodeBase &
  FlatNodeBase & {
    type: "dictionary";
    valueType: FlatNode;
  };

// NOTE: ObjectNode is left out since it's recursive. ListNodes are also recursive, but can be serialized to `IList<IList<type>>` so it's included.
export type FlatNode =
  | FlatPrimitiveNode
  | FlatRefNode
  | FlatListNode
  | FlatDictionaryNode;

export type FlatTree = { [key: string]: FlatNode };

// Returns an array of objects representing the classes to be generated
//  - Every value of type 'enum' and 'object' will get a class definition
//  - Values of type 'list' will get a class definition if 'children' is an 'object'
export default function flattenDefinitions(
  types: TypeTree,
  className: string
): FlatDefinition[] {
  const componentClass: FlatDefinition = {
    name: className,
    properties: {
      type: "object",
      children: flattenTree(types, [className])
    }
  };

  // Create new definitions for values of type 'object' and 'enum' or array of 'object'
  const childClasses = createShallowDefinitions(types, [className]);

  return [componentClass, ...childClasses];
}

// Returns an object where 'object' and 'enum' nodes are replaced by 'ref's.
// Nested 'list's are kept nested, but the innermost non-list will be flattened
// Before: { a: { type: 'object', children: { b: { type: 'string' } } } }
// After:  { a: { type: 'ref', ref: 'a', parents: ['Component'] } })
const flattenTree = (types: TypeTree, parents: string[]): FlatTree =>
  Object.entries(types).reduce(
    (accum, [name, type]) => ({
      ...accum,
      [name]: flattenNode(name, type, parents)
    }),
    {}
  );

// Creates a list of type definitions where every nested type (excpect for 'list') is replaced with 'ref's
function createShallowDefinitions(
  types: TypeTree,
  parents: string[]
): FlatDefinition[] {
  return Object.entries(types).reduce(
    (accum: FlatDefinition[], [name, type]) => {
      return [...accum, ...definitionsFromNode(name, type, parents)];
    },
    []
  );
}

const definitionsFromNode = (
  name: string,
  node: TypeNode,
  parents: string[]
): FlatDefinition[] => {
  if (node.type === "object") {
    const properties = {
      parents,
      ...node,
      children: flattenTree(node.children, parents.concat(name))
    };
    const childDefinitions = createShallowDefinitions(
      node.children,
      parents.concat(name)
    );
    return [{ name, properties }, ...childDefinitions];
  }

  if (node.type === "list" && listHasObject(node)) {
    return definitionsFromNode(name, getInnerNode(node), parents);
  }

  return node.type === "dictionary"
    ? definitionsFromNode(name, node.valueType, parents)
    : node.type === "enum"
    ? [{ name, properties: { parents, ...node } }]
    : [];
};

// Maps from TypeNode to FlatNode
const flattenNode = (
  name: string,
  node: TypeNode,
  parents: string[]
): FlatNode => {
  const required = node.required ? { required: node.required } : {};

  if (node.type === "object" || node.type === "enum") {
    return { type: "ref", ...required, parents, ref: name };
  }

  if (node.type === "dictionary") {
    return {
      ...node,
      ...required,
      valueType: flattenNode(name, node.valueType, parents)
    };
  }

  if (node.type === "list") {
    return {
      type: "list",
      ...required,
      elementType: flattenNode(name, node.elementType, parents)
    };
  }

  return node;
};
