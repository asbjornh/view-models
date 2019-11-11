const { metaTypeNames } = require("../lib/node-types");

module.exports = {
  badIgnore: value => `Expected 'ignore' but got '${value}'`,
  badMeta: () =>
    `Expected one of [${Object.values(metaTypeNames)}, array, object]`,
  badStringLiteral: value =>
    `Expected one of [${Object.values(metaTypeNames)}] but got '${value}'.`,
  illegalPropType: name => `Unexpected 'PropTypes.${name}'`,
  illegalFunctionCall: () => `Unexpected function call`,
  illegalIdentifier: () => `Unexpected identifier`,
  illegalReference: () =>
    `Invalid reference. Only components' propTypes can be referenced.`,
  importedArrayReference: () => `Imported arrays are not supported.`,
  importedObjectReference: () => `Imported objects are not supported.`,
  missingObject: () => "Missing object value for prop.",
  noExport: () => `No export statement. Couldn't get component name.`,
  propNameCollision: () => `Prop can't have the same name as the component.`,
  tooManyExports: () => `Too many exports. Couldn't get component name.`
};
