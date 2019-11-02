import React from "react";
import PropTypes from "prop-types";

const BaseClassComponent = ({ prop }) => prop;

BaseClassComponent.propTypes = {
  prop: PropTypes.string
};

export default BaseClassComponent;
