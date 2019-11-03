import unknownToPascal from "./unknown-to-pascal";

export default function unknownToCamel(str = "") {
  if (str.length === 0) return str;

  const pascalString = unknownToPascal(str);
  return (
    pascalString[0].toLowerCase() + pascalString.slice(1, pascalString.length)
  );
}
