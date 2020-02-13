import * as React from "react";
import { ViewModelMeta } from "../../source/index";

import { LinkProps } from "./link";

enum EnumObject {
  ValueA = "value-a",
  ValueB = "value-b"
}

type ClassComponentProps = {
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

class ClassComponent extends React.Component<ClassComponentProps> {
  static propTypes = {};

  static viewModelMeta: ViewModelMeta<ClassComponentProps> = {
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

  render() {
    return <div />;
  }
}

export default ClassComponent;
