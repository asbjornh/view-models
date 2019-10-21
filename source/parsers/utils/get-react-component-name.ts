import * as t from "@babel/types";

import filter from "../../utils/filter";
import { throwIfNull } from "../../utils/error-handling";

// Gets component name from export declaration. Expects a File node
export default function(AST: t.File) {
  const exportDeclarations = filter(
    AST.program.body,
    t.isExportDeclaration
  ).filter(node => !isTypeScriptExport(node));

  const [defaultExport] = filter(
    exportDeclarations,
    t.isExportDefaultDeclaration
  );

  if (defaultExport) {
    return getNameFromDeclaration(defaultExport);
  }

  const namedExports = filter(exportDeclarations, t.isExportNamedDeclaration);

  const [namedExport] = namedExports;

  if (namedExports.length > 1) {
    throw multipleExportsError;
  } else if (!namedExport || !namedExport.specifiers) {
    throw missingNameError;
  }

  // An ExportDeclaration may have a 'declaration' property
  if (namedExport.declaration) {
    return getNameFromDeclaration(namedExport);
  }

  // It may also have a 'specifiers' property which holds a list of exports
  if (namedExport.specifiers.length > 1) {
    throw multipleExportsError;
  }

  const [specifier] = namedExport.specifiers;
  return specifier.exported.name;
}

const multipleExportsError = new Error(
  `Couldn't get component name because of multiple exports.`
);

const missingNameError = new Error(
  `Component name not found. Make sure that:
• your component is exported as an ES module
• the file has at most one named export or a default export`
);

const getNameFromDeclaration = (
  node: t.ExportNamedDeclaration | t.ExportDefaultDeclaration
) => {
  const { declaration } = node;
  const name = t.isIdentifier(declaration)
    ? declaration.name
    : t.isClassDeclaration(declaration) && declaration.id
    ? declaration.id.name
    : t.isVariableDeclaration(declaration)
    ? handleVarDeclaration(declaration)
    : undefined;
  return throwIfNull(name, missingNameError);
};

const handleVarDeclaration = (n: t.VariableDeclaration) => {
  if (n.declarations.length > 1) throw multipleExportsError;
  const { id } = n.declarations[0];
  if (t.isIdentifier(id)) return id.name;
};

const isTypeScriptExport = (node: t.ExportDeclaration) =>
  t.isExportNamedDeclaration(node) &&
  t.isTSInterfaceDeclaration(node.declaration) &&
  t.isTSTypeAliasDeclaration(node.declaration);
