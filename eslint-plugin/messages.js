const { metaTypeNames } = require("../lib/node-types");

module.exports = {
  array: () =>
    'Unsupported type "array". Replace with "arrayOf" or add meta type',
  badIgnore: value => `Expected 'ignore' but got '${value}'`,
  badMeta: () =>
    `Expected one of [${Object.values(metaTypeNames)}, array, object]`,
  badStringLiteral: value =>
    `Expected one of [${Object.values(metaTypeNames)}] but got '${value}'.`,
  illegalFunctionCall: () => `Illegal function call`,
  illegalIdentifier: () => `Illegal identifier`,
  illegalReference: () =>
    `Illegal reference. Only components' propTypes can be referenced.`,
  importedArrayReference: () => `Imported arrays are not supported.`,
  importedObjectReference: () => `Imported objects are not supported.`,
  missingObjectReference: () => "Missing object value for prop.",
  noExport: () => `No export statement. Couldn't get component name.`,
  object: () =>
    'Unsupported type "object". Replace with "shape" or add meta type.',
  oneOfType: () => 'Unsupported type "oneOfType".',
  propNameCollision: () => `Prop can't have the same name as the component.`,
  tooManyExports: () => `Too many exports. Couldn't get component name.`
};
