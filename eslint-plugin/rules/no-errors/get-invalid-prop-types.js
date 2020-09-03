const t = require("@babel/types");

const isObjectMethod = require("../../../lib/parsers/utils/is-object-method")
  .default;
const messages = require("./messages");

const illegalPropTypes = ["array", "object", "oneOfType", "symbol"];

const makeHasLiteral = variablesInScope => (node, babelValidator) =>
  variablesInScope.some(
    variable =>
      variable.name === node.name &&
      babelValidator(variable.references[0].writeExpr)
  );

const getInvalidPropTypes = (objectExpression, scope) => {
  if (!objectExpression || !objectExpression.properties) {
    return {};
  }

  return objectExpression.properties.reduce((accum, objectProperty) => {
    const key = objectProperty.key.name;
    const value = objectProperty.value;

    const error = getInvalidPropType(value, scope);

    return error ? Object.assign(accum, { [key]: error }) : accum;
  }, {});
};

function getInvalidPropType(value, scope) {
  const childScope = (scope.childScopes || [])[0] || {};
  const variablesInScope = childScope.type === "module" && childScope.variables;
  const hasLiteral = makeHasLiteral(variablesInScope);

  if (
    t.isMemberExpression(value) &&
    t.isIdentifier(value.property, { name: "isRequired" })
  ) {
    return getInvalidPropType(value.object, scope);
  }

  // Function calls not coming from PropTypes are illegal. Detect this by checking if the callee is an identifier (PropTypes.something is a MemberExpression).
  if (t.isCallExpression(value) && t.isIdentifier(value.callee)) {
    return { node: value, message: messages.illegalFunctionCall() };
  }

  // propTypeNode might be a CallExpression node (like in 'PropTypes.arrayOf()'), in which case the propType node will be accessible in obectProperty.value.callee. If not, the node is a MemberExpression, and the node is accessible in objectProperty.value.
  const propTypeNode = value.callee || value;

  if (!t.isMemberExpression(propTypeNode)) {
    return { node: value, message: messages.illegalIdentifier() };
  }

  const propTypeName = propTypeNode.property.name;

  if (illegalPropTypes.includes(propTypeName)) {
    return {
      node: propTypeNode.property,
      message: messages.illegalPropType(propTypeName)
    };
  }

  if (t.isCallExpression(value)) {
    value.arguments.filter(t.isMemberExpression).forEach(argument => {
      const typeName = argument.property.name;
      if (illegalPropTypes.includes(typeName)) {
        return {
          node: argument.property,
          message: messages.illegalPropType(typeName)
        };
      }
    });
  }

  if (t.isCallExpression(value) && propTypeName === "arrayOf") {
    return getInvalidPropType(value.arguments[0], scope);
  }

  // Check member expressions or recursively check object literals inside shape and exact
  if (t.isCallExpression(value) && ["shape", "exact"].includes(propTypeName)) {
    const [argument] = value.arguments;

    if (
      t.isMemberExpression(argument) &&
      !t.isIdentifier(argument.property, { name: "propTypes" })
    ) {
      return { node: argument, message: messages.illegalReference() };
    }

    return getInvalidPropTypes(argument, scope);
  }

  // Check for references inside PropTypes.oneOf. Run checks only if there are defined variables in scope. Undefined variables are caught by 'no-undef', which every sane person should be using.
  if (
    t.isCallExpression(value) &&
    propTypeName === "oneOf" &&
    variablesInScope.length
  ) {
    const [argument] = value.arguments;

    // Check references to arrays
    if (t.isIdentifier(argument)) {
      if (!hasLiteral(argument, t.isArrayExpression)) {
        return {
          node: argument,
          message: messages.importedArrayReference()
        };
      }
    }

    // Check references to objects in Object.keys and Object.values
    if (
      t.isCallExpression(argument) &&
      isObjectMethod(argument) &&
      ["keys", "values"].includes(argument.callee.property.name)
    ) {
      const [objectMethodArgument] = argument.arguments;

      if (objectMethodArgument) {
        if (!hasLiteral(objectMethodArgument, t.isObjectExpression)) {
          return {
            node: objectMethodArgument,
            message: messages.importedObjectReference()
          };
        }
      } else {
        return {
          node: argument,
          message: messages.missingObject()
        };
      }
    }
  }
}

module.exports = getInvalidPropTypes;
