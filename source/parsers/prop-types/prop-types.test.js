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
  'C.viewModelMeta = "ignr";',
  `Unsupported viewModelMeta value 'ignr'. Expected 'ignore'.`
);
