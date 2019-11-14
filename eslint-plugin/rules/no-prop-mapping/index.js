const t = require("@babel/types");

const matchesFile = require("../../utils/matches-file");
const viewModelsVisitor = require("../../utils/view-models-visitor");

const missingSpread = name =>
  `'${name}' has a reference to a component but has no corresponding spread element`;
const badSpread = (propName, typeName, actualName) =>
  `'${propName}' is of type '${typeName}.propTypes' but it was used to render '${actualName}'`;

// TODO: Docs: 1) No class components 2) Only destructured props
module.exports = {
  create: function(context) {
    const [options = {}] = context.options;
    if (!matchesFile(context.getFilename(), options.include)) return {};

    // A list of props that have been spread
    let spreadProps = [];

    return viewModelsVisitor(getState => ({
      JSXSpreadAttribute: node => {
        const { componentFn } = getState();

        context.getScope().references.forEach(ref => {
          if (ref.identifier.name !== node.argument.name) return;

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
        if (!componentFn || t.isIdentifier(componentFn.params[0])) return;

        propTypes.properties.forEach(node =>
          validate(node, spreadProps, context)
        );
      }
    }));
  }
};

function validate(node, spreadAttributes, context) {
  const type = getPropType(node.value);
  const propName = node.key.name;

  if (!t.isCallExpression(type)) return;
  if (!t.isMemberExpression(type.callee)) return;

  if (isObjectType(type.callee.property)) {
    const refName = getComponentReference(type.arguments[0]);
    if (!refName) return;

    const spread = spreadAttributes.find(node =>
      t.isIdentifier(node.argument, { name: propName })
    );

    if (!spread) {
      return context.report(node, missingSpread(propName));
    }

    if (
      t.isJSXOpeningElement(spread.parent) &&
      !t.isJSXIdentifier(spread.parent.name, { name: refName })
    ) {
      const elementName = spread.parent.name.name;
      context.report(node, badSpread(propName, refName, elementName));
    }
  }
}

function getComponentReference(node) {
  return t.isMemberExpression(node) &&
    t.isIdentifier(node.object) &&
    t.isIdentifier(node.property, { name: "propTypes" })
    ? node.object.name
    : undefined;
}

function isObjectType(node) {
  return (
    t.isIdentifier(node, { name: "shape" }) ||
    t.isIdentifier(node, { name: "exact" })
  );
}

function getPropType(node) {
  if (t.isMemberExpression(node)) {
    return t.isIdentifier(node.property, { name: "isRequired" })
      ? getPropType(node.object)
      : t.isIdentifier(node.object, { name: "PropTypes" })
      ? getPropType(node.property)
      : undefined;
  }
  return node;
}
