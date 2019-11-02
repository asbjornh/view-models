const test = require("ava");

const { generators } = require("../test-utils/import-lib");

const getFileExtension = require("./get-file-extension");

test("Returns an extension for all exposed generators", t => {
  Object.values(generators).forEach(generator => {
    const extension = getFileExtension(generator);
    t.is(true, extension.length > 0);
  });
});
