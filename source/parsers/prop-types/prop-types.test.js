const test = require("ava");

const parse = require("./index").default;

const throwsTemplate = (t, input, errorMessage) => {
  const error = t.throws(() => {
    parse(input);
  });

  t.is(errorMessage, error.message);
};

test(
  "Throws on misspelled string literal",
  throwsTemplate,
  'C.viewmodelMeta = "excd";',
  `Unsupported viewmodelMeta value 'excd'. Expected 'exclude'.`
);
