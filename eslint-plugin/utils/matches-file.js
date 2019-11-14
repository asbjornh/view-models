module.exports = function matchesFile(fileName = "", patterns = [".jsx"]) {
  return patterns.some(pattern => fileName.includes(pattern));
};
