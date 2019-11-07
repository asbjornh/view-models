import flattenDefinitions from "../utils/flatten-definitions";
import generateDefinition from "./generate-definition";
import indentBraces from "../utils/indent-braces";
import validateNames from "./validate-names";
import { TypeTree } from "../../node-types";
import { GeneratorOptions } from "../../compiler-types";

const imports = [
  "System.Collections.Generic",
  "System.ComponentModel.DataAnnotations",
  "System.Runtime.Serialization"
];

export default function generateCsharp(
  types: TypeTree,
  typeName: string,
  { baseClass, indent = 2, namespace }: GeneratorOptions = {}
) {
  validateNames(typeName, types);

  const classesString = flattenDefinitions(types, typeName)
    .map(({ name, properties }) =>
      generateDefinition(name, properties, baseClass)
    )
    .join("\n\n");

  const classesWithNamespace = namespace
    ? `namespace ${namespace}\n{\n${classesString}\n}`
    : classesString;
  const importsString = imports.map(i => `using ${i};`).join("\n");

  const fileContent = `${importsString}\n\n${classesWithNamespace}\n`;

  return indentBraces(fileContent, indent);
}
