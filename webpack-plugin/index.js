const path = require("path");

const filterPaths = require("./filter-paths");
const getFileExtension = require("./get-file-extension");
const generateTypes = require("./generate-types");
const { log, logError } = require("./log");

const defaultOptions = {
  compilerOptions: {},
  exclude: ["node_modules"],
  fileExtension: undefined,
  include: [/\.jsx$/],
  log: false,
  metaFileGenerator: () => [],
  path: ""
};

function ViewModelsPlugin(options) {
  this.options = Object.assign({}, defaultOptions, options);
}

ViewModelsPlugin.prototype.apply = function(compiler) {
  compiler.hooks.emit.tap(
    { name: "ViewModelsPlugin" },
    compilation => runThePlugin(compilation, this.options) // This callback runs every time the 'emit' webpack event occurs
  );
};

function runThePlugin(compilation, options) {
  const assertArray = (arr, name) =>
    Array.isArray(arr)
      ? true
      : logError(compilation, `Bad configuration: ${name} is not an array`);

  if (
    compilation.errors.length || // Abort if compilation has errors
    !assertArray(options.exclude, "options.exclude") ||
    !assertArray(options.include, "options.include")
  ) {
    return;
  }

  if (options.log) {
    process.stdout.write("[ViewModel plugin]: Generating types...\n");
  }

  const modulePaths = filterPaths(
    Array.from(compilation.fileDependencies),
    options.include,
    options.exclude
  );

  const result = generateTypes(modulePaths, options.compilerOptions);
  log(options, compilation, result);

  const outputPath = path.normalize(options.path);
  const fileExtension =
    options.fileExtension ||
    getFileExtension(options.compilerOptions.generator) ||
    "cs";

  if (!result.error) {
    const types = result.types.filter(type => type.code && type.typeName);
    types.forEach(({ code, typeName }) => {
      const fileName = `${typeName}.${fileExtension}`;
      const filePath = path.join(outputPath, fileName);
      const asset = { source: () => code, size: () => code.length };
      compilation.assets[filePath] = asset;
    });
    const metadata = types.map(({ componentName, sourcePath, typeName }) => ({
      componentName,
      sourcePath,
      typeName
    }));
    options.metaFileGenerator(metadata).forEach(file => {
      const filePath = path.join(outputPath, file.path);
      compilation.assets[filePath] = {
        source: () => file.content,
        size: () => file.content.length
      };
    });
  }
}

ViewModelsPlugin["default"] = ViewModelsPlugin;
module.exports = ViewModelsPlugin;
