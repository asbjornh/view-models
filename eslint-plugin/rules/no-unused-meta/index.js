const t = require("@babel/types");

const matchesFile = require("../../utils/matches-file");
const viewModelsVisitor = require("../../utils/view-models-visitor");

const message = name => `'${name}' is not defined in component propTypes`;

module.exports = {
  create: function(context) {
    const [options = {}] = context.options;
    if (!matchesFile(context.getFilename(), options.include)) return {};

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
