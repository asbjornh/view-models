const path = require("path");

const casing = require("../../utils/casing");

const message = (idName, idCasing, fileName, fileCasing) =>
  `'${idName}' (${idCasing} case) does not match the file name '${fileName}' (${fileCasing} case)`;

module.exports = (context, filePath, fileNode, idName, idNode) => {
  const [options = {}] = context.options;
  const { identifierNaming = "pascal", fileNaming = "kebab" } = options;
  const fileName = path.basename(filePath).replace(/\..+$/, "");
  let parsedFileName;
  let parsedIdName;
  try {
    parsedFileName = casing.parse(fileName, fileNaming);
  } catch (error) {
    return context.report(fileNode, error.message);
  }
  try {
    parsedIdName = casing.parse(idName, identifierNaming);
  } catch (error) {
    return context.report(idNode, error.message);
  }
  if (!casing.isEqual(parsedFileName, parsedIdName)) {
    context.report(
      idNode,
      message(idName, identifierNaming, path.basename(filePath), fileNaming)
    );
  }
};
