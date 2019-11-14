const t = require("@babel/types");

// This function decorates a visitor object with functions that extract the propTypes, meta types and file exports.
module.exports = function viewModelsVisitor(visitor) {
  let componentName;
  let componentFn;
  let exportDeclarations = [];
  let metaTypes = {};
  let propTypes;

  const getState = () => ({
    componentName,
    componentFn,
    exportDeclarations,
    metaTypes,
    propTypes
  });

  return Object.assign(
    {},
    {
      Program: node => {
        node.body.forEach(node => {
          if (
            t.isExpressionStatement(node) &&
            t.isAssignmentExpression(node.expression) &&
            t.isMemberExpression(node.expression.left)
          ) {
            const { left, right } = node.expression;
            if (
              left.property.name === "propTypes" &&
              t.isObjectExpression(right)
            ) {
              propTypes = right;
              componentName = left.object.name;
            }

            if (left.property.name === "viewModelMeta") {
              metaTypes = right;
            }
          }

          if (t.isExportDefaultDeclaration(node)) {
            exportDeclarations = exportDeclarations.concat(node.declaration);
          }

          if (t.isExportNamedDeclaration(node)) {
            if (t.isVariableDeclaration(node.declaration)) {
              // export const A = ...
              exportDeclarations = exportDeclarations.concat(
                node.declaration.declarations.map(d => d.id)
              );
            }
            // export { A };
            exportDeclarations = exportDeclarations.concat(
              node.specifiers.map(s => s.exported)
            );
          }

          if (t.isClassDeclaration(node)) {
            node.body.body.forEach(node => {
              if (
                t.isIdentifier(node.key, { name: "propTypes" }) &&
                t.isObjectExpression(node.value)
              ) {
                propTypes = node.value;
              }

              if (t.isIdentifier(node.key, { name: "viewModelMeta" })) {
                metaTypes = node.value;
              }
            });
          }
        });
      },
      ArrowFunctionExpression: node => {
        if (
          t.isVariableDeclarator(node.parent) &&
          t.isIdentifier(node.parent.id, { name: componentName })
        ) {
          componentFn = node;
        }
      }
    },
    visitor(getState)
  );
};
