const t = require("@babel/types");

const { metaTypeNames } = require("../lib/node-types");
const getInvalidPropTypes = require("./get-invalid-prop-types");
const isEquivalent = require("../lib/utils/is-equivalent-string").default;
const messages = require("./messages");

const isAllowed = string => metaTypeNames[string];

module.exports = ({
  bodyNode,
  context,
  exportDeclarations,
  metaTypes, // Literal node or js object with ObjectProperty nodes as values
  propTypes,
  propNames
}) => {
  const report = (node, message) => context.report({ node, message });

  if (t.isLiteral(metaTypes, { value: "ignore" })) return;

  if (t.isLiteral(metaTypes)) {
    report(metaTypes, messages.badIgnore(metaTypes.value));
  }

  if (exportDeclarations.length > 1) {
    exportDeclarations.forEach(declaration => {
      report(declaration, messages.tooManyExports());
    });
  } else if (!exportDeclarations.length) {
    report(bodyNode, messages.noExport());
  } else {
    const componentName = exportDeclarations[0].name;
    propNames.forEach(prop => {
      if (isEquivalent(prop.name)(componentName)) {
        report(prop, messages.propNameCollision());
      }
    });
  }

  if (propTypes) {
    const invalidPropTypes = getInvalidPropTypes(propTypes, context.getScope());

    const recursiveValidatePropTypes = (propTypes, metaTypes = {}) => {
      Object.entries(propTypes)
        .filter(([key]) => !metaTypes[key])
        .forEach(([key, { node, message }]) => {
          // If the object doesn't have a node or a message, the object is an object literal from PropTypes.shape. Validate propTypes for this object literal:
          if (!node || !message) {
            recursiveValidatePropTypes(propTypes[key], metaTypes[key]);
            return;
          }

          report(node, message);
        });
    };

    recursiveValidatePropTypes(invalidPropTypes, metaTypes);
  }

  if (!t.isLiteral(metaTypes)) {
    Object.values(metaTypes).forEach(node => {
      const handleLiteral = () => {
        if (!isAllowed(node.value)) {
          report(node, messages.badStringLiteral(node.value));
        }
      };

      const handleArray = () => {
        const [element] = node.elements;
        if (t.isLiteral(element) && !isAllowed(element)) {
          report(node, messages.badStringLiteral(element.value));
        }
      };

      if (t.isIdentifier(node) || t.isObjectExpression(node)) {
        return;
      } else if (t.isLiteral(node)) {
        handleLiteral(node);
      } else if (t.isArrayExpression(node)) {
        handleArray(node);
      } else {
        report(node, messages.badMeta());
      }
    });
  }
};
