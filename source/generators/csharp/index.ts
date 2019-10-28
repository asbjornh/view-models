import flattenDefinitions from "../utils/flatten-definitions";
import { generateClass, generateClassExtends } from "./generator";
import indentBraces from "../utils/indent-braces";
import validateNames from "./validate-names";
import { TypeTree } from "../../lib/node-types";
import { GeneratorOptions } from "../../lib/compiler-types";

const imports = [
  "System.Collections.Generic",
  "System.ComponentModel.DataAnnotations",
  "System.Runtime.Serialization"
];

export default function generateCsharp(
  types: TypeTree,
  className: string,
  { baseClass, indent = 2, namespace }: GeneratorOptions = {}
) {
  validateNames(className, types);

  const classesString =
    Object.keys(types).length === 0
      ? generateClassExtends(className, types)
      : flattenDefinitions(types, className)
          .map(({ name, properties }) =>
            generateClass(name, properties, baseClass)
          )
          .join("\n\n");

  const classesWithNamespace = namespace
    ? `namespace ${namespace}\n{\n${classesString}\n}`
    : classesString;
  const importsString = imports.map(i => `using ${i};`).join("\n");

  const fileContent = `${importsString}\n\n${classesWithNamespace}\n`;

  return indentBraces(fileContent, indent);
}
