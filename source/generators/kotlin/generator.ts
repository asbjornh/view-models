import {
  EnumDefinition,
  ClassDefinition,
  FlatNode
} from "../utils/flatten-definitions";

import capitalize from "../utils/capitalize";

import enumProperties from "./enum-properties";
import parentPrefixedName from "../utils/parent-prefixed-name";

export function generateDefinition(
  name: string,
  types: EnumDefinition | ClassDefinition,
  superClass?: string
) {
  return types.type === "object"
    ? generateClass(name, types, superClass)
    : generateEnum(name, types);
}

export const generateTypeAlias = (name: string, type: string) =>
  `typealias ${name} = ${type}`;

const generateClass = (
  name: string,
  node: ClassDefinition,
  superClass?: string
) => {
  const { children } = node;
  const properties = Object.entries(children)
    .map(([name, type]) => generateProperty(name, type))
    .join(",\n");
  const body = properties.length ? `${properties}\n` : "";
  const className = node.parents
    ? parentPrefixedName(name, node.parents)
    : capitalize(name);

  // NOTE: If the class doesn't have parents, it is the main component class, and should extend the superClass if any.
  const isComponentClass = !node.parents;
  const classExtends =
    isComponentClass && superClass && superClass !== className
      ? ` : ${superClass}()`
      : "";
  return `${
    isComponentClass ? "open " : ""
  }class ${className}(\n${body})${classExtends}`;
};

const generateEnum = (name: string, node: EnumDefinition) => {
  const body = enumProperties(node);
  const enumName = parentPrefixedName(name, node.parents);
  const override =
    "\noverride fun toString(): String {\nreturn stringValue;\n}";
  return `enum class ${enumName}(val stringValue: String) {\n${body}${override}\n}`;
};

const generateType = (node: FlatNode): string => {
  if (
    node.type === "bool" ||
    node.type === "double" ||
    node.type === "double?" ||
    node.type === "float" ||
    node.type === "float?" ||
    node.type === "int" ||
    node.type === "int?" ||
    node.type === "string"
  ) {
    return capitalize(node.type);
  } else if (node.type === "any") {
    return "dynamic";
  } else if (node.type === "ref") {
    return node.parents ? parentPrefixedName(node.ref, node.parents) : node.ref;
  } else if (node.type === "list") {
    return `Array<${generateType(node.elementType)}>`;
  } else if (node.type === "dictionary") {
    return `Map<String, ${generateType(node.valueType)}>`;
  }
  throw new Error(`Type '${node.type}' is not supported in generator`);
};

const generateProperty = (name: string, node: FlatNode) =>
  `val ${name}: ${generateType(node)}${!node.required ? "? = null" : ""}`;
