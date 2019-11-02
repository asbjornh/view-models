import React from "react";
import ReactDOM from "react-dom";

// Both the following components have the same name in their default export statements.
import Component from "./func-component";
import DuplicateComponent from "./nested-component/func-component";

ReactDOM.render(
  React.createElement(
    "div",
    {},
    React.createElement(Component),
    React.createElement(DuplicateComponent)
  ),
  document.getElementById("mount-point")
);
