import "ts-node/register";
import parse from "./source/parsers/prop-types/index";

parse(`
import PropTypes from "prop-types";
const Component = {};
Component.propTypes = {
  a: PropTypes.number
};
Component.viewModelMeta = {
  a: "int"
};
export default Component;`);
