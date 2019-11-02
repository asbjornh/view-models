import capitalize from "../utils/capitalize";
import enumProperties from "./enum-properties";
import parentPrefixedName from "../utils/parent-prefixed-name";

import {
  ClassDefinition,
  EnumDefinition,
  FlatNode
} from "../utils/flatten-definitions";

export function generateClass(
  name: string,
  types: ClassDefinition | EnumDefinition,
  baseClass?: string
) {
  return types.type === "object"
    ? generateObject(name, types, baseClass)
    : generateEnum(name, types);
}

export const generateClassExtends = (className: string, superClass: string) =>
  `public class ${className} : ${superClass}\n{\n}`;

const generate = (node: FlatNode): string => {
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
    return node.type;
  } else if (node.type === "ref") {
    return node.parents ? parentPrefixedName(node.ref, node.parents) : node.ref;
  } else if (node.type === "list") {
    return `IList<${generate(node.elementType)}>`;
  } else if (node.type === "dictionary") {
    return `IDictionary<string, ${generate(node.valueType)}>`;
  }
  throw new Error(`Type '${node.type}' is not supported in generator`);
};

const generateEnum = (name: string, node: EnumDefinition) => {
  const body = enumProperties(name, node);
  return `public enum ${parentPrefixedName(name, node.parents)}\n{\n${body}\n}`;
};

const generateObject = (
  name: string,
  node: ClassDefinition,
  baseClass?: string
) => {
  const { children } = node;
  const properties = Object.entries(children)
    .map(([name, type]) => generateProperty(name, type))
    .join("\n");
  const body = properties.length ? `${properties}\n` : "";
  const className = node.parents
    ? parentPrefixedName(name, node.parents)
    : capitalize(name);

  // NOTE: If the class doesn't have parents, it is the main component class, and should extend the baseClass if any.
  const isComponentClass = !node.parents;
  const classExtends =
    isComponentClass && baseClass && baseClass !== className
      ? ` : ${baseClass}`
      : "";
  return `public class ${className}${classExtends}\n{\n${body}}`;
};

const generateProperty = (name: string, node: FlatNode) =>
  `${node.required ? "[Required]\n" : ""}` +
  `public ${generate(node)} ${capitalize(name)} { get; set; }`;
