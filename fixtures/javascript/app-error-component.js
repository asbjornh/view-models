import React from "react";
import ReactDOM from "react-dom";

import ErrorComponent from "./error-component";

ReactDOM.render(
  React.createElement(ErrorComponent),
  document.getElementById("mount-point")
);
