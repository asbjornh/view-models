import dotNotation from "../utils/dot-notation";
import getReferences from "../utils/get-references";
import { TypeTree } from "../../node-types";

export default function generateImports(name: TypeTree, namespace?: string) {
  return getReferences(name).map(name => dotNotation(namespace, name, "*"));
}
