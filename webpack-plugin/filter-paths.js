// Replaces backslashes with forward slashes so that there's no windows/unix path syntax confusion
const normalize = str =>
  typeof str === "string" ? str.replace(/\\+/g, "/") : str || "";

// paths: array (string). Array of paths to filter
// include: array (string|RegExp). Array of patterns to compare with path
//    A path that matches any element in 'include' is included (unless it matches an element in 'exclude').
// exclude: array (string|RegExp). Array of patterns to compare with path
//    A path that matches any elemet in 'exclude' is excluded.

const matches = (path, pattern) => normalize(path).match(normalize(pattern));

const filterPaths = (
  paths = [],
  includePatterns = [],
  excludePatterns = []
) => {
  return paths.filter(
    path =>
      includePatterns.some(pattern => matches(path, pattern)) &&
      excludePatterns.every(pattern => !matches(path, pattern))
  );
};

module.exports = filterPaths;
