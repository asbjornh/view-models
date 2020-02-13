module.exports = function objectFromEntries(entries) {
  return entries.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};
