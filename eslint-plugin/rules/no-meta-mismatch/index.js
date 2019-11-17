const t = require("@babel/types");

const matchesFile = require("../../utils/matches-file");
const viewModelsVisitor = require("../../utils/view-models-visitor");
const { getPropTypeName } = require("../../utils/ast-utils");

const message = (metaType, propType) =>
  `'${metaType}' does not match 'PropTypes.${propType}'`;

const findPropNode = (properties, key) =>
  properties.find(node => node.key.name === key.name);

module.exports = {
  create: function(context) {
    const [options = {}] = context.options;
    if (!matchesFile(context.getFilename(), options.include)) return {};

    return viewModelsVisitor(getState => ({
      "Program:exit": () => {
        const { metaTypes, propTypes } = getState();

        if (!t.isObjectExpression(metaTypes)) return;
        if (!t.isObjectExpression(propTypes)) return;

        metaTypes.properties.forEach(node => {
          const prop = findPropNode(propTypes.properties, node.key);
          if (!prop) return;
          validateMeta(prop, node, context);
        });
      }
    }));
  }
};

function validateMeta(propNode, metaNode, context) {
  const typeName = getPropTypeName(propNode.value);
  const metaValue = metaNode.value;

  if (!typeName) return;

  if (t.isLiteral(metaValue)) {
    if (metaValue.value === "ignore" || metaValue.value === "") return;
    if (typeName !== "number") {
      // NOTE: If the meta value isn't "ignore" then all valid literal types describe numbers
      context.report(metaValue, message(metaValue.value, typeName));
    }
  } else if (t.isArrayExpression(metaValue)) {
    if (typeName !== "arrayOf") {
      context.report(metaValue, message("array", typeName));
    }
  } else if (t.isObjectExpression(metaValue)) {
    if (typeName !== "shape" && typeName !== "exact") {
      context.report(metaValue, message("object", typeName));
    }
  }
}
