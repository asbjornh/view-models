import * as t from "@babel/types";

export default function typeNodeName(n: t.Node) {
  return t.isTSAnyKeyword(n)
    ? "any"
    : t.isTSIntersectionType(n)
    ? "intersection type"
    : t.isTSLiteralType(n)
    ? "literal type"
    : t.isTSNeverKeyword(n)
    ? "never"
    : t.isTSObjectKeyword(n)
    ? "object"
    : t.isTSUnionType(n)
    ? "union type"
    : t.isTSVoidKeyword(n)
    ? "void"
    : n.type;
}
