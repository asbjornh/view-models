const t = require("@babel/types");

const matchesFile = require("../../utils/matches-file");
const viewModelsVisitor = require("../../utils/view-models-visitor");
const {
  getInnerPropType,
  getReferenceName,
  isObjectType
} = require("../../utils/ast-utils");

const compareNames = require("./compare-names");

module.exports = {
  create: function(context) {
    const [options = {}] = context.options;
    const filePath = context.getFilename();

    if (!matchesFile(filePath, options.include)) return {};

    let importPathEntries = [];
    let importNodeEntries = [];

    return viewModelsVisitor(getState => ({
      ImportDeclaration: node => {
        const source = node.source;
        node.specifiers.forEach(node => {
          if (!t.isImportDefaultSpecifier(node)) return;
          importPathEntries.push([node.local.name, source.value]);
          importNodeEntries.push([node.local.name, source]);
        });
      },
      CallExpression: node => {
        if (
          t.isIdentifier(node.callee, { name: "require" }) &&
          t.isLiteral(node.arguments[0]) &&
          t.isVariableDeclarator(node.parent)
        ) {
          const [arg] = node.arguments;
          importPathEntries.push([node.parent.id.name, arg.value]);
          importNodeEntries.push([node.parent.id.name, arg]);
        }
      },
      "Program:exit": bodyNode => {
        const importPaths = importPathEntries.reduce(
          (accum, [key, value]) => Object.assign(accum, { [key]: value }),
          {}
        );
        const importNodes = importNodeEntries.reduce(
          (accum, [key, value]) => Object.assign(accum, { [key]: value }),
          {}
        );

        const { exportDeclarations, propTypes } = getState();

        // NOTE: Check component name
        if (exportDeclarations.length === 1) {
          const [declaration] = exportDeclarations;

          compareNames(
            context,
            filePath,
            bodyNode,
            declaration.name,
            declaration
          );
        }

        if (!t.isObjectExpression(propTypes)) return;

        // NOTE: Check names of referenced imports
        propTypes.properties.forEach(node => {
          const type = getInnerPropType(node.value);

          if (!t.isCallExpression(type)) return;
          if (!t.isMemberExpression(type.callee)) return;
          if (!isObjectType(type.callee)) return;

          const refName = getReferenceName(type.arguments[0]);
          if (!refName || !importPaths[refName]) return;

          compareNames(
            context,
            importPaths[refName],
            importNodes[refName],
            refName,
            type.arguments[0]
          );
        });
      }
    }));
  }
};
