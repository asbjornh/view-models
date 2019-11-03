import dotNotation from "../utils/dot-notation";
import flattenDefinitions from "../utils/flatten-definitions";
import { generateDefinition, generateTypeAlias } from "./generator";
import generateImports from "./generate-imports";
import { TypeTree } from "../../node-types";
import { GeneratorOptions } from "../../compiler-types";
import indentBraces from "../utils/indent-braces";

export default function kotlin(
  types: TypeTree,
  className: string,
  { baseClass, indent = 2, namespace }: GeneratorOptions = {}
) {
  const classesString =
    baseClass && Object.keys(types).length === 0
      ? generateTypeAlias(className, baseClass)
      : flattenDefinitions(types, className)
          .map(({ name, properties }) =>
            generateDefinition(name, properties, baseClass)
          )
          .join("\n\n");

  const componentImports =
    typeof types === "string" ? [] : generateImports(types, namespace);
  const baseClassImport = baseClass
    ? [dotNotation(namespace, baseClass, "*")]
    : [];
  const imports = [...baseClassImport, ...componentImports]
    .map(i => `import ${i}`)
    .join("\n");
  const importsString = imports.length > 0 ? `${imports}\n\n` : "";

  const packageString = `package ${dotNotation(namespace, className)}`;

  const fileContent = `${packageString}\n\n${importsString}${classesString}\n`;

  return indentBraces(fileContent, indent, ["{", "("], ["}", ")"]);
}
