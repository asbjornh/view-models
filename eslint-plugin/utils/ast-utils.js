const t = require("@babel/types");

// If the node is a member expression like `<name>.propTypes`, returns `<name>` as string
function getReferenceName(node) {
  return t.isMemberExpression(node) &&
    t.isIdentifier(node.object) &&
    t.isIdentifier(node.property, { name: "propTypes" })
    ? node.object.name
    : undefined;
}

// Returns true if the node is a member expression like `this.props.<name>`
function isClassProp(node, name) {
  return (
    t.isMemberExpression(node.object) &&
    t.isThisExpression(node.object.object) &&
    t.isIdentifier(node.object.property, { name: "props" }) &&
    t.isIdentifier(node.property, name ? { name } : undefined)
  );
}

function isMemberExpression(node, objectName, propertyName) {
  return (
    t.isMemberExpression(node) &&
    t.isIdentifier(node.object, objectName && { name: objectName }) &&
    t.isIdentifier(node.property, propertyName && { name: propertyName })
  );
}

function isObjectType(node) {
  return (
    isMemberExpression(node, "PropTypes", "shape") ||
    isMemberExpression(node, "PropTypes", "exact")
  );
}

// Returns the PropTypes node without 'PropTypes.' and 'isRequired'
function getInnerPropType(node) {
  if (t.isMemberExpression(node)) {
    return t.isIdentifier(node.property, { name: "isRequired" })
      ? getInnerPropType(node.object)
      : t.isIdentifier(node.object, { name: "PropTypes" })
      ? getInnerPropType(node.property)
      : undefined;
  }
  return node;
}

// Returns the name of a PropType node (string)
function getPropTypeName(node) {
  if (t.isMemberExpression(node)) {
    return getPropTypeName(getInnerPropType(node));
  } else if (t.isCallExpression(node)) {
    return getPropTypeName(node.callee);
  } else if (t.isIdentifier(node)) {
    return node.name;
  }
}

module.exports = {
  getInnerPropType,
  getReferenceName,
  getPropTypeName,
  isClassProp,
  isMemberExpression,
  isObjectType
};
