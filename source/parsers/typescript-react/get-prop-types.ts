import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

import getDefinitionName from "./get-definition-name";

export default function getPropTypes(ast: t.File, componentName: string) {
  let typeName: string | undefined;
  let types: (t.TSEnumMember | t.TSTypeElement)[] | undefined;
  const typeDeclarations: {
    [key: string]: (t.TSEnumMember | t.TSTypeElement)[];
  } = {};

  traverse(ast, {
    TSEnumDeclaration: (path: NodePath<t.TSEnumDeclaration>) => {
      typeDeclarations[getDefinitionName(path.node.id)] = path.node.members;
    },
    TSInterfaceDeclaration: (path: NodePath<t.TSInterfaceDeclaration>) => {
      typeDeclarations[getDefinitionName(path.node.id)] = path.node.body.body;
    },
    TSTypeAliasDeclaration: (path: NodePath<t.TSTypeAliasDeclaration>) => {
      const name = getDefinitionName(path.node.id);
      if (
        t.isTSTypeLiteral(path.node.typeAnnotation) ||
        t.isTSEnumDeclaration(path.node.typeAnnotation)
      ) {
        typeDeclarations[name] = path.node.typeAnnotation.members;
      }
    },
    ClassDeclaration: (path: NodePath<t.ClassDeclaration>) => {
      if (!path.node.id || path.node.id.name !== componentName) return;
      if (!path.node.superTypeParameters) return;

      const [type] = path.node.superTypeParameters.params;

      if (t.isTSTypeReference(type)) {
        const name = getDefinitionName(type.typeName);
        typeName = name;
        types = typeDeclarations[name];
      } else if (t.isTSTypeLiteral(type)) {
        types = type.members;
      }
    },
    ArrowFunctionExpression: path => {
      if (!t.isVariableDeclarator(path.parent)) return;
      if (!t.isIdentifier(path.parent.id)) return;
      if (path.parent.id.name !== componentName) return;

      const arg = path.node.params[0];

      if (t.isTSParameterProperty(arg)) {
        throw new Error(`Unexpected parameter property`);
      } else if (t.isNoop(arg.typeAnnotation)) {
        throw new Error(`Unexpected noop in type annotation`);
      } else if (arg.typeAnnotation === null) {
        return;
      }

      const argType = arg.typeAnnotation.typeAnnotation;

      if (argType) {
        if (t.isTSTypeReference(argType)) {
          const name = getDefinitionName(argType.typeName);
          types = typeDeclarations[name];
          typeName = name;
        } else if (t.isTSTypeLiteral(argType)) {
          types = argType.members;
        }
        return;
      }

      if (!t.isTSTypeAnnotation(path.parent.id.typeAnnotation)) return;

      const parentType = path.parent.id.typeAnnotation.typeAnnotation;

      if (!t.isTSExpressionWithTypeArguments(parentType)) return;

      if (parentType.typeParameters !== null) {
        const type = parentType.typeParameters.params[0];
        if (t.isTSTypeReference(type)) {
          const name = getDefinitionName(type.typeName);
          types = typeDeclarations[name];
          typeName = name;
        } else if (t.isTSTypeLiteral(type)) {
          types = type.members;
        }
      }
    }
  });

  return { typeDeclarations, typeName, types };
}
