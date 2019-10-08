export const typeNames = {
  bool: "bool",
  double: "double",
  "double?": "double?",
  float: "float",
  "float?": "float?",
  int: "int",
  "int?": "int?",
  string: "string"
};

export type TypeName = keyof typeof typeNames;

export type NodeBase<Name, Tree> =
  | { type: Name }
  | { type: "ref"; ref: string }
  | { type: "enum"; enumChildren: (string | number)[] }
  | { type: "list"; elementType: NodeBase<Name, Tree> }
  | { type: "object"; children: Tree }
  | { type: "dictionary"; valueType: NodeBase<Name, Tree> };

export type TypeNode = { required: boolean } & NodeBase<TypeName, TypeTree>;

export type TypeTree = {
  [key: string]: TypeNode;
};

export const metaTypeNames = { ...typeNames, exclude: "exclude" };

export type MetaTypeName = keyof typeof metaTypeNames;

export type MetaTypeNode = NodeBase<MetaTypeName, MetaTypeTree>;

export type MetaTypeTree = {
  [key: string]: MetaTypeNode;
};
