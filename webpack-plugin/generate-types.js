const fs = require("fs");

const { compile } = require("../lib");

module.exports = function generateTypes(modulePaths, compilerOptions) {
  const startTime = new Date().getTime();
  const types = modulePaths.map(attemptGenerateType(compilerOptions));
  const duplicates = checkForDuplicates(types, modulePaths);

  return {
    types,
    duration: new Date().getTime() - startTime,
    error: duplicates.length
      ? `Found duplicate component names in:\n${duplicates.join("\n")}`
      : null
  };
};

function attemptGenerateType(compilerOptions) {
  return modulePath => {
    try {
      const sourceCode = fs.readFileSync(modulePath, "utf-8");
      return compile(sourceCode, compilerOptions);
    } catch (error) {
      return { error: `\n${modulePath}\n${error.message}\n` };
    }
  };
}

function checkForDuplicates(typeDefinitions, modulePaths) {
  return typeDefinitions.reduce((accum, { typeName }, index) => {
    const indexOfDuplicate = typeDefinitions
      .slice(index + 1) // Ensures that the same pair of duplicates doesn't get reported twice
      .findIndex(c => c.typeName === typeName);

    if (typeName && indexOfDuplicate !== -1) {
      return accum.concat(
        `${typeName} (${modulePaths[index]})`,
        `${typeName} (${modulePaths[indexOfDuplicate + 1]})`
      );
    }

    return accum;
  }, []);
}
