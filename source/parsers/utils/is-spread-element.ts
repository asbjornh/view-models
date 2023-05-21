import * as t from "@babel/types";

export default function isSpreadElement(node: t.Node): node is t.SpreadElement {
  return t.isSpreadElement(node);
}
