import { throwError } from "./utils/error-handling";

export const typeNames = {
  any: "any",
  bool: "bool",
  double: "double",
  "double?": "double?",
  float: "float",
  "float?": "float?",
  int: "int",
  "int?": "int?",
  string: "string"
};

export const metaTypeNames = {
  ignore: "ignore",
  double: "double",
  "double?": "double?",
  float: "float",
  "float?": "float?",
  int: "int",
  "int?": "int?"
};

export type TypeName = keyof typeof typeNames;

export type NodeBase = { required?: boolean };
export type PrimitiveNode = NodeBase & { type: TypeName };
export type RefNode = NodeBase & { type: "ref"; ref: string };
export type EnumNode = NodeBase & {
  type: "enum";
  children: { key: string; value: string | number }[];
};

export type ListNode = NodeBase & { type: "list"; elementType: TypeNode };
export type ObjectNode = NodeBase & { type: "object"; children: TypeTree };
export type DictionaryNode = NodeBase & {
  type: "dictionary";
  valueType: TypeNode;
};

export type TypeNode =
  | PrimitiveNode
  | RefNode
  | EnumNode
  | ListNode
  | ObjectNode
  | DictionaryNode;

export type TypeTree = {
  [key: string]: TypeNode;
};

export type MetaTypeName = keyof typeof metaTypeNames;

export type BasicMetaNode = { type: MetaTypeName };
export type ListMetaNode = { type: "list"; elementType: MetaTypeNode };
export type ObjectMetaNode = { type: "object"; children: MetaTypeTree };

export type MetaTypeNode = BasicMetaNode | ListMetaNode | ObjectMetaNode;

export type MetaTypeTree = {
  [key: string]: MetaTypeNode;
};

export const isBasicType = (name: string): name is TypeName =>
  typeNames[name as TypeName] ? true : false;

export const validateType = (name: string): TypeName =>
  isBasicType(name) ? name : throwError(`Type '${name}' is not supported.`);

export const isTypeNode = (n?: TypeNode | MetaTypeNode): n is TypeNode =>
  !!n && n.type !== "ignore";

export const isBasicMetaType = (name: string): name is MetaTypeName =>
  metaTypeNames[name as MetaTypeName] ? true : false;

export const validateMetaType = (name: string): MetaTypeName =>
  isBasicMetaType(name)
    ? name
    : throwError(
        `Expected one of [${Object.keys(metaTypeNames)}] but got '${name}'.`
      );
