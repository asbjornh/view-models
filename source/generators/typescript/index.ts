import generateClass from "./generators";
import getReferences from "../utils/get-references";
import indentBraces from "../utils/indent-braces";
import { TypeTree } from "../../node-types";
import { GeneratorOptions } from "../../compiler-types";

export default function typescript(
  types: TypeTree,
  className: string,
  { baseClass, indent = 2, namespace }: GeneratorOptions = {}
) {
  const classString = generateClass(className, types, baseClass);

  const classesWithNamespace = namespace
    ? `namespace ${namespace} {\n${classString}\n}`
    : classString;
  const componentImports = getReferences(types);
  const importsString = [...(baseClass ? [baseClass] : []), ...componentImports]
    .map(i => `import { ${i} } from "./${i}";`)
    .join("\n");

  const fileContent = `${importsString}\n\n${classesWithNamespace}\n`;

  return indentBraces(fileContent, indent);
}
