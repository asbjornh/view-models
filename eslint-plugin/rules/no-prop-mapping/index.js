const t = require("@babel/types");

const matchesFile = require("../../utils/matches-file");
const viewModelsVisitor = require("../../utils/view-models-visitor");
const {
  getInnerPropType,
  getReferenceName,
  isClassProp,
  isMemberExpression,
  isObjectType
} = require("../../utils/ast-utils");

const message = (propName, typeName) =>
  `'${propName}' is of type '${typeName}.propTypes' but has no corresponding spread element`;

module.exports = {
  create: function(context) {
    const [options = {}] = context.options;
    if (!matchesFile(context.getFilename(), options.include)) return {};

    // A list of props that have been spread
    let spreadProps = [];

    return viewModelsVisitor(getState => ({
      JSXSpreadAttribute: node => {
        const { componentFn } = getState();

        if (isClassProp(node.argument)) {
          spreadProps = spreadProps.concat(node);
          return;
        }

        if (
          componentFn &&
          t.isIdentifier(componentFn.params[0]) &&
          isMemberExpression(node.argument, componentFn.params[0].name)
        ) {
          spreadProps = spreadProps.concat(node);
        }

        context.getScope().references.forEach(ref => {
          if (ref.identifier.name !== node.argument.name) return;
          if (!ref.resolved) return;

          ref.resolved.defs.forEach(def => {
            if (def.node === componentFn) {
              spreadProps = spreadProps.concat(node);
            }
          });
        });
      },
      "Program:exit": () => {
        const { componentFn, propTypes } = getState();

        if (!t.isObjectExpression(propTypes)) return;

        propTypes.properties.forEach(node => {
          const type = getInnerPropType(node.value);
          const propName = node.key.name;

          if (!t.isCallExpression(type)) return;
          if (!t.isMemberExpression(type.callee)) return;
          if (!isObjectType(type.callee)) return;

          const refName = getReferenceName(type.arguments[0]);
          if (!refName) return;

          const spread = spreadProps.find(node => {
            if (isClassProp(node.argument, propName)) return true;
            if (componentFn && t.isIdentifier(componentFn.params[0])) {
              return isMemberExpression(
                node.argument,
                componentFn.params[0].name,
                propName
              );
            }
            return t.isIdentifier(node.argument, { name: propName });
          });

          if (!spread) {
            return context.report(node, message(propName, refName));
          }
        });
      }
    }));
  }
};
