import dotNotation from "../utils/dot-notation";
import flattenDefinitions from "../utils/flatten-definitions";
import { generateDefinition, generateTypeAlias } from "./generator";
import generateImports from "./generate-imports";
import { TypeTree } from "../../node-types";
import { GeneratorOptions } from "../../compiler-types";
import indentBraces from "../utils/indent-braces";

export default function kotlin(
  types: TypeTree,
  typeName: string,
  { supertype, indent = 2, namespace }: GeneratorOptions = {}
) {
  const classesString =
    supertype && Object.keys(types).length === 0
      ? generateTypeAlias(typeName, supertype)
      : flattenDefinitions(types, typeName)
          .map(({ name, properties }) =>
            generateDefinition(name, properties, supertype)
          )
          .join("\n\n");

  const componentImports =
    typeof types === "string" ? [] : generateImports(types, namespace);
  const superClassImport = supertype
    ? [dotNotation(namespace, supertype, "*")]
    : [];
  const imports = [...superClassImport, ...componentImports]
    .map(i => `import ${i}`)
    .join("\n");
  const importsString = imports.length > 0 ? `${imports}\n\n` : "";

  const packageString = `package ${dotNotation(namespace, typeName)}`;

  const fileContent = `${packageString}\n\n${importsString}${classesString}\n`;

  return indentBraces(fileContent, indent, ["{", "("], ["}", ")"]);
}
