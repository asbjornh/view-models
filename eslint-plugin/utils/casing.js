const parseKebab = (string = "") => {
  if (string.match(/[A-Z]/)) throw new Error(`'${string}' is not kebab case`);
  return string.split("-");
};
const parseSnake = (string = "") => {
  if (string.match(/[A-Z]/)) throw new Error(`'${string}' is not snake case`);
  return string.split("_");
};

const parseCamelPascal = (string = "") =>
  string
    .split("")
    .reduce((parts, letter = "") => {
      const [word = "", ...rest] = parts;
      return letter && letter.match(/[A-Z]/)
        ? word
          ? [letter, word, ...rest]
          : [letter, ...rest]
        : [word + letter, ...rest];
    }, [])
    .map(word => word.toLowerCase())
    .reverse();

const parseCamel = (string = "") => {
  if (string.match(/^[A-Z]/)) throw new Error(`'${string}' is not camel case`);

  return parseCamelPascal(string);
};

const parsePascal = (string = "") => {
  if (!string.match(/^[A-Z]/))
    throw new Error(`'${string}' is not pascal case`);

  return parseCamelPascal(string);
};

const isEqual = (a = [], b = []) => a.join("##") === b.join("##");

const parse = (string, casing = "kebab") => {
  switch (casing) {
    case "kebab":
      return parseKebab(string);
    case "snake":
      return parseSnake(string);
    case "camel":
      return parseCamel(string);
    case "pascal":
      return parsePascal(string);
    default:
      throw Error(`Unknown casing option '${casing}'`);
  }
};

module.exports = {
  isEqual,
  parse
};
