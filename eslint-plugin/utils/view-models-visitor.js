const t = require("@babel/types");

// This function decorates a visitor object with functions that extract the propTypes, meta types and file exports.
module.exports = function viewModelsVisitor(visitor) {
  let exportDeclarations = [];
  let metaTypes = {};
  let propTypes;

  const getState = () => ({
    exportDeclarations,
    metaTypes,
    propTypes
  });

  return Object.assign(
    {},
    {
      ExportDefaultDeclaration: node => {
        exportDeclarations = exportDeclarations.concat(node.declaration);
      },
      ExportNamedDeclaration: node => {
        exportDeclarations = exportDeclarations.concat(
          node.specifiers.map(s => s.exported)
        );
      },
      ClassProperty: node => {
        if (
          t.isIdentifier(node.key, { name: "propTypes" }) &&
          t.isObjectExpression(node.value)
        ) {
          propTypes = node.value;
        }

        if (t.isIdentifier(node.key, { name: "viewModelMeta" })) {
          metaTypes = node.value;
        }
      },
      AssignmentExpression: node => {
        if (
          t.isMemberExpression(node.left) &&
          node.left.property.name === "propTypes" &&
          t.isObjectExpression(node.right)
        ) {
          propTypes = node.right;
        }

        if (
          t.isMemberExpression(node.left) &&
          node.left.property.name === "viewModelMeta"
        ) {
          metaTypes = node.right;
        }
      }
    },
    visitor(getState)
  );
};
