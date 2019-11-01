import capitalize from "./capitalize";

const prefixString = (s: string[]) =>
  s.reduce((a, s) => a + capitalize(s) + "_", "");

export default function parentPrefixedName(
  name: string,
  parents: string[] = []
) {
  return `${prefixString(parents)}${capitalize(name)}`;
}
