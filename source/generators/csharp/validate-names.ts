import isEquivalent from "../../utils/is-equivalent-string";
import { TypeTree } from "../../lib/node-types";

export default function validateNames(className: string, types: TypeTree) {
  const nameCollision = Object.keys(types).find(isEquivalent(className));

  if (nameCollision) {
    throw new Error(
      `Illegal prop name '${nameCollision}'. Prop names must be different from component name.`
    );
  }
}
