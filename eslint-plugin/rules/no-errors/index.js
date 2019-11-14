const validate = require("./validate");

const matchesFile = require("../../utils/matches-file");
const viewModelsVisitor = require("../../utils/view-models-visitor");

module.exports = {
  create: function(context) {
    const [options = {}] = context.options;
    if (!matchesFile(context.getFilename(), options.include)) return {};

    return viewModelsVisitor(getState => ({
      "Program:exit": node => {
        const { exportDeclarations, metaTypes, propTypes } = getState();

        validate({
          bodyNode: node,
          context,
          exportDeclarations,
          metaTypes,
          propTypes
        });
      }
    }));
  }
};
