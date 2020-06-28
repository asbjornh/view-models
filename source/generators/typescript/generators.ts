import { TypeNode, TypeTree } from "../../node-types";

export default function generateInterface(
  name: string,
  types: TypeTree,
  supertype?: string
) {
  // NOTE: Convert TypeTree to TypeNode in order to reuse 'generateType'
  const typesObjectNode: TypeNode = { type: "object", children: types };
  const body = generateType(typesObjectNode);
  const extendsString = supertype ? ` extends ${supertype}` : "";

  return `export interface ${name}${extendsString} ${body}`;
}

const generateType = (node: TypeNode): string => {
  if (
    node.type === "double" ||
    node.type === "double?" ||
    node.type === "float" ||
    node.type === "float?" ||
    node.type === "int" ||
    node.type === "int?"
  ) {
    return "number";
  } else if (node.type === "any") {
    return "any";
  } else if (node.type === "bool") {
    return "boolean";
  } else if (node.type === "string") {
    return "string";
  } else if (node.type === "ref") {
    return node.ref;
  } else if (node.type === "list") {
    const elementType = generateType(node.elementType);
    return node.elementType.type === "enum"
      ? `(${elementType})[]`
      : `${elementType}[]`;
  } else if (node.type === "enum") {
    return node.children.map(({ value }) => JSON.stringify(value)).join(" | ");
  } else if (node.type === "dictionary") {
    const type = generateType(node.valueType);
    const key = "[key: string]";
    return type.includes("\n")
      ? `{\n${key}: ${type}\n}`
      : `{ ${key}: ${type} }`;
  } else if (node.type === "object") {
    const { children } = node;
    const properties = Object.entries(children)
      .map(([name, node]) => {
        const type = generateType(node);
        return `${name}${node.required ? "" : "?"}: ${type}`;
      })
      .join(",\n");
    const body = properties.length ? `${properties}\n` : "";

    return `{\n${body}}`;
  }
  throw new Error(`Type '${node.type}' is not supported in generator`);
};
