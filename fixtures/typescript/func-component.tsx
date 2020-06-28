import * as React from "react";
import { WithMeta } from "../../source/index";

import { LinkProps } from "./link";

enum EnumObject {
  ValueA = "value-a",
  ValueB = "value-b"
}

type FuncComponentProps = {
  any?: any;
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
  objectArray: LinkProps[];
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
  link?: LinkProps;
  linkList?: LinkProps[];
  linkMeta?: LinkProps;
  linkListMeta?: LinkProps[];
  requiredEnum: EnumObject;
  optionalEnum?: EnumObject;

  // These should be ignored
  ignoreMe: number;
  node: JSX.Element;
  function: () => void;
  shapeIgnore?: { a: string };
};

const FuncComponent: WithMeta<FuncComponentProps> &
  React.FunctionComponent<FuncComponentProps> = props => null;

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
