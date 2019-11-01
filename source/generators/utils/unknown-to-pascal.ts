import capitalize from "./capitalize";

export default function unknownToPascal(string: string = "") {
  return string
    .split(/[^a-zA-Z\d]/g)
    .filter(v => v)
    .reduce((a, s) => a + capitalize(s), "");
}
