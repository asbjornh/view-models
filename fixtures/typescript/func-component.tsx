/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prefer-stateless-function */
import * as React from "react";
import { WithPropTypesMeta, PropTypesMeta } from "../../prop-types-meta";

import { Link } from "./link";

enum EnumObject {
  ValueA = "value-a",
  ValueB = "value-b"
}

type FuncComponentProps = {
  text: string;
  isSomething?: boolean;
  number?: number;
  intNumber?: number;
  floatNumber?: number;
  texts?: string[];
  singleObject?: {
    propertyA: string;
  };
  objects: { propertyB: string }[];
  objectArray: Link[];
  nestedList?: string[][][];
  nestedIgnore?: {
    a: string;
  };
  nestedNumber?: number[][][];
  nestedShape?: {
    a?: {
      b?: {
        c?: number;
      };
    };
  };
  link?: Link;
  linkList?: Link[];
  linkMeta?: Link;
  linkListMeta?: Link[];
  requiredEnum: EnumObject;
  optionalEnum?: EnumObject;

  // These should be ignored
  ignoreMe: number;
  node: JSX.Element;
  function: () => void;
  shapeIgnore?: { a: string };
};

const FuncComponent: WithPropTypesMeta<
  FuncComponentProps,
  React.FunctionComponent<FuncComponentProps>
> = props => null;

FuncComponent.viewModelMeta = {
  intNumber: "int",
  floatNumber: "float",
  ignoreMe: "ignore",
  shapeIgnore: "ignore",
  nestedIgnore: {
    a: "ignore"
  },
  nestedNumber: [[["float"]]],
  nestedShape: {
    a: {
      b: {
        c: "float"
      }
    }
  }
};

export default FuncComponent;
