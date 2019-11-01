import capitalize from "../utils/capitalize";
import unknownToPascal from "../utils/unknown-to-pascal";

import { EnumNode } from "../../lib/node-types";

// Returns the body of an enum definition as string
export default function enumProperties(
  name: string,
  { children, required }: EnumNode
): string {
  // Add empty element to start of list if not required
  const isStringsOnly = children.every(
    ({ value }) => typeof value === "string"
  );
  const emptyElement = isStringsOnly
    ? { key: "", value: "" }
    : { key: "0", value: 0 };
  const hasZero = children.some(({ value }) => value === 0);

  const firstElement = required || hasZero ? [] : [emptyElement];
  const values = [...firstElement, ...children];

  return values
    .map(({ key, value }, index) => {
      if (typeof value === "number") {
        const propertyName = value === 0 ? "None" : capitalize(name) + value;
        return `${propertyName} = ${index},`;
      }

      const propertyName = unknownToPascal(key) || "None";

      return `[EnumMember(Value = "${value}")]\n${propertyName} = ${index},`;
    })
    .join("\n");
}
