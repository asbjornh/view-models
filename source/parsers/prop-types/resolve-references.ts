import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

import { MetaTypeTree } from "../../lib/node-types";

import isObjectMethod from "../utils/is-object-method";
import isMemberExpression from "../utils/is-member-expression";

/** Replace references in `PropTypes.oneOf` with value literals */
export default function resolveReferences(
  AST: t.File,
  componentName: string,
  propTypesIdentifier: string,
  meta: MetaTypeTree = {}
) {
  traverse(AST, {
    CallExpression(path) {
      const callee = path.get("callee");

      if (
        !callee.isMemberExpression() ||
        !isMemberExpression(propTypesIdentifier, "oneOf", path.node.callee)
      ) {
        return;
      }

      const propPath = path.findParent(t.isObjectProperty) as NodePath<
        t.ObjectProperty
      >;
      const propName: string = propPath.node.key.name;
      const metaType = meta[propName] ? meta[propName].type : "";
      const argument = path.node.arguments[0];

      if (!argument) {
        throw new Error(
          `Missing value in 'PropTypes.oneOf' for prop '${propName}'`
        );
      }

      // Abort if meta type is 'exclude'. Actual removal of the node happens later
      if (metaType === "exclude") return;

      const missingLiteralError = (argumentName: string) =>
        new Error(
          `Couldn't resolve value in 'PropTypes.oneOf' for prop '${propName}'. Make sure that '${argumentName}' is assigned a value in the above file.`
        );

      // Reference to an array
      if (t.isIdentifier(argument)) {
        if (!path.scope.hasBinding(argument.name)) {
          throw missingLiteralError(argument.name);
        }

        // Class components have their bindings nested inside a key equal to the class name
        const bindings = path.scope.hasOwnBinding(argument.name)
          ? path.scope.bindings
          : path.scope.bindings[componentName].scope.bindings;

        const binding = bindings[argument.name];

        if (!t.isVariableDeclarator(binding.path.node))
          throw missingLiteralError(argument.name);

        const arrayLiteral = binding.path.node.init;

        if (!arrayLiteral) throw missingLiteralError(argument.name);

        path.node.arguments = [arrayLiteral];
      }

      // Object.keys, Object.values
      else if (t.isCallExpression(argument) && isObjectMethod(argument)) {
        const objectMethod = argument;
        const methodArg = objectMethod.arguments[0];

        if (!methodArg) {
          throw new Error(
            `Missing value in 'PropTypes.oneOf' for prop '${propName}'`
          );
        }

        if (!t.isIdentifier(methodArg)) {
          throw new Error(
            `Expected 'Identifier' but got '${methodArg.type}' in Object method for prop '${propName}`
          );
        }

        if (!path.scope.hasBinding(methodArg.name)) {
          throw missingLiteralError(methodArg.name);
        }

        // NOTE: Class components have their bindings nested inside a key equal to the class name
        const bindings = path.scope.hasOwnBinding(methodArg.name)
          ? path.scope.bindings
          : path.scope.bindings[componentName].scope.bindings;

        const binding = bindings[methodArg.name];

        if (!t.isVariableDeclarator(binding.path.node))
          throw missingLiteralError(methodArg.name);

        const objectLiteral = binding.path.node.init;

        if (!objectLiteral) {
          throw missingLiteralError(methodArg.name);
        }

        objectMethod.arguments = [objectLiteral];
      }
    }
  });
}
