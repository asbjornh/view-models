const validate = require("./validate");

const viewModelsVisitor = require("../../utils/view-models-visitor");

module.exports = {
  create: function(context) {
    if (!context.getFilename().includes(".jsx")) {
      return {};
    }

    // The exported visitor functions gather information about propTypes, viewModelMeta and file exports. The 'Program:exit' visitor will execute last. When it runs, the validate function is called with the gathered data. 'validate' will report any errors to eslint via the 'context' object.
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