const help = `Usage:
  view-models [options] [files ...]

Example:
  view-models --out=models --generator=typescript source/components/**/*.jsx

Files:
  A list of source file paths. Use a glob pattern!

Options:
  NOTE: Equals sign is required

  --generator=(csharp|kotlin|typescript)
  --header=<string>
  --help
  --indent=<number>
  --log=(true|false)
  --namespace=<string>
  --out=<output-path>
  --ext=<file-extension>
  --parser=(typescriptReact|propTypes)
  --supertype=<string>
`;

module.exports = function printHelp() {
  /* eslint-disable no-console */
  console.log(help);
};
