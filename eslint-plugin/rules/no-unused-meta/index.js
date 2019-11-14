const t = require("@babel/types");

const matchesFile = require("../../utils/matches-file");
const viewModelsVisitor = require("../../utils/view-models-visitor");

const message = name => `'${name}' is not defined in component propTypes`;

module.exports = {
  create: function(context) {
    const [options = {}] = context.options;
    if (!matchesFile(context.getFilename(), options.include)) return {};

    // The exported visitor functions gather information about propTypes, viewModelMeta and file exports. The 'Program:exit' visitor will execute last. When it runs, the validate function is called with the gathered data. 'validate' will report any errors to eslint via the 'context' object.
    return viewModelsVisitor(getState => ({
      "Program:exit": () => {
        const { metaTypes, propTypes } = getState();

        if (!t.isObjectExpression(metaTypes)) return;
        if (!t.isObjectExpression(propTypes)) {
          context.report(metaTypes, "Component has no propTypes");
          return;
        }

        const propNames = propTypes.properties.map(p => p.key.name);

        metaTypes.properties.forEach(node => {
          if (!propNames.includes(node.key.name)) {
            context.report(node.key, message(node.key.name));
          }
        });
      }
    }));
  }
};
