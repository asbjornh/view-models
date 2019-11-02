module.exports = function({ types: t }) {
  const isMeta = (node, key) =>
    t.isIdentifier(node[key], { name: "viewModelMeta" });

  return {
    visitor: {
      AssignmentExpression(path) {
        const value = path.node.left;
        if (t.isMemberExpression(value) && isMeta(value, "property")) {
          path.remove();
        }

        // Can't do path.skip() for this one for some strange reason. See https://github.com/Creuna-Oslo/prop-types-csharp-webpack-plugin/issues/21
      },
      ClassDeclaration(path) {
        const newBody = path.node.body.body.filter(
          node => !isMeta(node, "key")
        );
        path.get("body").replaceWith(t.classBody(newBody));
      }
    }
  };
};
