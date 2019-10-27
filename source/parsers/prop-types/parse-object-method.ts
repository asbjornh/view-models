import * as t from "@babel/types";

import getFunctionName from "../../utils/get-function-name";

const getKey = ({ key }: t.ObjectProperty): string => {
  if (t.isStringLiteral(key)) return key.value;
  if (t.isIdentifier(key)) return key.name;
  throw new Error(`Unexpected ${key.type} in object property.`);
};

const getValue = ({ value }: t.ObjectProperty): string | number => {
  if (t.isStringLiteral(value)) return value.value;
  if (t.isNumericLiteral(value)) return value.value;
  throw new Error(`Unexpected ${value.type} in object property.`);
};

const validateProperty = (node: t.Node): t.ObjectProperty => {
  if (!t.isObjectProperty(node))
    throw new Error(`Unexpected ${node.type} in object property.`);
  if (node.computed) {
    throw new Error(`Computed object keys are not supported.`);
  }
  return node;
};

export default function parseObjectMethod(node: t.CallExpression) {
  const { callee } = node;
  const [argument] = node.arguments;
  const funcName = getFunctionName(node);

  if (!argument || !t.isMemberExpression(callee)) return;
  if (!t.isObjectExpression(argument))
    throw new Error(`Unexpected ${argument.type} in '${funcName}'.`);

  const { properties } = argument;

  switch (callee.property.name) {
    case "keys":
      return properties.map(validateProperty).map(p => ({
        key: getKey(p),
        value: getKey(p)
      }));
    case "values":
      return properties.map(validateProperty).map(p => ({
        key: getKey(p),
        value: getValue(p)
      }));
    default:
      throw new Error(`Unsupported method '${funcName}'.`);
  }
}
