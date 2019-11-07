import generateInterface from "./generators";
import getReferences from "../utils/get-references";
import indentBraces from "../utils/indent-braces";
import { TypeTree } from "../../node-types";
import { GeneratorOptions } from "../../compiler-types";

export default function typescript(
  types: TypeTree,
  typeName: string,
  { supertype, indent = 2, namespace }: GeneratorOptions = {}
) {
  const typeString = generateInterface(typeName, types, supertype);

  const typesWithNamespace = namespace
    ? `namespace ${namespace} {\n${typeString}\n}`
    : typeString;
  const componentImports = getReferences(types);
  const importsString = [...(supertype ? [supertype] : []), ...componentImports]
    .map(i => `import { ${i} } from "./${i}";`)
    .join("\n");

  const fileContent = `${importsString}\n\n${typesWithNamespace}\n`;

  return indentBraces(fileContent, indent);
}
