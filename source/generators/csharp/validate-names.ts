import isEquivalent from "../../utils/is-equivalent-string";
import { TypeTree } from "../../node-types";

export default function validateNames(typeName: string, types: TypeTree) {
  const nameCollision = Object.keys(types).find(isEquivalent(typeName));

  if (nameCollision) {
    throw new Error(
      `Illegal prop name '${nameCollision}'. Prop names must be different from component name.`
    );
  }
}
