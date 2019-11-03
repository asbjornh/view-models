import unknownToCamel from "../utils/unknown-to-camel";
import { EnumNode } from "../../node-types";

// Returns the body of an enum definition as string
export default function enumProperties({ children }: EnumNode) {
  return (
    children
      .map(({ key, value }) => `${unknownToCamel(key)}("${value}")`)
      .join(",\n") + ";"
  );
}
