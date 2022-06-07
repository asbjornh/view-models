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

function isPropType(node, typeName) {
  return isMemberExpression(node, "PropTypes", typeName);
}

/** t.isLiteral or t.isStringLiteral can't safely be used to check for literals because they always return `false` for ESTree Literal nodes */
function isStringLiteral(node) {
  return (
    t.isStringLiteral(node) ||
    // NOTE: check for ESTree string literal nodes, which are different from Babel:
    (node.type === "Literal" && typeof node.value === "string")
  );
}

// Returns the PropTypes node without 'PropTypes.' and 'isRequired'
function getCleanPropType(node) {
  if (t.isMemberExpression(node)) {
    return t.isIdentifier(node.property, { name: "isRequired" })
      ? getCleanPropType(node.object)
      : t.isIdentifier(node.object, { name: "PropTypes" })
      ? getCleanPropType(node.property)
      : undefined;
  }
  return node;
}

// If type has children (such as with PropTypes.shape) those types are returned (as ObjectProperty nodes). Expects a PropTypes valitaror node
function getInnerPropTypes(node) {
  const type = getCleanPropType(node);
  if (!t.isCallExpression(type)) return [];
  if (isPropType(type.callee, "arrayOf"))
    return getInnerPropTypes(type.arguments[0]);
  if (isObjectType(type.callee) && t.isObjectExpression(type.arguments[0]))
    return type.arguments[0].properties;
  return [];
}

// Returns the name of a PropType node (string)
function getPropTypeName(node) {
  if (t.isMemberExpression(node)) {
    return getPropTypeName(getCleanPropType(node));
  } else if (t.isCallExpression(node)) {
    return getPropTypeName(node.callee);
  } else if (t.isIdentifier(node)) {
    return node.name;
  }
}

module.exports = {
  getCleanPropType,
  getReferenceName,
  getInnerPropTypes,
  getPropTypeName,
  isClassProp,
  isMemberExpression,
  isObjectType,
  isPropType,
  isStringLiteral
};
