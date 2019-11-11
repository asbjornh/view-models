const t = require("@babel/types");

const getMeta = node => {
  if (!node) return {};
  // Manual type check for string because ESTree has no concept of StringLiteral:
  if (t.isLiteral(node) && typeof node.value === "string") return node;
  if (!node.properties) return {};

  return node.properties.reduce(
    (accum, property) => ({ ...accum, [property.key.name]: property.value }),
    {}
  );
};

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
          metaTypes = getMeta(node.value);
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
          metaTypes = getMeta(node.right);
        }
      }
    },
    visitor(getState)
  );
};
