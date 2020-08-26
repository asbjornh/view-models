const objectFromEntries = require("./object-from-entries");
const printHelp = require("./print-help");

/* eslint-disable no-console */
module.exports = function cliInput() {
  if (process.argv.length === 2 || process.argv.includes("--help")) {
    printHelp();
    process.exit(0);
  }

  const config = objectFromEntries(
    process.argv
      .slice(2)
      .filter(argv => argv.includes("--"))
      .map(arg => arg.replace("--", "").split("="))
  );
  const files = process.argv
    .slice(2)
    .filter(argv => !argv.startsWith("--") && !argv.startsWith("-"));

  if (!config.out) {
    console.error(`ERROR: 'out' option is required.`);
    process.exit(1);
  }

  if (!files.length) {
    console.error(`ERROR: No input files specified.`);
    process.exit(1);
  }

  return { config, files };
};
