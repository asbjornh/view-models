import React from "react";
import ReactDOM from "react-dom";

import Component from "./func-component";
import ClassComponent from "./class-component";

ReactDOM.render(
  React.createElement(
    "div",
    {},
    React.createElement(Component),
    React.createElement(ClassComponent)
  ),
  document.getElementById("mount-point")
);
