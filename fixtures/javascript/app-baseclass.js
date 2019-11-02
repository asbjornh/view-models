import React from "react";
import ReactDOM from "react-dom";

import Component from "./baseclass-component";

ReactDOM.render(
  React.createElement(Component),
  document.getElementById("mount-point")
);
