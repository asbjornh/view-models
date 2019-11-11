import PropTypes from "prop-types";

const A = {};
A.propTypes = { b: PropTypes.string };
A.viewModelMeta = { b: "ignore", c: "int" };

export default A;
